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
        const userStore = JSON.parse(localStorage.getItem("user"));

        axios
          .all([
            axios.get(KAPI + "/episodes", {
              params: {
                "filter[mediaId]": data.data[0].id,
                "page[limit]": 8,
                "page[offset]": 0
              }
            }),
            axios.get(KAPI + "/anime-characters", {
              params: {
                "filter[animeId]": data.data[0].id,
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
          .then(([episodeData, charactersData, userData = false]) => {
            const user = userData
              ? {
                  ...userData.data.data[0],
                  included: userData.data.included
                }
              : false;
            this.setState({
              episodes: episodeData.data.data,
              characters: charactersData.data.included,
              user,
              loading: false
            });
          });
      })
      .catch(err => console.log(err));
  };

  render() {
    const { anime, loading } = this.state;
    if (loading) return <Loading />;

    return (
      <AppWrapper
        title={`${anime.attributes.titles.en ||
          anime.attributes.titles.en_jp} Anime - MyMangAnimeList`}
        description={`Explore ${anime.attributes.titles.en ||
          anime.attributes.titles.en_jp} news. Watch ${anime.attributes.titles
          .en || anime.attributes.titles.en_jp} online. Explore ${anime
          .attributes.titles.en ||
          anime.attributes.titles.en_jp} characters. Watch ${anime.attributes
          .titles.en ||
          anime.attributes.titles
            .en_jp} episodes online. Explore related anime`}
        keywords={
          anime.attributes.titles.en ||
          anime.attributes.titles.en_jp + "Anime, Watch Anime"
        }
      >
        <ItemView data={this.state} />
      </AppWrapper>
    );
  }
}
