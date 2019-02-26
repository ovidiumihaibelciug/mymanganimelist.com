import React, { Component } from "react";
import axios from "axios";
import { KAPI } from "../../utils";
import Sidebar from "../../components/Sidebar";
import Header from "../../layout/Header";
import Loading from "../../components/Loading";
import { Icon } from "antd";
import RightSidebar from "../../components/RightSidebar";
import AppWrapper from "../../components/AppWrapper";

export class ChapterView extends Component {
  static getInitialProps({ query: { slug, number } }) {
    return { slug, number };
  }

  state = {
    anime: {},
    loading: true
  };

  componentDidMount() {
    const { slug, number } = this.props;

    axios
      .get(KAPI + "/manga", {
        params: {
          "filter[slug]": slug
        }
      })
      .then(({ data }) => {
        const { id } = data.data[0];
        this.setState({
          anime: data.data[0]
        });
        axios
          .get(KAPI + "/chapters", {
            params: {
              "filter[mangaId]": id,
              "filter[number]": number
            }
          })
          .then(({ data }) => {
            console.log("chapter", data);
            this.setState({
              episode: data.data[0].attributes,
              loading: false
            });
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  render() {
    const { anime, episode, loading } = this.state;
    if (loading) {
      return <Loading />;
    }

    const { coverImage, posterImage } = anime.attributes;
    const {
      thumbnail,
      canonicalTitle,
      synopsis,
      airdate,
      number,
      length
    } = episode;

    return (
      <AppWrapper
        title={
          (canonicalTitle || "Chapter " + number) +
          " " +
          (anime.attributes.titles.en || anime.attributes.titles.en_jp) +
          " - MyMangAnimeList"
        }
        description={`
        Read Chapter
          ${canonicalTitle ||
            "Chapter " + number} for free, Read ${canonicalTitle ||
          "Chapter " + number} ${anime.attributes.titles.en ||
          anime.attributes.titles.en_jp} online for free
        `}
        keywords="anime, anime chapter, manga"
      >
        <section className="anime-view o-main-layout">
          <Sidebar small={true} />
          <div
            className="o-main o-anime-view o-episode-view"
            style={{
              backgroundImage: `linear-gradient(15deg,rgba(20, 28, 36, 1) 10%, rgba(30, 34, 38, 0.99) 40%,  rgba(30, 34, 38, 0.95) 100%) , url(${
                thumbnail
                  ? thumbnail.original
                    ? thumbnail.original
                    : coverImage.original
                  : coverImage.original
              })`
            }}
          >
            <Header isFixedNoBg />
            <div className="anime episode">
              <div className="anime-container episode-container">
                <div className="episode-row">
                  <div
                    className="leftside"
                    style={{
                      backgroundImage: `url("${
                        thumbnail
                          ? thumbnail.original
                            ? thumbnail.original
                            : coverImage.original
                          : coverImage.original
                      }")`
                    }}
                  />
                  <div className="rightside">
                    <h2 className="title">
                      {canonicalTitle || `Chapter ${number}`}
                    </h2>
                    <div className="description">{synopsis}</div>
                    {length && (
                      <div className="date">
                        <Icon type="clock-circle" theme="outlined" />
                        &nbsp;&nbsp;
                        {length} minutes
                      </div>
                    )}
                    {airdate && (
                      <div className="date">
                        <Icon type="calendar" theme="outlined" />
                        &nbsp;&nbsp;
                        {airdate}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <RightSidebar
              coverImage={posterImage ? posterImage : thumbnail}
              posterImage={posterImage ? posterImage : thumbnail}
              status={status}
            />
          </div>
        </section>
      </AppWrapper>
    );
  }
}

export default ChapterView;
