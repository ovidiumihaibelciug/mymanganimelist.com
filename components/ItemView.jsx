import React, { Component, Fragment } from 'react';
import Sidebar from './Sidebar';
import Header from '../layout/Header';
import ModalVideo from 'react-modal-video';
import AnimeInfo from './Anime/AnimeInfo';
import Loading from './Loading';
import RightSidebar from './RightSidebar';
import SecondaryContent from './Anime/SecondaryContent';

class ItemView extends Component {
  state = {
    isOpen: false,
  };

  openModal = () => {
    this.setState({ isOpen: true });
  };

  closeModal = () => {
    this.setState({ isOpen: false });
  };

  render() {
    const { data } = this.props;
    let {
      anime,
      loading,
      categories,
      episodes,
      characters,
      franchises,
      chapters,
      genres,
    } = data;

    console.log(episodes);
    const { isOpen } = this.state;

    if (loading) return <Loading />;

    const { attributes } = anime;
    const {
      coverImage,
      titles,
      posterImage,
      synopsis,
      popularityRank,
      ratingRank,
      averageRating,
      status,
      episodeCount,
      nextRelease,
      youtubeVideoId,
    } = attributes;

    const { slug } = this.props;
    const starCount = Math.round((averageRating * 5) / 100);
    return (
      <div>
        <ModalVideo
          channel="youtube"
          isOpen={isOpen}
          videoId={youtubeVideoId}
          onClose={() => this.setState({ isOpen: false })}
        />
        <section className="anime-view o-main-layout">
          <Sidebar small={true} />
          <div
            className="o-main o-anime-view"
            style={{
              backgroundImage: `linear-gradient(15deg,rgba(20, 28, 36, 1) 10%, rgba(30, 34, 38, 0.99) 40%,  rgba(30, 34, 38, 0.95) 100%) , url(${
                coverImage.original
              })`,
            }}
          >
            <Header />
            <AnimeInfo
              starCount={starCount}
              titles={titles}
              synopsis={synopsis}
              averageRating={averageRating}
              popularityRank={popularityRank}
              ratingRank={ratingRank}
              categories={categories}
              type={anime.type}
              openModal={this.openModal}
            />
            <RightSidebar
              coverImage={coverImage}
              posterImage={posterImage}
              status={status}
              nextRelease={nextRelease}
            />
          </div>
          <div className="secondary">
            <SecondaryContent
              data={[
                {
                  title: 'Episodes',
                  type: 'episodes',
                  data: episodes,
                },
                {
                  title: 'Chapters',
                  type: 'chapters',
                  data: chapters,
                },
                {
                  title: 'Characters',
                  type: 'characters',
                  data: characters,
                },
                {
                  title: 'Franchises',
                  type: 'franchise',
                  data: franchises,
                },
              ]}
              slug={slug}
              posterImage={posterImage}
            />
          </div>
        </section>
      </div>
    );
  }
}

export default ItemView;
