import React from "react";
import Post from "../../components/Post/Post";
import classNames from "classnames";
import Link from "next/link";

const UserPosts = ({
  posts = [],
  user,
  uploads = [],
  episodes = [],
  comments = [],
  className
}) => {
  return (
    <div className="secondary__content">
      <div className="secondary__content__title">
        <div className="secondary__content__title__text">
          Posts
          <div className="secondary__content__title__text__blur" />
          <hr />
        </div>
        <Link to="">
          <div className="secondary__content__title__view-all">View all</div>
        </Link>
      </div>
      <div className={className}>
        {posts.map(post => {
          return (
            <Post
              post={post}
              user={user}
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
