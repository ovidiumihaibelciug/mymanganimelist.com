import React, { Component } from "react";
import axios from "axios";
import { KAPI } from "../utils";
import ItemView from "../components/ItemView";
import AppWrapper from "../components/AppWrapper";
import Loading from "../components/Loading";

export default class Anime extends Component {
  static getInitialProps({ query: { slug } }) {
    return { slug };
  }

  state = {
    anime: "",
    genres: [],
    episodes: [],
    characters: [],
    franchises: [],
    user: false,
    loading: true,
    isOpen: false
  };

  componentWillReceiveProps(nextProps) {
    this.getAnime(nextProps);
  }

  componentDidMount() {
    this.getAnime(this.props);
  }

  getAnime = props => {
    const { slug } = props;
    axios
      .get(KAPI + "/anime", {
        params: {
          "filter[slug]": slug,
          include: "genres,categories,mediaRelationships.destination"
        }
      })
      .then(({ data }) => {
        const categories = data.included.filter(
          item => item.type === "categories"
        );
        const franchises = data.included.filter(
          item => item.type === "manga" || item.type === "anime"
        );
        this.setState({
          anime: data.data[0],
          categories,
          franchises
        });
        axios
          .get(KAPI + "/episodes", {
            params: {
              "filter[mediaId]": data.data[0].id,
              "page[limit]": 8,
              "page[offset]": 0
            }
          })
          .then(({ data }) => {
            this.setState({
              episodes: data.data
            });
          })
          .catch(err => console.log(err));
        axios
          .get(KAPI + "/anime-characters", {
            params: {
              "filter[animeId]": data.data[0].id,
              "page[limit]": 8,
              include: "character"
            }
          })
          .then(({ data }) => {
            this.setState({
              characters: data.included
            });
          })
          .catch(err => console.log(err));

        const userStore = JSON.parse(localStorage.getItem("user"));

        userStore &&
          axios
            .get(KAPI + "/users?filter%5Bself%5D=true", {
              headers: {
                Authorization: "Bearer " + userStore.data.access_token
              },
              params: {
                include: "favorites.item"
              }
            })
            .then(({ data }) => {
              const user = {
                ...data.data[0],
                included: data.included
              };
              this.setState({
                user,
                loading: false
              });
            })
            .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  };

  render() {
    const { loading } = this.state;
    if (loading) return <Loading />;

    return (
      <AppWrapper title={"Dashboard"}>
        <ItemView data={this.state} />
      </AppWrapper>
    );
  }
}
