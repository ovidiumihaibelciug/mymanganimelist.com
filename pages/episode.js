import React, { Component } from "react";
import axios from "axios";
import { KAPI } from "../utils";
import Sidebar from "../components/Sidebar";
import Header from "../layout/Header";
import Loading from "../components/Loading";
import Chip from "../components/Chip";
import { Icon } from "antd";
import RightSidebar from "../components/RightSidebar";
import EpisodeContent from "../components/Episode/EpisodeContent";
import VideoLike from "../components/Episode/VideoLike";
import VideosSrc from "../components/Episode/VideosSrc";
import "../styles/styles.scss";

export class EpisodeView extends Component {
  static getInitialProps({ query: { slug, number } }) {
    return { slug, number };
  }

  state = {
    anime: {},
    loading: true,
    streamingLinks: "",
    videos: ""
  };

  componentDidMount() {
    const { slug, number } = this.props;

    axios
      .get(KAPI + "/anime", {
        params: {
          "filter[slug]": slug,
          include: "streamingLinks"
        }
      })
      .then(({ data }) => {
        console.log(data);
        const streamingLinks =
          data.included &&
          data.included.filter(item => item.type === "streamingLinks");
        this.setState({
          anime: data.data[0],
          streamingLinks
        });
        const { id } = data.data[0];
        axios
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
            this.setState({
              episode: data.data[0].attributes,
              videos,
              loading: false
            });
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  render() {
    const { anime, episode, videos, streamingLinks, loading } = this.state;
    if (loading) {
      return <Loading />;
    }
    console.log("Only episode", episode);

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
    console.log(episode);
    const chipItem = {
      attributes: {
        title: "Episode " + (relativeNumber ? relativeNumber : number)
      }
    };
    return (
      <>
        <section className="anime-view o-main-layout character-view">
          <Sidebar small={true} />
          <div
            className="o-main o-anime-view o-episode-view"
            style={{
              backgroundImage: `linear-gradient(15deg,rgba(20, 28, 36, 1) 10%, rgba(30, 34, 38, 0.99) 40%,  rgba(30, 34, 38, 0.95) 100%) , url(${
                thumbnail ? thumbnail.original : coverImage.original
              })`
            }}
          >
            <Header />
            <div className="anime episode">
              <EpisodeContent
                thumbnail={thumbnail}
                airdate={airdate}
                canonicalTitle={canonicalTitle}
                chipItem={chipItem}
                length={length}
                synopsis={synopsis}
              />
            </div>
            <RightSidebar
              coverImage={posterImage}
              posterImage={thumbnail}
              status={""}
              // nextRelease={nextRelease}
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
      </>
    );
  }
}

export default EpisodeView;
