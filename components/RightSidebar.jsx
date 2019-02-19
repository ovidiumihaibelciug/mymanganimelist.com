import React from "react";
import { Button } from "antd";

import moment from "moment";

const toggleSidebar = () => {
  const sidebar = document.querySelector(".o-sidebar");
  sidebar.classList.toggle("hide");
};

const RightSidebar = ({
  coverImage,
  posterImage,
  status,
  nextRelease,
  isUser,
  isFollowing,
  user,
  onFollow,
  loadingBtn
}) => {
  const duration = date => {
    let eventDate = moment(date);
    return eventDate.fromNow();
  };

  return (
    <div
      className="o-rightsidebar"
      style={{
        backgroundImage: `linear-gradient(to left, rgba(1,5,10,.8), rgba(1, 7, 14,.9)) , url(${
          coverImage.original
        })`
      }}
    >
      <div className="o-rightsidebar__content">
        <div className="o-rightsidebar__content__wrapper">
          <div
            className="o-rightsidebar__content__poster"
            style={{ backgroundImage: `url(${(posterImage && posterImage.original) || ""})` }}
          />
          {isUser && (
            <div className="o-rightsidebar__content__username">
              {user.attributes.name}
            </div>
          )}
        </div>
        <div className="o-rightsidebar__content__main">
          {isUser && (
            <div className="o-rightsidebar__content__main__follow-btn">
              <div
                className="o-btn o-btn__follow"
                onClick={() => onFollow(isFollowing)}
              >
                <button>
                  {!loadingBtn ? (
                    !isFollowing ? (
                      "Follow"
                    ) : (
                      "Unfollow"
                    )
                  ) : (
                    <i className="fas fa-spinner fa-spin" />
                  )}
                </button>
              </div>
            </div>
          )}
          {status === "current" && (
            <div className="o-rightsidebar__content__main__next-episode">
              <div className="o-rightsidebar__content__main__next-episode__text">
                Next episode:
              </div>{" "}
              &nbsp;
              <div className="o-rightsidebar__content__main__next-episode__time">
                {duration(nextRelease)}
              </div>
            </div>
          )}
        </div>
        {isUser && (
          <div className="o-rightsidebar__content__bottom">
            <div className="blur" />
            <div className="o-rightsidebar__content__bottom__item">
              <div className="o-rightsidebar__content__bottom__item__title">
                Followers
              </div>
              <div className="o-rightsidebar__content__bottom__item__number">
                {user.attributes.followersCount}
              </div>
            </div>{" "}
            <div className="o-rightsidebar__content__bottom__item">
              <div className="o-rightsidebar__content__bottom__item__title">
                Following
              </div>
              <div className="o-rightsidebar__content__bottom__item__number">
                {user.attributes.followingCount}
              </div>
            </div>
            <div className="o-rightsidebar__content__bottom__item">
              <div className="o-rightsidebar__content__bottom__item__title">
                Likes
              </div>
              <div className="o-rightsidebar__content__bottom__item__number">
                {user.attributes.likesReceivedCount}
              </div>
            </div>
            <div />
            <div />
          </div>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
