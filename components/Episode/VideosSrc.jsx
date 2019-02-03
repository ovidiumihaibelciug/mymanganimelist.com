import React from 'react';
import VideoLike from './VideoLike';

const VideosSrc = ({ videos, streamingLinks, thumbnail, posterImage }) => {
  return (
    <div className="secondary__content">
      <div className="secondary__content__title">
        <div className="secondary__content__title__text">
          Watch it now
          <div className="secondary__content__title__text__blur" />
          <hr />
        </div>
      </div>
      <div className="secondary__content__items items">
        {videos.length > 0
          ? videos.map(item => (
              <VideoLike
                thumbnail={thumbnail}
                posterImage={posterImage}
                item={item}
              />
            ))
          : streamingLinks &&
            streamingLinks.map(item => (
              <VideoLike
                thumbnail={thumbnail}
                posterImage={posterImage}
                item={item}
              />
            ))}
      </div>
    </div>
  );
};

export default VideosSrc;
