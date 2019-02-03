import React, { Component } from 'react';
import Link from 'next/link'

export default class AnimeItem extends Component {
  state = {
    genre: '',
  };

  render() {
    const { attributes } = this.props.item;
    const { titles, posterImage, createdAt, episodeCount, slug } = attributes;
    const { genre } = this.state;
    return (
      <Link  as={'/anime/' + slug} href={{ pathname: '/anime', query: { slug } }}>
        <a className="item">
          <div
            className="item--img"
            style={{
              backgroundImage: `url(${
                posterImage
                  ? posterImage.medium
                    ? posterImage.medium
                    : posterImage.original
                  : 'http://cdn.animeherald.com/aniheraldcdn/2015/11/Image-not-Available-Header-001-20160810.jpg'
              })`,
            }}
          />
          <div className="item--presentation">
            <div className="title">
              {titles
                ? titles.en
                  ? titles.en
                  : titles.en_us
                  ? titles.en_us
                  : titles.en_jp
                : ''}
            </div>
            <div className="details">
              <div className="genre">{genre}</div>
              <span>&nbsp; &middot; &nbsp;</span>
              <div className="duration">
                {episodeCount ? episodeCount + 'e' : ''}
              </div>
              <span>&nbsp; &middot; &nbsp;</span>
              <div className="year">{new Date(createdAt).getFullYear()}</div>
            </div>
          </div>
        </a>
      </Link>
    );
  }
}
