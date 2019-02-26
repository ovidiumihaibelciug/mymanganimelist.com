import React from "react";
import Link from "next/link";

const AnimeContentCharacter = ({ url, bgImage, name }) => (
  <div className="secondary__content__items__box">
    <Link href={url}>
      <a>
        <div>
          <div
            className="secondary__content__items__box__img"
            style={{
              backgroundImage: `url(${bgImage})`
            }}
          />
          <h3 className="secondary__content__items__box__title">{name}</h3>
        </div>
      </a>
    </Link>
  </div>
);

export default AnimeContentCharacter;
