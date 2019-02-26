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
}) => {
  console.log(titles);
  return (
    <div className="anime">
      <div className="anime-container">
        <div className="anime__info">
          <div className="anime__info__title-area">
            <h1 className="anime__info__title">
              {titles.en || titles.en_jp || titles.ja_jp}
            </h1>
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
              <h2 className="anime__details__rank__number">
                Rank #{popularityRank} (Most Popular Anime)
              </h2>
            </div>
            <div className="anime__details__rank anime__details__rank--rated">
              <i className="fa fa-star" />
              <h2 className="anime__details__rank__number">
                Rank #{ratingRank} (Highest Rated Anime)
              </h2>
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
};

export default AnimeInfo;
