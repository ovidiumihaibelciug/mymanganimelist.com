import React, { Component } from "react";
import axios from "axios";
import { KAPI } from "../utils";
import Sidebar from "../components/Sidebar";
import Header from "../layout/Header";
import Loading from "../components/Loading";
import RightSidebar from "../components/RightSidebar";
import EpisodeContent from "../components/Episode/EpisodeContent";
import VideosSrc from "../components/Episode/VideosSrc";
import AppWrapper from "../components/AppWrapper";

async function getData({ slug, number }) {
  let returnedObj = {};

  await axios
    .get(KAPI + "/anime", {
      params: {
        "filter[slug]": slug,
        include: "streamingLinks"
      }
    })
    .then(({ data }) => {
      const streamingLinks =
        data.included &&
        data.included.filter(item => item.type === "streamingLinks");
      returnedObj = {
        ...returnedObj,
        anime: data.data[0],
        streamingLinks
      };
    })
    .catch(err => console.log(err));
  const { id } = returnedObj.anime;
  await axios
    .get(KAPI + "/episodes", {
      params: {
        include: "videos",
        "filter[mediaId]": id,
        "filter[number]": number
      }
    })
    .then(({ data }) => {
      let videos = "";
      if (data.included) {
        videos = data.included.filter(item => item.type === "video");
      }
      returnedObj = {
        ...returnedObj,
        episode: data.data[0].attributes,
        videos,
        loading: false
      };
    })
    .catch(err => console.log(err));

  return returnedObj;
}

export class EpisodeView extends Component {
  state = {
    anime: {},
    loading: true,
    streamingLinks: "",
    videos: "",
    showRightSideBar: false
  };

  static async getInitialProps({ query: { slug, number } }) {
    const initProps = await getData({ slug, number });

    return { ...initProps, slug, number };
  }

  showRightSideInfo = () => {
    this.setState(state => {
      const { showRightSideBar } = state;

      return {
        showRightSideBar: !showRightSideBar
      };
    });
  };

  render() {
    const {
      anime,
      episode,
      videos,
      streamingLinks,
      showRightSideBar,
      loading
    } = this.props;

    if (loading) {
      return <Loading />;
    }

    const { coverImage, posterImage } = anime.attributes;
    const {
      thumbnail,
      canonicalTitle,
      synopsis,
      airdate,
      length,
      relativeNumber,
      number
    } = episode;

    const chipItem = {
      attributes: {
        title: "Episode " + (relativeNumber ? relativeNumber : number)
      }
    };
    return (
      <AppWrapper
        title={
          "Watch Episode " +
          (relativeNumber ? relativeNumber : number) +
          " - " +
          (anime.attributes.titles.en
            ? anime.attributes.titles.en
            : anime.attributes.titles.en_jp) +
          " - MyMangAnimeList"
        }
      >
        <section className="anime-view o-main-layout character-view">
          <Sidebar small={true} />
          <div
            className="o-main o-anime-view o-episode-view"
            style={{
              backgroundImage: `linear-gradient(15deg,rgba(20, 28, 36, 1) 10%, rgba(30, 34, 38, 0.99) 40%,  rgba(30, 34, 38, 0.95) 100%) , url(${
                coverImage ? coverImage.original : thumbnail.original
              })`
            }}
          >
            <Header
              isFixedNoBg
              showRightSideInfo={this.showRightSideInfo}
              showRightSideBar={showRightSideBar}
            />
            <div className="anime episode">
              <EpisodeContent
                thumbnail={thumbnail || posterImage || coverImage}
                airdate={airdate}
                canonicalTitle={canonicalTitle}
                chipItem={chipItem}
                length={length}
                synopsis={synopsis}
              />
            </div>
            <RightSidebar
              coverImage={coverImage || thumbnail}
              posterImage={posterImage || coverImage || thumbnail}
              showRightSideBar={showRightSideBar}
            />
          </div>
          <div className="secondary">
            {(streamingLinks.length > 0 || videos.length > 0) && (
              <VideosSrc
                streamingLinks={streamingLinks}
                videos={videos}
                posterImage={posterImage}
                thumbnail={thumbnail}
              />
            )}
          </div>
        </section>
      </AppWrapper>
    );
  }
}

export default EpisodeView;
