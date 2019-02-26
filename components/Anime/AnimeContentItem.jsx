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
            <h4 className={classes}>
              #{number ? number : franchiseType === "manga" ? "Manga" : "Anime"}
            </h4>
            <div
              className="secondary__content__items__box__img"
              style={{
                backgroundImage: `url(${
                  bgImage ? bgImage : thumbnail.original
                })`
              }}
            />
            <h5 className="secondary__content__items__box__title">
              {relativeNumber ? "Episode " + relativeNumber : canonicalTitle}
            </h5>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default AnimeContentItem;
