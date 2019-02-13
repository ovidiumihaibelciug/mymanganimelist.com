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
    console.log(slug);
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

  count = filters => {
    const { anime } = this.state;
    const { id } = anime;

    return axios
      .get("https://kitsu.io/api/edge/anime-characters", {
        params: {
          "filter[animeId]": id
        }
      })
      .then(({ data }) => {
        console.log(data);
        return data.meta.count;
      })
      .catch(err => console.log(err));
  };

  render() {
    let { loading } = this.state;
    if (loading) return <Loading />;
    return (
      <AppWrapper title="asd asd asd">
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
