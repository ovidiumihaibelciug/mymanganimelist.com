import React, { Component, Fragment } from "react";
import Sidebar from "./Sidebar";
import Header from "../layout/Header";
import ModalVideo from "react-modal-video";
import AnimeInfo from "./Anime/AnimeInfo";
import RightSidebar from "./RightSidebar";
import SecondaryContent from "./Anime/SecondaryContent";
import axios from "axios";
import { Router } from "../routes";

class ItemView extends Component {
  state = {
    isOpen: false,
    isFavorite: false,
    loadingBtn: false,
    favorites: "",
    showRightSideBar: false
  };

  componentDidMount() {
    const {
      data: { user, anime }
    } = this.props;
    const favorites =
      user &&
      user.included &&
      user.included.filter(item => item.type === "favorites");

    const isFavorite =
      favorites &&
      favorites.find(item => item.relationships.item.data.id === anime.id);
    this.setState({
      isFavorite,
      favorites
    });
  }

  openModal = () => {
    this.setState({ isOpen: true });
  };

  onFavorite = isFavorite => {
    const userStore = JSON.parse(localStorage.getItem("user"));
    const { data } = this.props;

    this.setState({
      loadingBtn: true
    });

    if (!userStore) {
      Router.push("/login");
    } else {
      if (!isFavorite) {
        axios
          .post(
            "https://kitsu.io/api/edge/favorites",
            {
              data: {
                relationships: {
                  user: { data: { type: "users", id: data.user.id } },
                  item: { data: { type: data.anime.type, id: data.anime.id } }
                },
                type: "favorites"
              }
            },
            {
              headers: {
                "content-type": "application/vnd.api+json",
                Authorization: "Bearer " + userStore.data.access_token
              }
            }
          )
          .then(({ data: favData }) => {
            favData.data.relationships = {
              user: { data: { type: "users", id: data.user.id } },
              item: { data: { type: data.anime.type, id: data.anime.id } }
            };
            this.setState(state => {
              const { isFavorite, favorites = [] } = state;
              return {
                lastFavorite: favData,
                isFavorite: !isFavorite,
                favorites: [...favorites, favData.data],
                loadingBtn: false
              };
            });
          })
          .catch(err => console.log(err));
      } else {
        const { favorites } = this.state;
        const { data } = this.props;
        const { anime } = data;
        const deletedFavoriteItem = favorites
          .reverse()
          .find(item => item.relationships.item.data.id === anime.id);

        axios
          .delete(
            `https://kitsu.io/api/edge/favorites/${deletedFavoriteItem.id}`,
            {
              headers: {
                "content-type": "application/vnd.api+json",
                Authorization: "Bearer " + userStore.data.access_token
              }
            }
          )
          .then(data => {
            console.log(data);
            this.setState(state => {
              const { isFavorite } = state;
              return {
                isFavorite: !isFavorite,
                loadingBtn: false
              };
            });
          })
          .catch(err => console.log(err));
      }
    }
  };

  showRightSideInfo = () => {
    this.setState(state => {
      const { showRightSideBar } = state;

      return {
        showRightSideBar: !showRightSideBar
      };
    });
  };

  render() {
    const { data } = this.props;
    let {
      anime,
      loading,
      categories,
      episodes,
      characters,
      franchises,
      chapters,
      user,
      genres
    } = data;

    const { isOpen, isFavorite, showRightSideBar, loadingBtn } = this.state;

    if (!anime) {
      return null;
    }

    const { attributes } = anime;
    const {
      coverImage = "",
      titles,
      posterImage,
      synopsis,
      popularityRank,
      ratingRank,
      averageRating,
      status,
      nextRelease,
      youtubeVideoId,
      slug
    } = attributes;

    const starCount = Math.round((averageRating * 5) / 100);

    return (
      <div>
        <ModalVideo
          channel="youtube"
          isOpen={isOpen}
          videoId={youtubeVideoId}
          onClose={() => this.setState({ isOpen: false })}
        />
        <section className="anime-view o-main-layout">
          <Sidebar small={true} />
          <div
            className="o-main o-anime-view"
            style={{
              backgroundImage: `linear-gradient(15deg,rgba(20, 28, 36, 1) 10%, rgba(30, 34, 38, 0.99) 40%,  rgba(30, 34, 38, 0.95) 100%) , url(${
                coverImage.original
              })`
            }}
          >
            <Header
              user={data.user}
              isFavorite={isFavorite}
              isFixedNoBg
              showRightSideInfo={this.showRightSideInfo}
              showRightSideBar={showRightSideBar}
            />
            <AnimeInfo
              starCount={starCount}
              titles={titles}
              synopsis={synopsis}
              averageRating={averageRating}
              popularityRank={popularityRank}
              ratingRank={ratingRank}
              categories={categories}
              type={anime.type}
              openModal={this.openModal}
            />
            <RightSidebar
              coverImage={coverImage}
              posterImage={posterImage}
              status={status}
              title={anime.attributes.titles.en}
              nextRelease={nextRelease}
              loadingBtn={loadingBtn}
              isMedia
              isFavorite={isFavorite}
              onFavorite={isFavorite => this.onFavorite(isFavorite)}
              showRightSideBar={showRightSideBar}
            />
          </div>
          <div className="secondary">
            <SecondaryContent
              data={[
                {
                  title: "Episodes",
                  type: "episodes",
                  data: episodes
                },
                {
                  title: "Chapters",
                  type: "chapters",
                  data: chapters
                },
                {
                  title: "Characters",
                  type: "characters",
                  data: characters
                },
                {
                  title: "Franchises",
                  type: "franchise",
                  data: franchises
                }
              ]}
              slug={slug}
              posterImage={posterImage}
            />
          </div>
        </section>
      </div>
    );
  }
}

export default ItemView;
