import React, { Component } from "react";
import axios from "axios";
import { KAPI } from "../../utils";
import SimpleSchema from "simpl-schema";
import Template from "../../components/SecondaryItems/Template";
import Loading from "../../components/Loading";
import AppWrapper from "../../components/AppWrapper";

export class EpisodeList extends Component {
  static getInitialProps({ query: { slug } }) {
    return { slug };
  }

  state = {
    anime: "",
    loading: true,
    isFiltering: false,
    filteredItems: [],
    search: false
  };

  componentDidMount() {
    const { slug } = this.props;

    axios
      .get("https://kitsu.io/api/edge/anime", {
        params: {
          "filter[slug]": slug
        }
      })
      .then(({ data }) => {
        this.setState({
          anime: data.data[0],
          loading: false
        });
      })
      .catch(err => console.log(err));
  }

  load = ({ filters, options }) => {
    const { anime } = this.state;
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
    const { anime } = this.state;
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
    const { id } = this.state.anime;
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
    let { anime, loading } = this.state;
    const { slug } = this.props;
    if (loading) return <Loading />;

    return (
      <AppWrapper
        title={
          "Watch " +
          (anime.attributes.titles.en
            ? anime.attributes.titles.en
            : anime.attributes.titles.en_jp) +
          " Episodes Online - MyMangAnimeList"
        }
        description={
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis optio, saepe! Aliquam asperiores blanditiis consectetur ex facere in incidunt iure, labore, minima officia praesentium quae sed soluta ullam velit voluptates!"
        }
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
          data={this.state}
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
