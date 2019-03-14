import React, { Component } from "react";
import axios from "axios";
import moment from "moment";
import { KAPI } from "../../utils";
import SimpleSchema from "simpl-schema";
import Template from "../../components/SecondaryItems/Template";
import Loading from "../../components/Loading";
import AppWrapper from "../../components/AppWrapper";

async function getData({ slug }) {
  let returnedObj = {};
  await axios
    .get("https://kitsu.io/api/edge/manga", {
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

export class ChapterList extends Component {
  static async getInitialProps({ query: { slug } }) {
    const initProps = await getData({ slug });

    return { ...initProps, slug };
  }

  state = {
    loading: true,
    isFiltering: false,
    filteredItems: [],
    search: false
  };

  load = ({ filters, options }) => {
    const { anime } = this.props;
    const { id } = anime;

    let params = {
      "filter[mangaId]": id,
      "page[limit]": options.limit,
      "page[offset]": options.skip
    };

    return axios
      .get(KAPI + "/chapters", {
        params
      })
      .then(({ data }) => {
        return data.data;
      })
      .catch(err => console.log(err));
  };

  count = filters => {
    const { anime } = this.props;
    const { id } = anime;

    return axios
      .get(KAPI + "/chapters", {
        params: {
          "filter[mangaId]": id
        }
      })
      .then(({ data }) => {
        return data.meta.count;
      })
      .catch(err => console.log(err));
  };

  onSubmit = (data, molecule) => {
    const { id } = this.props.anime;
    const filters = data;
    let params = {};
    let ok = 0;
    params["filter[mangaId]"] = id;
    if (filters.number) {
      params["filter[number]"] = parseInt(filters.number);
      ok = 1;
    }
    axios
      .get("https://kitsu.io/api/edge/chapters", {
        params
      })
      .then(({ data }) => {
        if (ok) {
          this.setState({
            filteredItems: data.data,
            isFiltering: true
          });
        }
      })
      .catch(err => console.log);
  };

  toggleFilters = () => {
    this.setState(prevState => {
      const { search } = prevState;
      return {
        search: !search
      };
    });
  };

  render() {
    let { anime, slug } = this.props;

    return (
      <AppWrapper
        title={
          (anime.attributes.titles.en || anime.attributes.titles.en_jp) +
          " Manga Chapters - MyMangAnimeList"
        }
        description={`
          Explore new ${anime.attributes.titles.en ||
            anime.attributes.titles.en_jp} Chapters. Read online ${anime
          .attributes.titles.en ||
          anime.attributes.titles.en_jp} manga chapters for free.
        `}
        keywords="anime, manga, anime chapters, manga chapters"
      >
        <Template
          functions={{
            load: this.load,
            count: this.count,
            onSubmit: this.onSubmit,
            toggleFilters: this.toggleFilters,
            stopFiltering: this.stopFiltering
          }}
          data={{ ...this.props, ...this.state }}
          pageTitle={
            (anime.attributes.titles.en || anime.attributes.titles.en_jp) +
            " Manga Chapters"
          }
          pageDescription={`Explore new ${anime.attributes.titles.en ||
            anime.attributes.titles.en_jp} Chapters. `}
          slug={slug}
          schema={FilterSchema}
          itemType={"chapters"}
        />
      </AppWrapper>
    );
  }
}

const FilterSchema = new SimpleSchema({
  number: {
    type: String,
    optional: true,
    easify: {
      toFilter(value) {
        return {
          number: {
            $regex: value,
            $options: "i"
          }
        };
      }
    }
  }
});

export default ChapterList;
