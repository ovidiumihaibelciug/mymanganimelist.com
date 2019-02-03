import React from 'react';
import { withRouter } from 'react-router';
import Sidebar from '../../components/Sidebar';
import Header from '../../layout/Header';
import { Molecule } from 'react-molecule';
import { EasyLoaderAgent, EasyLoadMoreAgent } from 'easify';
import RightSidebar from '../../components/RightSidebar';
import SecondaryFilters from '../../components/Filters/Secondary/SecondaryFilters';
import AnimeContentItem from '../../components/Anime/AnimeContentItem';
import SecondaryItemsList from '../../components/SecondaryItems/SecondaryItemsList';
import NoResults from '../../components/SecondaryItems/NoResults';

const Template = ({
  functions: { load, count, onSubmit, toggleFilters, stopFiltering },
  data,
  schema,
  match,
  itemType = 'episodes',
  isAnime = true,
  ...rest
}) => {
  let { anime, isFiltering = false, filteredItems = [], search } = data;
  console.log(data);
  const { slug } = match.params;
  const { attributes } = anime;
  const { coverImage, posterImage, status, nextRelease } = attributes;
  return (
    <Molecule
      agents={{
        loader: EasyLoaderAgent.factory({ load: load }),
        loadMore: EasyLoadMoreAgent.factory({
          count: count,
          initialItemsCount: 10,
          loadItemsCount: 20,
        }),
      }}
    >
      <section className="anime-view o-main-layout anime-episodes">
        <Sidebar small />
        <div className="o-main o-anime-view">
          <Header isFixed />
          <div className="anime-container">
            {schema && (
              <SecondaryFilters
                onSubmit={onSubmit}
                toggleFilters={toggleFilters}
                search={search}
                schema={schema}
              />
            )}
            {!isFiltering ? (
              <SecondaryItemsList
                slug={slug}
                posterImage={posterImage}
                isAnime={isAnime}
                itemType={itemType}
              />
            ) : filteredItems.length !== 0 ? (
              filteredItems.map(item => {
                console.log(item);
                let {
                  thumbnail,
                  relativeNumber,
                  number,
                  canonicalTitle,
                } = item.attributes;
                if (!thumbnail) {
                  thumbnail = posterImage;
                }
                return (
                  <AnimeContentItem
                    number={number}
                    thumbnail={thumbnail}
                    relativeNumber={relativeNumber}
                    canonicalTitle={canonicalTitle}
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
            ) : (
              <NoResults stopFiltering={stopFiltering} />
            )}
          </div>
          <RightSidebar
            coverImage={coverImage}
            posterImage={posterImage}
            status={status}
            nextRelease={nextRelease}
          />
        </div>
      </section>
    </Molecule>
  );
};

export default withRouter(Template);
