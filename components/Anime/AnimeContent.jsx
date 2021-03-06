import React from "react";
import AnimeContentItem from "./AnimeContentItem";
import Link from "next/link";
import Button from "antd/lib/button";
import AnimeContentCharacter from "./AnimeContentCharacter";

const AnimeContent = ({ title, type, data = [], slug, posterImage = null }) => {
  let url =
    type !== "chapters"
      ? "/anime/" + slug + "/" + type
      : "/manga/" + slug + "/" + type;

  if (type === "episodes") {
    data = data.slice(0, 8);
  }

  if (type === "characters") {
    data = data
      .filter(character => character.attributes.image !== undefined)
      .slice(0, 8);
  }

  const classes = "secondary__content " + type;
  return (
    <div className={classes}>
      <div className="secondary__content__title">
        <h6 className="secondary__content__title__text">
          {title}
          <div className="secondary__content__title__text__blur" />
          <hr />
        </h6>
        {type !== "franchise" && type !== "actors" && (
          <Link href={url}>
            <h4 className="secondary__content__title__view-all">View all</h4>
          </Link>
        )}
      </div>
      <div className="secondary__content__items">
        {data.map(item => {
          let { id } = item;
          let {
            canonicalTitle,
            thumbnail,
            relativeNumber,
            number,
            image,
            name
          } = item.attributes;
          if (!thumbnail) {
            thumbnail = posterImage;
          }
          let mainUrl;
          if (type === "episodes") {
            mainUrl = "/anime/" + slug + "/episodes/" + number;
          }
          if (type === "actors") {
            mainUrl = "";
          }
          if (type === "chapters") {
            mainUrl = "/manga/" + slug + "/chapters/" + number;
          }
          if (type === "characters" || type === "actors") {
            let bgImage = image
              ? image.original
                ? image.original
                : ""
              : posterImage;
            let url = "/characters/view/" + slug;
            return (
              <AnimeContentCharacter url={url} bgImage={bgImage} name={name} />
            );
          }
          let franchiseImage = false;
          let franchiseType = false;
          if (type === "franchise") {
            franchiseImage = item.attributes.posterImage;
            franchiseType = item.type;
            const franchiseSlug = item.attributes.slug;
            mainUrl =
              franchiseType === "anime"
                ? "/anime/" + franchiseSlug || slug
                : "/manga/" + franchiseSlug || slug;
          }

          return (
            <AnimeContentItem
              number={number}
              thumbnail={franchiseImage ? franchiseImage : thumbnail}
              relativeNumber={relativeNumber}
              canonicalTitle={
                canonicalTitle ||
                (type === "chapters" ? `Chapter ${number}` : "")
              }
              franchiseType={franchiseType ? franchiseType : false}
              slug={slug}
              url={mainUrl || url}
            />
          );
        })}
      </div>
      {type !== "franchise" && type !== "actors" && (
        <h4 className="custom-btn custom-btn--no-margin">
          <Link href={url}>
            <a>View More</a>
          </Link>
        </h4>
      )}
    </div>
  );
};

export default AnimeContent;
