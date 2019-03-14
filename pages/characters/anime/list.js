import React, { Component } from "react";
import axios from "axios";
import moment from "moment";
import Template from "../../../components/SecondaryItems/Template";
import AppWrapper from "../../../components/AppWrapper";

async function getData({ slug }) {
  let returnedObj = {};

  await axios
    .get("https://kitsu.io/api/edge/anime", {
      params: {
        "filter[slug]": slug
      }
    })
    .then(({ data }) => {
      returnedObj = {
        ...returnedObj,
        anime: data.data[0]
      };
    })
    .catch(err => console.log(err));
  return returnedObj;
}

export class AnimeCharacterList extends Component {
  static async getInitialProps({ query: { slug } }) {
    const initProps = await getData({ slug });

    return { ...initProps, slug };
  }

  load = ({ filters, options }) => {
    const { anime } = this.props;
    const { id } = anime;

    return axios
      .get("https://kitsu.io/api/edge/anime-characters", {
        params: {
          "filter[animeId]": id,
          include: "character",
          "page[limit]": options.limit,
          "page[offset]": options.skip
        }
      })
      .then(({ data }) => {
        return data.included;
      })
      .catch(err => console.log(err));
  };

  count = () => {
    const { anime } = this.props;
    const { id } = anime;

    return axios
      .get("https://kitsu.io/api/edge/anime-characters", {
        params: {
          "filter[animeId]": id
        }
      })
      .then(({ data }) => {
        return data.meta.count;
      })
      .catch(err => console.log(err));
  };

  render() {
    let { anime } = this.props;

    return (
      <AppWrapper
        title={
          (anime.attributes.titles.en || anime.attributes.titles.en_jp) +
          " Characters" +
          " - MyMangAnimeList"
        }
        description={`Best anime characters. Search your favorite ${anime
          .attributes.titles.en ||
          anime.attributes.titles
            .en_jp} character on myMANGANIMElist. Search male and female anime characters. Explore all ${anime
          .attributes.titles.en || anime.attributes.titles.en_jp} characters.`}
        keywords="anime,anime characters, manga, anime news"
      >
        <Template
          functions={{
            load: this.load,
            count: this.count
          }}
          pageTitle={
            (anime.attributes.titles.en || anime.attributes.titles.en_jp) +
            " Characters"
          }
          pageDescription={`Best anime characters. Search your favorite ${anime
            .attributes.titles.en ||
            anime.attributes.titles
              .en_jp} character on My Manga Anime List. Explore all ${anime
            .attributes.titles.en ||
            anime.attributes.titles.en_jp} characters.`}
          data={this.props}
          itemType={"characters"}
          isAnime
        />
      </AppWrapper>
    );
  }
}

export default AnimeCharacterList;
