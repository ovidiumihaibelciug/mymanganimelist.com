import React, { Component } from "react";

import axios from "axios";

import { KAPI } from "../../utils";
import ItemView from "../../components/ItemView";
import "../../styles/styles.scss";

export default class AnimeView extends Component {
  state = {
    anime: "",
    genres: [],
    chapters: [],
    characters: [],
    franchises: [],
    loading: true,
    isOpen: false
  };

  static getInitialProps({ query: { slug } }) {
    return { slug };
  }

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
    return <ItemView data={this.state} />;
  }
}
