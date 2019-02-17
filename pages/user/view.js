import React from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../layout/Header";
import { KAPI } from "../../utils";
import axios from "axios";
import RightSidebar from "../../components/RightSidebar";
import Loading from "../../components/Loading";
import moment from "moment";
import FavoriteItems from "../../components/User/FavoriteItems";
import AppWrapper from "../../components/AppWrapper";
import UserPostsWrapper from "../../components/User/UserPostsWrapper";
import { Bar } from "react-chartjs-2";
import { Router } from "../../routes";

let chartData = {
  labels: [],
  datasets: [
    {
      label: "",
      backgroundColor: "rgb(0, 169, 255, .2)",
      borderColor: "rgb(0, 169, 255)",
      borderWidth: 1,
      hoverBackgroundColor: "rgba(255,99,132,0.4)",
      hoverBorderColor: "rgba(255,99,132,1)",
      data: []
    }
  ]
};

class UserView extends React.Component {
  static getInitialProps({ query: { id } }) {
    return { id };
  }

  state = {
    user: {},
    stats: [],
    loading: true
  };

  componentDidMount() {
    const { id } = this.props;
    const userStore = JSON.parse(localStorage.getItem("user"));

    axios
      .all([
        axios.get(KAPI + "/users/", {
          params: {
            "filter[id]": id,
            include:
              "reviews,pinnedPost,blocks,stats,favorites,favorites.item,waifu,profileLinks,categoryFavorites.category"
          }
        }),
        userStore &&
          axios.get(KAPI + "/users?filter%5Bself%5D=true", {
            headers: {
              Authorization: "Bearer " + userStore.data.access_token
            },
            params: {
              include: "following.followed"
            }
          })
      ])
      .then(([userData, loggedUser = false]) => {
        const user = userData.data.data[0];

        const isFollowing =
          user.id &&
          loggedUser &&
          loggedUser.data.included.find(
            item => item.type === "users" && item.id === user.id
          );

        const follows =
          loggedUser &&
          loggedUser.data.included.filter(item => item.type === "follows");

        const stats = userData.data.included.filter(
          item => item.type === "stats"
        );

        const favorites = userData.data.included
          .filter(item => item.type === "favorites")
          .map(item => {
            return {
              type: item.relationships.item.data.type,
              id: item.relationships.item.data.id,
              item: userData.data.included.find(
                favItem =>
                  favItem.id === item.relationships.item.data.id &&
                  item.relationships.item.data.type === favItem.type
              )
            };
          });

        chartData.datasets[0].data =
          stats[1].attributes.statsData.categories &&
          Object.values(stats[1].attributes.statsData.categories);

        chartData.labels =
          stats[1].attributes.statsData.categories &&
          Object.keys(stats[1].attributes.statsData.categories);

        this.setState({
          user,
          stats,
          favorites,
          isFollowing,
          follows,
          loggedUser: loggedUser && loggedUser.data.data[0],
          loading: false
        });
      })
      .catch(err => console.log(err));
  }

  onFollow = isFollowing => {
    const userStore = JSON.parse(localStorage.getItem("user"));
    const { user, loggedUser, follows } = this.state;
    this.setState({
      loadingBtn: true
    });

    if (!userStore) {
      Router.pushRoute("login");
    } else {
      if (!isFollowing) {
        axios
          .post(
            "https://kitsu.io/api/edge/follows",
            {
              data: {
                relationships: {
                  follower: { data: { type: "users", id: loggedUser.id } },
                  followed: { data: { type: "users", id: user.id } }
                },
                type: "follows"
              }
            },
            {
              headers: {
                "content-type": "application/vnd.api+json",
                Authorization: "Bearer " + userStore.data.access_token
              }
            }
          )
          .then(({ data }) => {
            this.setState(state => {
              const { isFollowing, follows } = state;

              return {
                isFollowing: !isFollowing,
                loadingBtn: false,
                follows: [
                  ...follows,
                  {
                    relationships: {
                      follower: { data: { type: "users", id: loggedUser.id } },
                      followed: { data: { type: "users", id: user.id } }
                    },
                    type: "follows",
                    id: data.data.id
                  }
                ]
              };
            });
          })
          .catch(err => console.log(err));
      } else {
        console.log(follows);
        const deletedFollow = follows
          .reverse()
          .find(item => item.relationships.followed.data.id === user.id);
        axios
          .delete(`https://kitsu.io/api/edge/follows/${deletedFollow.id}`, {
            headers: {
              "content-type": "application/vnd.api+json",
              Authorization: "Bearer " + userStore.data.access_token
            }
          })
          .then(() => {
            this.setState(state => {
              const { isFollowing } = state;

              return {
                isFollowing: !isFollowing,
                loadingBtn: false
              };
            });
          })
          .catch(err => console.log(err));
      }
    }
  };

  render() {
    const {
      user,
      favorites,
      stats,
      isFollowing,
      loading,
      loadingBtn
    } = this.state;
    if (loading) {
      return <Loading />;
    }

    const favoritesAnime = favorites.filter(item => item.type === "anime");
    const favoritesManga = favorites.filter(item => item.type === "manga");
    const favoritesCharacters = favorites.filter(
      item => item.type === "characters"
    );

    const animeDuration = stats.find(
      item => item.attributes.kind === "anime-amount-consumed"
    ).attributes.statsData.time;

    const animeCompleted = stats.find(
      item => item.attributes.kind === "anime-amount-consumed"
    ).attributes.statsData.completed;

    const animeMedia = stats.find(
      item => item.attributes.kind === "anime-amount-consumed"
    ).attributes.statsData.media;

    const mangaCompleted = stats.find(
      item => item.attributes.kind === "manga-amount-consumed"
    ).attributes.statsData.completed;

    const mangaMedia = stats.find(
      item => item.attributes.kind === "manga-amount-consumed"
    ).attributes.statsData.media;

    let {
      coverImage,
      avatar,
      name,
      about,
      gender,
      location,
      birthday,
      createdAt
    } = user.attributes;

    if (!coverImage) {
      coverImage = {
        original:
          "https://atiinc.org/wp-content/uploads/2017/01/cover-default.jpg"
      };
    }

    return (
      <AppWrapper title="123">
        <section className="anime-view o-main-layout">
          <Sidebar small={true} />
          <div
            className="o-main o-anime-view o-episode-view"
            style={{
              backgroundImage: `linear-gradient(15deg,rgba(20, 28, 36, 1) 10%, rgba(30, 34, 38, 0.97) 40%,  rgba(30, 34, 38, 0.99) 100%) , url(${
                coverImage.original
              })`
            }}
          >
            <Header isFixedNoBg profileId={user.id} />
            <div className="anime">
              <div className="anime-container">
                <div className="anime__info">
                  <div className="anime__info__title-area">
                    <div className="anime__info__title">{name}</div>
                  </div>
                  <div className="anime__rating">
                    {gender && (
                      <div className="anime__rating__text">
                        <i className="fa fa-user" /> {gender}
                      </div>
                    )}
                    <br />
                    {location && (
                      <div className="anime__rating__text">
                        <i className="fa fa-location-arrow" /> {location}
                      </div>
                    )}
                    {birthday && (
                      <div className="anime__rating__text">
                        <i className="fa fa-birthday-cake" />{" "}
                        {moment(birthday).format("MMM Do YYYY")}
                      </div>
                    )}

                    {createdAt && (
                      <div className="anime__rating__text">
                        <i className="fa fa-calendar" />{" "}
                        {moment(createdAt).format("MMM Do YYYY")}
                      </div>
                    )}
                  </div>
                  <div className="anime__description">
                    {about ? about : "About Me: That's a secret"}
                  </div>
                  <div className="anime__details">
                    <div className="anime__details__stats">
                      <div>
                        {stats[1].attributes.statsData.categories && (
                          <Bar
                            data={chartData}
                            width={1000}
                            height={400}
                            options={{
                              maintainAspectRatio: false
                            }}
                          />
                        )}
                      </div>

                      <div className="anime__details__stats__rightSide">
                        <div>
                          <span className="o-is-primary">
                            {moment
                              .duration(animeDuration, "seconds")
                              .humanize()}{" "}
                          </span>
                          spent watching Anime
                        </div>
                        <div>
                          <span className="o-is-primary">{animeCompleted}</span>{" "}
                          Anime completed
                        </div>
                        <div>
                          <span className="o-is-primary">{animeMedia}</span>{" "}
                          Anime started
                        </div>{" "}
                        <div>
                          <span className="o-is-primary">{mangaCompleted}</span>{" "}
                          Manga completed
                        </div>
                        <div>
                          <span className="o-is-primary">{mangaMedia}</span>{" "}
                          Manga started
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <RightSidebar
              coverImage={coverImage}
              posterImage={avatar}
              status={status}
              user={user}
              isUser
              isFollowing={isFollowing}
              loadingBtn={loadingBtn}
              onFollow={this.onFollow}
            />
          </div>
          <div className="secondary">
            <FavoriteItems
              anime={favoritesAnime}
              manga={favoritesManga}
              characters={favoritesCharacters}
            />
            <UserPostsWrapper className="o-posts" user={user} />
          </div>
        </section>
      </AppWrapper>
    );
  }
}

export default UserView;
