import React from "react";
import Link from "next/link";
import classNames from "classnames";

const AnimeContentItem = ({
  number,
  slug,
  thumbnail,
  relativeNumber,
  canonicalTitle,
  url,
  bgImage,
  franchiseType = false
}) => {
  const classes = classNames("secondary__content__items__box__number ", {
    "secondary__content__items__box__number--manga": franchiseType
  });
  return (
    <div className="secondary__content__items__box">
      <Link href={url}>
        <a>
          <div>
            <div className={classes}>
              #{number ? number : franchiseType === "manga" ? "Manga" : "Anime"}
            </div>
            <div
              className="secondary__content__items__box__img"
              style={{
                backgroundImage: `url(${
                  bgImage ? bgImage : thumbnail.original
                })`
              }}
            />
            <div className="secondary__content__items__box__title">
              {relativeNumber ? "Episode " + relativeNumber : canonicalTitle}
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default AnimeContentItem;
