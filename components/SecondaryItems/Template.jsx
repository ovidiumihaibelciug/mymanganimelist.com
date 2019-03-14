import React, { Component } from "react";
import { withRouter } from "react-router";
import Sidebar from "../../components/Sidebar";
import Header from "../../layout/Header";
import { Molecule } from "react-molecule";
import { EasyLoaderAgent, EasyLoadMoreAgent } from "easify";
import RightSidebar from "../../components/RightSidebar";
import SecondaryFilters from "../../components/Filters/Secondary/SecondaryFilters";
import AnimeContentItem from "../../components/Anime/AnimeContentItem";
import SecondaryItemsList from "../../components/SecondaryItems/SecondaryItemsList";
import NoResults from "../../components/SecondaryItems/NoResults";

class Template extends Component {
  state = {
    showRightSideBar: false
  };

  showRightSideInfo = () => {
    this.setState(state => {
      const { showRightSideBar } = state;

      return {
        showRightSideBar: !showRightSideBar
      };
    });
  };

  render() {
    const {
      functions: { load, count, onSubmit, toggleFilters, stopFiltering },
      data,
      schema,
      match,
      itemType = "episodes",
      isAnime = true,
      slug,
      pageTitle,
      pageDescription
    } = this.props;

    const { showRightSideBar } = this.state;

    let { anime, isFiltering = false, filteredItems = [], search } = data;
    const { attributes } = anime;
    const { coverImage, posterImage, status, nextRelease } = attributes;
    return (
      <div>
        <Molecule
          agents={{
            loader: EasyLoaderAgent.factory({ load: load }),
            loadMore: EasyLoadMoreAgent.factory({
              count: count,
              initialItemsCount: 10,
              loadItemsCount: 20
            })
          }}
        >
          <section className="anime-view o-main-layout anime-episodes">
            <Sidebar small />
            <div className="o-main o-anime-view">
              <Header
                isFixedNoBg
                showRightSideInfo={this.showRightSideInfo}
                showRightSideBar={showRightSideBar}
              />
              <div className="anime-container">
                {pageTitle && (
                  <div className="characters__text characters__text--no-border">
                    <h1 className="characters__text__title">{pageTitle}</h1>
                    <h2 className="characters__text__description">
                      {pageDescription}
                    </h2>
                  </div>
                )}
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
                    let {
                      thumbnail,
                      relativeNumber,
                      number,
                      canonicalTitle
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
                          `/${isAnime ? "anime" : "manga"}/` +
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
                showRightSideBar={showRightSideBar}
              />
            </div>
          </section>
        </Molecule>
      </div>
    );
  }
}

export default Template;
