import React, { Component } from "react";
import axios from "axios";
import { KAPI } from "../utils";
import ItemView from "../components/ItemView";
import AppWrapper from "../components/AppWrapper";
import Loading from "../components/Loading";

async function getAnime(props) {
  const { slug } = props;
  let returnedObj = {};
  await axios
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
      returnedObj = {
        ...returnedObj,
        anime: data.data[0],
        categories,
        franchises
      };
    })
    .catch(err => console.log(err));
  await axios
    .all([
      axios.get(KAPI + "/episodes", {
        params: {
          "filter[mediaId]": returnedObj.anime.id,
          "page[limit]": 8,
          "page[offset]": 0
        }
      }),
      axios.get(KAPI + "/anime-characters", {
        params: {
          "filter[animeId]": returnedObj.anime.id,
          "page[limit]": 8,
          include: "character"
        }
      })
    ])
    .then(([episodeData, charactersData]) => {
      returnedObj = {
        ...returnedObj,
        episodes: episodeData.data.data,
        characters: charactersData.data.included
      };
    });
  return returnedObj;
}

export default class Anime extends Component {
  static async getInitialProps({ query: { slug } }) {
    const test = await getAnime({ slug });
    return { ...test, slug };
  }

  state = {
    anime: "",
    genres: [],
    episodes: [],
    characters: [],
    franchises: [],
    loading: true,
    isOpen: false
  };

  render() {
    let { anime, loading } = this.props;
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
        <ItemView data={this.props} />
      </AppWrapper>
    );
  }
}
