import React, { Component } from "react";
import axios from "axios";
import Header from "../layout/Header";
import Sidebar from "../components/Sidebar";
import Post from "../components/Post/Post";

import Loading from "../components/Loading";
import { Button } from "antd";

import AppWrapper from "../components/AppWrapper";
import { seoData } from "../seoData";

class Feed extends Component {
  state = {
    comments: [],
    uploads: [],
    episodes: [],
    posts: [],
    next: "",
    loading: true
  };

  componentDidMount() {
    axios
      .get(
        "https://kitsu.io/api/edge/feeds/global/global?filter%5Bkind%5D=posts&include=media%2Cactor%2Cunit%2Csubject%2Ctarget%2Ctarget.user%2Ctarget.target_user%2Ctarget.spoiled_unit%2Ctarget.media%2Ctarget.target_group%2Ctarget.uploads%2Csubject.user%2Csubject.target_user%2Csubject.spoiled_unit%2Csubject.media%2Csubject.target_group%2Ctarget,subject.uploads%2Csubject.followed%2Csubject.library_entry%2Csubject.anime%2Csubject.manga&page%5Blimit%5D=10",
        {
          params: {
            "page[limit]": 10
          }
        }
      )
      .then(({ data }) => {
        const users = data.included.filter(item => item.type === "users");
        const comments = data.included
          .filter(item => item.type === "comments")
          .map(item => {
            const { id: userId, type } = item.relationships.user.data;
            const user = users.find(
              item => item.id === userId && item.type === type
            );
            item.user = user;

            return item;
          });
        const uploads = data.included.filter(item => item.type === "uploads");
        const episodes = data.included.filter(item => item.type === "episodes");
        const posts = data.included
          .filter(item => item.type === "posts")
          .map(post => {
            const { id: userId } = post.relationships.user.data;

            post.user = users.find(user => user.id === userId);

            return post;
          });
        this.setState({
          comments,
          uploads,
          episodes,
          posts: posts,
          loading: false,
          next: data.links.next
        });
      })
      .catch(err => console.log(err));
  }

  handleLoadMore = () => {
    const { next } = this.state;

    this.load(next);
  };

  load = next => {
    axios
      .get(next, {
        params: {
          "page[limit]": 20
        }
      })
      .then(({ data }) => {
        const users = data.included.filter(item => item.type === "users");
        const comments = data.included
          .filter(item => item.type === "comments")
          .map(item => {
            const { id: userId, type } = item.relationships.user.data;

            const user = users.find(
              item => item.id === userId && item.type === type
            );
            item.user = user;

            return item;
          });
        const posts = data.included
          .filter(item => item.type === "posts")
          .map(post => {
            const { id: userId } = post.relationships.user.data;
            post.user = users.find(user => user.id === userId);

            return post;
          });

        const uploads = data.included.filter(item => item.type === "uploads");
        const episodes = data.included.filter(item => item.type === "episodes");

        const { posts: oldPosts } = this.state;
        this.setState({
          comments,
          uploads,
          episodes,
          posts: [...oldPosts, ...posts],
          next: data.links.next,
          loading: false
        });
      })
      .catch(err => console.log(err));
  };

  render() {
    const { posts, uploads, episodes, loading } = this.state;

    if (loading) return <Loading />;

    return (
      <AppWrapper {...seoData.feed}>
        <section className="o-main-layout">
          <Sidebar />
          <section className="o-main o-dashboard">
            <Header isFixed />
            <div className="main-content">
              <div className="o-feed">
                {posts.map(post => (
                  <Post
                    post={post}
                    user={post.user}
                    uploads={uploads || []}
                    episodes={episodes || []}
                  />
                ))}
              </div>
              <div className="custom-btn" style={{ marginRight: 0 }}>
                <Button type="primary" ghost onClick={this.handleLoadMore}>
                  Load More
                </Button>
              </div>
            </div>
          </section>
        </section>
      </AppWrapper>
    );
  }
}

export default Feed;
