import React from "react";
import Post from "../../components/Post/Post";
import Link from "next/link";

const UserPosts = ({
  posts = [],
  user,
  uploads = [],
  episodes = [],
  comments = [],
  anime = [],
  className
}) => {
  return (
    <div className="secondary__content">
      <div className="secondary__content__title">
        <h2 className="secondary__content__title__text">
          Posts
          <div className="secondary__content__title__text__blur" />
          <hr />
        </h2>
        <Link to="">
          <div className="secondary__content__title__view-all" />
        </Link>
      </div>
      <div className={className}>
        {posts.map(post => {
          return (
            <Post
              post={post}
              user={user}
              anime={anime}
              uploads={uploads}
              episodes={episodes}
            />
          );
        })}
      </div>
    </div>
  );
};

export default UserPosts;
