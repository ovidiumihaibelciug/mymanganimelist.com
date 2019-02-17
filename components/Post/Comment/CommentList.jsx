import React, { Component } from "react";
import { Avatar, Card, List } from "antd";
import Link from "next/link";
import axios from "axios";
import { defaultImage } from "../../../utils/general";
import { KAPI } from "../../../utils";

class CommentsList extends Component {
  state = {
    comments: [],
    loading: true
  };

  componentDidMount() {
    const { postId } = this.props;
    axios
      .get(KAPI + "/comments", {
        params: {
          "filter[postId]": postId,
          include: "user"
        }
      })
      .then(({ data }) => {
        const users =
          data.included && data.included.filter(item => item.type === "users");
        const comments = data.data.map(item => {
          const { id: userId } = item.relationships.user.data;
          item.user = users.filter(item => item.id === userId)[0];

          return item;
        });
        console.log("comments", data);

        this.setState({
          comments,
          loading: false
        });
      });
  }

  render() {
    const { comments, loading } = this.state;
    const { embed, post } = this.props;
    if (loading) return null;
    return (
      <Card
        className="o-posts__item o-posts__item__comments"
        cover={embed && <img src={embed.url} />}
      >
        <div>
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
                        item.user &&
                        (item.user.attributes.avatar.original || defaultImage)
                      }
                    />
                  }
                  title={
                    <Link href={`/user/${item.user.id}`}>
                      <a>{item.user.attributes.name}</a>
                    </Link>
                  }
                  description={
                    <div
                      dangerouslySetInnerHTML={{
                        __html: item.attributes.contentFormatted
                      }}
                    />
                  }
                />
              </List.Item>
            )}
          />
        </div>
      </Card>
    );
  }
}

export default CommentsList;
