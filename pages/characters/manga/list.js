import React, { Component } from "react";
import axios from "axios";
import moment from "moment";

import Template from "../../../components/SecondaryItems/Template";
import Loading from "../../../components/Loading";
import AppWrapper from "../../../components/AppWrapper";

export class AnimeCharacterList extends Component {
  static getInitialProps({ query: { slug } }) {
    return { slug };
  }

  state = {
    anime: "",
    loading: true
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

  duration = date => {
    let eventDate = moment(date);
    return eventDate.fromNow();
  };

  load = ({ filters, options }) => {
    const { anime } = this.state;
    const { id } = anime;
    const { slug } = this.props;

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
    const { anime } = this.state;
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
    let { anime, loading } = this.state;
    if (loading) return <Loading />;

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
          data={this.state}
          itemType={"characters"}
          isAnime
        />
      </AppWrapper>
    );
  }
}

export default AnimeCharacterList;
