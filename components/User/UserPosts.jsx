import React from 'react';
import Post from '../../components/Post/Post';

const UserPosts = ({
  posts,
  user,
  uploads = [],
  episodes = [],
  comments = [],
  className,
}) => {
  console.log(posts);
  return (
    <div className={className}>
      {posts.map(post => {
        return (
          <Post post={post} user={user} uploads={uploads} episodes={episodes} />
        );
      })}
    </div>
  );
};

export default UserPosts;
