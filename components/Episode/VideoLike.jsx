import React from 'react';
import classnames from 'classnames';

const VideoLike = ({ item, posterImage, thumbnail, color }) => {
  return (
    <div className="video-item">
      <a href={item.attributes.url}>
        <div
          className="video type-1"
          style={{
            backgroundImage: `linear-gradient(15deg,rgba(0, 0, 0, .92) 10%, rgba(0, 0, 0, 0.92) 40%,  rgba(0, 0, 0, 0.92) 100%), url(${
              posterImage.original ? posterImage.original : thumbnail.original
            })`,
          }}
        >
          <div className="play-button">
            <i className="fa fa-play" />
          </div>
        </div>
      </a>
    </div>
  );
};

export default VideoLike;
