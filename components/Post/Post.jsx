import React from 'react';
import { Avatar, Card, List } from 'antd';
import moment from 'moment';
import Link from 'next/link';
import { defaultImage } from '../../utils/general';

const { Meta } = Card;

const Post = ({ post, user, uploads, episodes }) => {
  const { comments } = post;
  console.log(post);
  const {
    attributes: { avatar, name },
  } = user;
  let uploadImage = false;
  let postMedia = false;
  if (post.relationships.uploads.data.length) {
    const uploadId = post.relationships.uploads.data[0].id;
    const upload = uploads.find(item => item.id === uploadId);
    uploadImage = upload ? upload.attributes.content.original : '';
  }

  if (post.relationships.spoiledUnit.data) {
    const mediaId = post.relationships.spoiledUnit.data.id;

    const mediaItem = episodes.find(item => item.id === mediaId);
    postMedia = mediaItem;
  }

  const {
    attributes: { contentFormatted, embed, createdAt },
  } = post;

  return (
    <div className="o-posts__item__container">
      <Card className="o-posts__item" cover={embed && <img src={embed.url} />}>
        <Meta
          avatar={
            <Avatar
              src={
                user.attributes.avatar
                  ? avatar.original
                  : 'https://i.imgur.com/6YIfIVO.jpg'
              }
            />
          }
          title={name}
          description={moment(createdAt).format('Do MMMM YYYY')}
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
            <Meta
              title={
                postMedia.attributes.canonicalTitle +
                ' - ' +
                'Episode ' +
                postMedia.attributes.number
              }
              description={postMedia.attributes.synopsis.substr(0, 200) + '...'}
            />
          </Card>
        )}
      </Card>
      {comments.length > 0 && (
        <Card
          className="o-posts__item o-posts__item__comments"
          cover={embed && <img src={embed.url} />}
        >
          <>
            {
              <div className="o-posts__item__comments__row">
                <div className="o-posts__item__comments__row__show-more">
                  <Link to={`/posts/${post.id}`}>Show previous comments</Link>
                </div>
                <div className="o-posts__item__comments__row__comments-count">
                  {comments.length < 2 ? 1 : 2} of {comments.length}
                </div>
              </div>
            }
            <List
              itemLayout="horizontal"
              dataSource={comments.slice(0, 2).reverse()}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={
                          item.user.attributes.avatar.original || defaultImage
                        }
                      />
                    }
                    title={
                      <Link to={`/users/${item.user.id}`}>
                        {item.user.attributes.name}
                      </Link>
                    }
                    description={
                      <div
                        dangerouslySetInnerHTML={{
                          __html: item.attributes.contentFormatted,
                        }}
                      />
                    }
                  />
                </List.Item>
              )}
            />
          </>
        </Card>
      )}
    </div>
  );
};

export default Post;
