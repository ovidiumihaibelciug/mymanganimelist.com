import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../layout/Header";
import { KAPI } from "../utils";
import axios from "axios";
import RightSidebar from "../components/RightSidebar";
import Loading from "../components/Loading";
import moment from "moment";
import AppWrapper from "../components/AppWrapper";
import { Router } from "../routes";
import Link from "next/link";
import { Card, List, Avatar } from "antd";
const { Meta } = Card;

class UserView extends React.Component {
  static getInitialProps({ query: { id } }) {
    return { id };
  }

  state = {
    user: {},
    stats: [],
    loading: true,
    showRightSideBar: false
  };

  componentDidMount() {
    const { id } = this.props;

    axios
      .all([
        axios.get(KAPI + "/posts/" + id, {
          params: { include: "user,uploads,media,spoiledUnit,ama,postLikes" }
        }),
        axios.get(KAPI + "/comments", {
          params: {
            "filter[postId]": id,
            include: "user,uploads,replies,likes"
          }
        })
      ])
      .then(([{ data }, { data: commentsData }]) => {
        console.log(commentsData);
        const user = data.included.find(item => item.type === "users");
        const commentsUser = commentsData.included.filter(
          item => item.type === "users"
        );
        const postLikes = data.included.filter(
          item => item.type === "postLikes"
        );
        const postUploads = data.included.filter(
          item => item.type === "uploads"
        );

        const anime = data.included.filter(item => item.type === "anime");
        const episodes = data.included.filter(item => item.type === "episodes");

        const commentsUploads =
          commentsData.data.length &&
          commentsData.included.filter(item => item.type === "uploads");

        const comments = commentsData.data.map(item => {
          const userId = item.relationships.user.data.id;

          item.user = commentsUser.find(item => item.id === userId);
          item.replies = "";
        });

        this.setState({
          user,
          commentsUser,
          anime,
          episodes,
          postLikes,
          comments: commentsData.data,
          post: data.data,
          postUploads,
          commentsUploads,
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

  showRightSideInfo = () => {
    this.setState(state => {
      const { showRightSideBar } = state;

      return {
        showRightSideBar: !showRightSideBar
      };
    });
  };

  render() {
    let {
      user,
      post,
      anime,
      episodes,
      isFollowing,
      postLikes = [],
      comments,
      postUploads,
      showRightSideBar,
      loading
    } = this.state;

    if (!user || !post) {
      return null;
    }

    if (loading) {
      return <Loading />;
    }

    let { coverImage, avatar, name } = user.attributes;

    const { createdAt, contentFormatted } = post.attributes;

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
          <div className="o-main o-anime-view o-post-view">
            <Header
              isFixedNoBg
              profileId={user.id}
              showRightSideInfo={this.showRightSideInfo}
              showRightSideBar={showRightSideBar}
            />
            <div className="post-view">
              <div className="post-view__container">
                <div className="post-view__info">
                  <div className="anime__info__title-area">
                    <div className="anime__info__title">{name}</div>
                  </div>
                  <div className="anime__rating">
                    {postLikes && (
                      <div className="anime__rating__text">
                        {postLikes.length} <i className="far fa-heart" />
                      </div>
                    )}
                    {comments && (
                      <div className="anime__rating__text">
                        {comments.length} <i className="far fa-comments" />
                      </div>
                    )}

                    {createdAt && (
                      <div className="anime__rating__text">
                        <i className="fa fa-calendar" />{" "}
                        {moment(createdAt).format("MMM Do YYYY")}
                      </div>
                    )}
                  </div>
                  <div
                    className="anime__description"
                    dangerouslySetInnerHTML={{ __html: contentFormatted }}
                  />
                  <div className="post__uploads">
                    {postUploads.map(item => {
                      return (
                        <img src={item.attributes.content.original} alt="" />
                      );
                    })}
                  </div>
                  <div className="post__media">
                    {anime.map(item => {
                      let postMedia = item;
                      let mediaType = "anime";
                      return (
                        postMedia && (
                          <Link
                            href={
                              mediaType === "anime"
                                ? "/anime/" + postMedia.id
                                : "/episode/" + postMedia.id
                            }
                          >
                            <a>
                              <Card
                                hoverable
                                className="o-posts__item__anime"
                                cover={
                                  mediaType && (
                                    <img
                                      src={
                                        mediaType === "episode"
                                          ? postMedia.attributes.thumbnail &&
                                            postMedia.attributes.thumbnail
                                              .original
                                          : mediaType === "anime"
                                          ? postMedia.attributes.coverImage
                                            ? postMedia.attributes.coverImage
                                                .original
                                            : postMedia.attributes.posterImage
                                                .original
                                          : false
                                      }
                                    />
                                  )
                                }
                              >
                                {postMedia && (
                                  <Meta
                                    title={
                                      postMedia.attributes.canonicalTitle
                                        ? postMedia.attributes.canonicalTitle
                                        : "" +
                                          `${mediaType === "episode" &&
                                            " Episode " +
                                              postMedia.attributes.number}`
                                    }
                                    description={
                                      postMedia.attributes &&
                                      postMedia.attributes.synopsis
                                    }
                                  />
                                )}
                              </Card>
                            </a>
                          </Link>
                        )
                      );
                    })}
                    {episodes.map(item => {
                      let postMedia = item;
                      let mediaType = "episode";
                      return (
                        postMedia && (
                          <Link
                            href={
                              mediaType === "anime"
                                ? "/anime/" + postMedia.id
                                : "/episode/" + postMedia.id
                            }
                          >
                            <a>
                              <Card
                                hoverable
                                className="o-posts__item__anime"
                                cover={
                                  mediaType && (
                                    <img
                                      src={
                                        mediaType === "episode"
                                          ? postMedia.attributes.thumbnail &&
                                            postMedia.attributes.thumbnail
                                              .original
                                          : mediaType === "anime"
                                          ? postMedia.attributes.coverImage
                                            ? postMedia.attributes.coverImage
                                                .original
                                            : postMedia.attributes.posterImage
                                                .original
                                          : false
                                      }
                                    />
                                  )
                                }
                              >
                                {postMedia && (
                                  <Meta
                                    title={
                                      postMedia.attributes.canonicalTitle
                                        ? postMedia.attributes.canonicalTitle
                                        : "" +
                                          `${mediaType === "episode" &&
                                            " Episode " +
                                              postMedia.attributes.number}`
                                    }
                                    description={
                                      postMedia.attributes &&
                                      postMedia.attributes.synopsis
                                    }
                                  />
                                )}
                              </Card>
                            </a>
                          </Link>
                        )
                      );
                    })}
                  </div>
                </div>
              </div>
              {comments.length > 0 && (
                <div className="secondary post__secondary">
                  <div className="secondary__content">
                    <div className="secondary__content__title">
                      <div className="secondary__content__title__text">
                        Comments
                        <div className="secondary__content__title__text__blur" />
                        <hr />
                      </div>
                    </div>
                    <div className="post__secondary__comment">
                      <List
                        itemLayout="vertical"
                        size="large"
                        pagination={{
                          onChange: page => {
                            console.log(page);
                          },
                          pageSize: 3
                        }}
                        dataSource={comments}
                        renderItem={item => (
                          <List.Item key={"123"} actions={[]}>
                            <List.Item.Meta
                              avatar={
                                <Avatar
                                  src={item.user.attributes.avatar.original}
                                />
                              }
                              title={
                                <Link href={"/user/" + item.user.id}>
                                  <a>{item.user.attributes.name}</a>
                                </Link>
                              }
                              description={item.attributes.content}
                            />
                          </List.Item>
                        )}
                      />
                    </div>
                  </div>
                </div>
              )}
              <RightSidebar
                coverImage={coverImage}
                posterImage={avatar}
                status={status}
                user={user}
                isUser
                isFollowing={isFollowing}
                onFollow={this.onFollow}
                showRightSideBar={showRightSideBar}
              />
            </div>
          </div>
        </section>
      </AppWrapper>
    );
  }
}

export default UserView;
