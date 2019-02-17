import React from "react";
import AnimeContentItem from "./AnimeContentItem";
import Link from "next/link";
import Button from "antd/lib/button";
import AnimeContentCharacter from "./AnimeContentCharacter";

const AnimeContent = ({ title, type, data = [], slug, posterImage = null }) => {
  console.log("b", slug);
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
        <div className="secondary__content__title__text">
          {title}
          <div className="secondary__content__title__text__blur" />
          <hr />
        </div>
        {type !== "franchise" && type !== "actors" && (
          <Link to={url}>
            <div className="secondary__content__title__view-all">View all</div>
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
            mainUrl =
              franchiseType === "anime" ? "/anime/" + slug : "/manga/" + slug;
          }

          return (
            <AnimeContentItem
              number={number}
              thumbnail={franchiseImage ? franchiseImage : thumbnail}
              relativeNumber={relativeNumber}
              canonicalTitle={canonicalTitle}
              franchiseType={franchiseType ? franchiseType : false}
              slug={slug}
              url={mainUrl || url}
            />
          );
        })}
      </div>
      {type !== "franchise" && type !== "actors" && (
        <div className="custom-btn custom-btn--no-margin">
          <Link href={url}>
            <a>View More</a>
          </Link>
        </div>
      )}
    </div>
  );
};

export default AnimeContent;
