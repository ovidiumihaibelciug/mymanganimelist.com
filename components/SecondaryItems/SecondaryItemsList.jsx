import React, { Fragment } from 'react';
import EasyList from 'easify/dist/atoms/EasyList/EasyList';
import AnimeContentItem from '../Anime/AnimeContentItem';
import EasyLoadMore from 'easify/dist/atoms/EasyLoadMore/EasyLoadMore';
import AnimeContentCharacter from '../Anime/AnimeContentCharacter';

const SecondaryItemsList = ({ slug, posterImage, itemType, isAnime }) => (
  <Fragment>
    <EasyList>
      {({ data }) =>
        data.map(item => {
          let {
            image,
            relativeNumber,
            number,
            canonicalName,
            canonicalTitle,
            thumbnail,
          } = item.attributes;
          const characterSlug = item.attributes.slug;

          return itemType === 'characters' ? (
            <AnimeContentCharacter
              url={`/characters/view/` + characterSlug}
              bgImage={image ? image.original : posterImage}
              name={canonicalName}
            />
          ) : (
            <AnimeContentItem
              number={number}
              thumbnail={thumbnail ? thumbnail : posterImage}
              relativeNumber={relativeNumber}
              canonicalTitle={canonicalName ? canonicalName : canonicalTitle}
              slug={slug}
              url={
                `/${isAnime ? 'anime' : 'manga'}/` +
                slug +
                `/${itemType}/` +
                number
              }
            />
          );
        })
      }
    </EasyList>
    <div className="custom-btn">
      <EasyLoadMore />
    </div>
  </Fragment>
);

export default SecondaryItemsList;
