import React, { Component } from "react";
import axios from "axios";
import moment from "moment";
import { KAPI } from "../../utils";
import SimpleSchema from "simpl-schema";
import Template from "../../components/SecondaryItems/Template";
import Loading from "../../components/Loading";
import AppWrapper from "../../components/AppWrapper";

export class ChapterList extends Component {
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
      .get("https://kitsu.io/api/edge/manga", {
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

  duration = date => {
    let eventDate = moment(date);
    return eventDate.fromNow();
  };

  load = ({ filters, options }) => {
    const { anime } = this.state;
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
        console.log("123", data);
        return data.data;
      })
      .catch(err => console.log(err));
  };

  count = filters => {
    const { anime } = this.state;
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
    const { id } = this.state.anime;
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
      console.log(prevState);
      return {
        search: !search
      };
    });
  };

  render() {
    let { anime, loading } = this.state;
    const { slug } = this.props;
    if (loading) return <Loading />;
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
          data={this.state}
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
