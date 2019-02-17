import React from "react";
import Rating from "../Rating";
import Chip from "../Chip";

const AnimeInfo = ({
  starCount,
  titles,
  synopsis,
  averageRating,
  popularityRank,
  ratingRank,
  categories,
  openModal,
  type
}) => (
  <div className="anime">
    <div className="anime-container">
      <div className="anime__info">
        <div className="anime__info__title-area">
          <div className="anime__info__title">{titles.en}</div>
          <div className="anime__info__btn-trailer" onClick={openModal}>
            <i className="fa fa-play" />
          </div>
        </div>
        <div className="anime__rating">
          <div className="anime__rating__star">
            <Rating starsCount={starCount} />
          </div>
          <div className="anime__rating__text">
            {averageRating + "% Community Rating"}
          </div>
        </div>
        <div className="anime__description">{synopsis}</div>
        <div className="anime__details">
          <div className="anime__details__rank anime__details__rank--popular">
            <i className="fa fa-heart" />
            <div className="anime__details__rank__number">
              Rank #{popularityRank}{" "}
              {popularityRank <= 30 ? "(Most Popular Anime)" : ""}
            </div>
          </div>
          <div className="anime__details__rank anime__details__rank--rated">
            <i className="fa fa-star" />
            <div className="anime__details__rank__number">
              Rank #{ratingRank}{" "}
              {ratingRank <= 10 ? "(Highest Rated Anime)" : ""}
            </div>
          </div>
        </div>
        <div className="anime__details__rank anime__genres">
          {categories.slice(0, 15).map(category => (
            <Chip item={category} type={type} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default AnimeInfo;
