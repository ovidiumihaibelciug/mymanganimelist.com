import React, { Component } from "react";
import axios from "axios";
import moment from "moment";

import Template from "../../../components/SecondaryItems/Template";
import Loading from "../../../components/Loading";
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
        anime: data.data[0],
        loading: false
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

  state = {
    anime: "",
    loading: true
  };

  load = ({ filters, options }) => {
    const { anime } = this.props;
    const { id } = anime;

    return axios
      .get("https://kitsu.io/api/edge/manga-characters", {
        params: {
          "filter[mangaId]": id,
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

  count = filters => {
    const { anime } = this.props;
    const { id } = anime;

    return axios
      .get("https://kitsu.io/api/edge/manga-characters", {
        params: {
          "filter[mangaId]": id
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
        description={`Best manga characters. Search your favorite ${anime
          .attributes.titles.en ||
          anime.attributes.titles
            .en_jp} character on myMANGANIMElist. Search male and female manga characters. Explore all ${anime
          .attributes.titles.en || anime.attributes.titles.en_jp} characters.`}
        keywords="anime,anime characters, manga, anime news"
      >
        <Template
          functions={{
            load: this.load,
            count: this.count
          }}
          data={this.props}
          itemType={"characters"}
          isAnime
        />
      </AppWrapper>
    );
  }
}

export default AnimeCharacterList;
