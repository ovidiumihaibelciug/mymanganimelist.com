import React, { Component } from "react";
import axios from "axios";
import { KAPI } from "../../utils";
import Sidebar from "../../components/Sidebar";
import Header from "../../layout/Header";
import Loading from "../../components/Loading";
import RightSidebar from "../../components/RightSidebar";
import EpisodeContent from "../../components/Episode/EpisodeContent";
import VideosSrc from "../../components/Episode/VideosSrc";
import AppWrapper from "../../components/AppWrapper";
import { defaultImage } from "../../utils/general";

export class EpisodeView extends Component {
  state = {
    anime: {},
    loading: true,
    streamingLinks: "",
    videos: ""
  };

  static getInitialProps({ query: { id } }) {
    return { id };
  }

  componentDidMount() {
    const { id } = this.props;

    axios
      .get(KAPI + "/episodes/" + id, {
        params: {
          include: "media,videos"
        }
      })
      .then(({ data }) => {
        let videos = "";
        if (data.included) {
          videos = data.included.filter(item => item.type === "video");
        }
        const anime = data.included.find(
          item => item.type === "anime" || item.type === "manga"
        );

        this.setState({
          episode: data.data.attributes,
          videos,
          anime,
          loading: false
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    const { anime, episode, videos, streamingLinks, loading } = this.state;
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
          " online - MyMangAnimeList"
        }
        description={
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos maiores molestias nisi recusandae voluptatem. Aliquam aut eum numquam officia saepe. Consequuntur facere id optio reprehenderit vero voluptatem voluptatum. Eos, soluta?"
        }
        keywords="anime,manga,watch anime online"
      >
        <section className="anime-view o-main-layout character-view">
          <Sidebar small={true} />
          <div
            className="o-main o-anime-view o-episode-view"
            style={{
              backgroundImage: `linear-gradient(15deg,rgba(20, 28, 36, 1) 10%, rgba(30, 34, 38, 0.99) 40%,  rgba(30, 34, 38, 0.95) 100%) , url(${(coverImage &&
                coverImage.original) ||
                (thumbnail && thumbnail.original) ||
                defaultImage})`
            }}
          >
            <Header isFixedNoBg />
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
