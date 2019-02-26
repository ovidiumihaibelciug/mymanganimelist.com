import React, { Component } from "react";
import Link from "next/link";

export default class AnimeItem extends Component {
  state = {
    genre: ""
  };

  render() {
    const { attributes } = this.props.item;
    const { titles, posterImage, createdAt, episodeCount, slug } = attributes;
    const { genre } = this.state;
    return (
      <Link
        as={"/anime/" + slug}
        href={{ pathname: "/anime", query: { slug } }}
      >
        <a className="item">
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
              {titles
                ? titles.en
                  ? titles.en
                  : titles.en_us
                  ? titles.en_us
                  : titles.en_jp
                : ""}
            </h2>
            <div className="details">
              <h6 className="genre">{genre}</h6>
              <span>&nbsp; &middot; &nbsp;</span>
              <h6 className="duration">
                {episodeCount ? episodeCount + "e" : ""}
              </h6>
              <span>&nbsp; &middot; &nbsp;</span>
              <h6 className="year">{new Date(createdAt).getFullYear()}</h6>
            </div>
          </div>
        </a>
      </Link>
    );
  }
}
