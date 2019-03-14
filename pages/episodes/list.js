import React, { Component } from "react";
import axios from "axios";
import { KAPI } from "../../utils";
import SimpleSchema from "simpl-schema";
import Template from "../../components/SecondaryItems/Template";
import Loading from "../../components/Loading";
import AppWrapper from "../../components/AppWrapper";

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

export class EpisodeList extends Component {
  static async getInitialProps({ query: { slug } }) {
    const initProps = await getData({ slug });

    return { ...initProps, slug };
  }

  state = {
    isFiltering: false,
    filteredItems: [],
    toggleFilters: false,
    search: false
  };

  load = ({ filters, options }) => {
    const { anime } = this.props;
    const { id } = anime;

    let params = {
      "filter[mediaId]": id,
      "page[limit]": options.limit,
      "page[offset]": options.skip
    };

    return axios
      .get(KAPI + "/episodes", {
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
      .get(KAPI + "/episodes", {
        params: {
          "filter[mediaId]": id
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
    params["filter[mediaId]"] = id;
    if (filters.number) {
      params["filter[number]"] = parseInt(filters.number);
      ok = 1;
    }
    axios
      .get("https://kitsu.io/api/edge/episodes", {
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

  stopFiltering = () => {
    this.setState({ isFiltering: false });
  };

  render() {
    const { anime, slug } = this.props;
    return (
      <AppWrapper
        title={
          "Watch " +
          (anime.attributes.titles.en
            ? anime.attributes.titles.en
            : anime.attributes.titles.en_jp) +
          " Episodes Online - MyMangAnimeList"
        }
        description={`Watch
          ${
            anime.attributes.titles.en
              ? anime.attributes.titles.en
              : anime.attributes.titles.en_jp
          } episodes online for free. Here you can find best anime espides free. Explore new
           ${
             anime.attributes.titles.en
               ? anime.attributes.titles.en
               : anime.attributes.titles.en_jp
           } episodes`}
        keywords="anime, manga, anime episodes, watch anime online"
      >
        <Template
          functions={{
            load: this.load,
            count: this.count,
            onSubmit: this.onSubmit,
            toggleFilters: this.toggleFilters,
            stopFiltering: this.stopFiltering
          }}
          pageTitle={
            (anime.attributes.titles.en
              ? anime.attributes.titles.en
              : anime.attributes.titles.en_jp) + " Episodes"
          }
          pageDescription={`Watch
          ${
            anime.attributes.titles.en
              ? anime.attributes.titles.en
              : anime.attributes.titles.en_jp
          } episodes online for free. Here you can find best anime espides free. Explore new
           ${
             anime.attributes.titles.en
               ? anime.attributes.titles.en
               : anime.attributes.titles.en_jp
           } episodes`}
          data={{
            ...this.props,
            ...this.state
          }}
          schema={FilterSchema}
          slug={slug}
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

export default EpisodeList;
