import React, { Component } from "react";
import Link from "next/link";

export class Item extends Component {
  state = {
    genre: ""
  };

  render() {
    const { attributes } = this.props.item;
    const { titles, posterImage, createdAt, episodeCount, slug } = attributes;
    const { genre } = this.state;
    return (
      <Link href={"/manga/view/" + slug}>
        <a>
          <div className="item">
            <div
              className="item--img"
              style={{
                backgroundImage: `url(${
                  posterImage
                    ? posterImage.medium
                      ? posterImage.medium
                      : posterImage.original
                    : "http://cdn.animeherald.com/aniheraldcdn/2015/11/Image-not-Available-Header-001-20160810.jpg"
                })`
              }}
            />
            <div className="item--presentation">
              <h2 className="title">
                {titles.en
                  ? titles.en
                  : titles.en_us
                  ? titles.en_us
                  : titles.en_jp}
              </h2>
              <div className="details">
                <h3 className="genre">{genre}</h3>
                <span>&nbsp; &middot; &nbsp;</span>
                <h3 className="duration">
                  {episodeCount ? episodeCount + "e" : ""}
                </h3>
                <span>&nbsp; &middot; &nbsp;</span>
                <h3 className="year">{new Date(createdAt).getFullYear()}</h3>
              </div>
            </div>
          </div>
        </a>
      </Link>
    );
  }
}

export default Item;
