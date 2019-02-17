import React, { Component } from "react";

import axios from "axios";

import { KAPI } from "../../utils";
import ItemView from "../../components/ItemView";
import AppWrapper from "../../components/AppWrapper";

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
        axios
          .get(KAPI + "/chapters", {
            params: {
              "filter[mangaId]": data.data[0].id,
              "page[limit]": 8
            }
          })
          .then(({ data }) => {
            this.setState({
              chapters: data.data,
              loading: false
            });
          })
          .catch(err => console.log(err));
        axios
          .get(KAPI + `/manga-characters/${data.data[0].id}`, {
            params: {
              "filter[mangaId]": data.data[0].id,
              "page[limit]": 8,
              include: "character"
            }
          })
          .then(({ data }) => {
            this.setState({
              characters: data.included,
              loading: false
            });
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <AppWrapper title="123">
        <ItemView data={this.state} />
      </AppWrapper>
    );
  }
}
