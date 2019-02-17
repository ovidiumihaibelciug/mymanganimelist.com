import React from "react";
import { Avatar, Card } from "antd";
import moment from "moment";
import Link from "next/link";
import { defaultImage } from "../../utils/general";
import CommentsList from "./Comment/CommentList";

const { Meta } = Card;

const Post = ({ post, user, uploads, episodes, comments = false }) => {
  if (!post || !user) return null;

  if (!user) {
    user = {
      attributes: {
        avatar: "",
        name: ""
      }
    };
  }
  if (!user.hasOwnProperty("attributes")) {
    user.attributes = {
      avatar: "",
      name: ""
    };
  }
  const {
    attributes: { avatar, name }
  } = user;
  let uploadImage = false;
  let postMedia = false;
  if (
    post &&
    post.relationships.uploads &&
    post.relationships.uploads.data &&
    post.relationships.uploads.data.length
  ) {
    const uploadId = post.relationships.uploads.data[0].id;
    const upload = uploads.find(item => item.id === uploadId);
    uploadImage = upload ? upload.attributes.content.original : "";
  }

  if (
    post &&
    post.relationships.spoiledUnit &&
    post.relationships.spoiledUnit.data
  ) {
    const mediaId = post.relationships.spoiledUnit.data.id;

    const mediaItem = episodes.find(item => item.id === mediaId);
    postMedia = mediaItem;
  }

  const {
    attributes: { contentFormatted, embed, createdAt }
  } = post;

  return (
    <div className="o-posts__item__container">
      <Card className="o-posts__item" cover={embed && <img src={embed.url} />}>
        <Meta
          avatar={
            <Avatar
              src={
                user && user.attributes.avatar
                  ? avatar.original
                  : "https://i.imgur.com/6YIfIVO.jpg"
              }
            />
          }
          title={name}
          description={moment(createdAt).format("Do MMMM YYYY")}
        />

        <div dangerouslySetInnerHTML={{ __html: contentFormatted }} />
        {uploadImage && <img src={uploadImage} alt="" />}

        {postMedia && (
          <Card
            hoverable
            className="o-posts__item__anime"
            cover={
              <img
                alt="example"
                src={
                  postMedia.attributes.thumbnail &&
                  postMedia.attributes.thumbnail.original
                }
              />
            }
          >
            {postMedia && (
              <Meta
                title={
                  postMedia.attributes.canonicalTitle +
                  " - " +
                  "Episode " +
                  postMedia.attributes.number
                }
                description={
                  postMedia.attributes.synopsis.substr(0, 200) + "..."
                }
              />
            )}
          </Card>
        )}
      </Card>
      {post && (
        <CommentsList
          comments={comments}
          postId={post.id}
          embed={embed}
          post={post}
        />
      )}
    </div>
  );
};

export default Post;
