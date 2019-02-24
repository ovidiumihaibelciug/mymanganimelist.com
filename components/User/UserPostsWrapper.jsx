import React, { Component } from "react";
import UserPosts from "./UserPosts";
import axios from "axios";
import { Button } from "antd";

class UserPostsWrapper extends Component {
  state = {
    comments: [],
    uploads: [],
    episodes: [],
    posts: [],
    loading: false,
    next: ""
  };

  componentDidMount() {
    const { user } = this.props;

    axios
      .get(
        `https://kitsu.io/api/edge/feeds/user_aggr/${
          user.id
        }?filter%5Bkind%5D=posts&include=target.user,target.spoiled_unit,target.media,target.uploads,target&page%5Blimit%5D=10`,
        {
          params: {
            "page[limit]": 10
          }
        }
      )
      .then(({ data }) => {
        console.log(data);
        const users = data.included.filter(item => item.type === "users");
        const anime = data.included.filter(item => item.type === "anime");
        const uploads = data.included.filter(item => item.type === "uploads");
        const episodes = data.included.filter(item => item.type === "episodes");
        const posts = data.included
          .filter(item => item.type === "posts")
          .map(post => {
            const { id: userId } = post.relationships.user.data;

            post.user = users.find(user => user.id === userId);

            return post;
          });
        console.log(posts);
        this.setState({
          uploads,
          episodes,
          posts,
          anime,
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
        console.log(data);
        const users = data.included.filter(item => item.type === "users");
        const anime = data.included.filter(item => item.type === "anime");
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
          uploads,
          episodes,
          posts: [...oldPosts, ...posts],
          anime,
          next: data.links.next,
          loading: false
        });
      })
      .catch(err => console.log(err));
  };

  render() {
    const { className, user } = this.props;
    const { posts, episodes, uploads, anime, next, loading } = this.state;
    if (!posts.length || loading) return null;

    return (
      <>
        <UserPosts
          posts={posts}
          uploads={uploads}
          user={user}
          episodes={episodes}
          anime={anime}
          className={className}
        />
        {next && (
          <div className="custom-btn" style={{ marginRight: 0 }}>
            <Button type="primary" ghost onClick={this.handleLoadMore}>
              Load More
            </Button>
          </div>
        )}
      </>
    );
  }
}

export default UserPostsWrapper;
