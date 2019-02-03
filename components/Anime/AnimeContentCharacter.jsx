import React from 'react';
import Link from 'next/link';

const AnimeContentCharacter = ({ url, bgImage, name }) => (
  <div className="secondary__content__items__box">
    <Link to={url}>
      <div>
        <div
          className="secondary__content__items__box__img"
          style={{
            backgroundImage: `url(${bgImage})`,
          }}
        />
        <div className="secondary__content__items__box__title">{name}</div>
      </div>
    </Link>
  </div>
);

export default AnimeContentCharacter;
