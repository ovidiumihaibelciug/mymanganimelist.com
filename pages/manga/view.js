import React, { Component } from "react";

import axios from "axios";

import { KAPI } from "../../utils";
import ItemView from "../../components/ItemView";
import AppWrapper from "../../components/AppWrapper";
import Loading from "../../components/Loading";

export default class AnimeView extends Component {
  static getInitialProps({ query: { slug } }) {
    return { slug };
  }

  state = {
    anime: "",
    genres: [],
    chapters: [],
    characters: [],
    franchises: [],
    loading: true,
    isOpen: false
  };

  componentDidMount() {
    this.getManga(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getManga(nextProps);
  }

  getManga = props => {
    const { slug } = props;

    axios
      .get(KAPI + "/manga", {
        params: {
          "filter[slug]": slug,
          include: "genres,categories,mediaRelationships.destination"
        }
      })
      .then(({ data }) => {
        console.log(data);
        const categories =
          data.included &&
          data.included.filter(item => item.type === "categories");
        const franchises =
          data.included &&
          data.included.filter(
            item => item.type === "manga" || item.type === "anime"
          );
        this.setState({
          anime: data.data[0],
          categories,
          franchises
        });

        const userStore = JSON.parse(localStorage.getItem("user"));
        axios
          .all([
            axios.get(KAPI + "/chapters", {
              params: {
                "filter[mangaId]": data.data[0].id,
                "page[limit]": 8
              }
            }),
            axios.get(KAPI + `/manga-characters/`, {
              params: {
                "filter[mangaId]": data.data[0].id,
                "page[limit]": 8,
                include: "character"
              }
            }),
            userStore &&
              axios.get(KAPI + "/users?filter%5Bself%5D=true", {
                headers: {
                  Authorization: "Bearer " + userStore.data.access_token
                },
                params: {
                  include: "favorites.item"
                }
              })
          ])
          .then(
            ([
              chapterData = false,
              charactersData = false,
              userData = false
            ]) => {
              const user = userData
                ? {
                    ...userData.data.data[0],
                    included: userData.data.included
                  }
                : false;
              this.setState({
                chapters: chapterData.data.data,
                characters: charactersData.data.data.included,
                user,
                loading: false
              });
            }
          )
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  };

  render() {
    const { loading } = this.state;
    if (loading) return <Loading />;

    return (
      <AppWrapper title="123">
        <ItemView data={this.state} />
      </AppWrapper>
    );
  }
}
