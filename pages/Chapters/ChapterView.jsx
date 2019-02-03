import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { KAPI } from '../../utils';
import Sidebar from '../../components/Sidebar';
import Header from '../../layout/Header';
import Loading from '../../components/Loading';
import { Icon } from 'antd';
import RightSidebar from '../../components/RightSidebar';

export class EpisodeView extends Component {
  state = {
    anime: {},
    loading: true,
  };

  componentDidMount() {
    const { slug, number } = this.props.match.params;

    axios
      .get(KAPI + '/manga', {
        params: {
          'filter[slug]': slug,
        },
      })
      .then(({ data }) => {
        console.log('EPISODEEE', data);
        const { id } = data.data[0];
        this.setState({
          anime: data.data[0],
        });
        axios
          .get(KAPI + '/chapters', {
            params: {
              'filter[mangaId]': id,
              'filter[number]': number,
            },
          })
          .then(({ data }) => {
            console.log('a', data);
            this.setState({
              episode: data.data[0].attributes,
              loading: false,
            });
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  render() {
    const { anime, episode, loading } = this.state;
    if (loading) {
      return <Loading />;
    }
    console.log('Only episode', episode);

    const { coverImage, posterImage } = anime.attributes;
    const { thumbnail, canonicalTitle, synopsis, airdate, length } = episode;
    return (
      <Fragment>
        <section className="anime-view o-main-layout">
          <Sidebar small={true} />
          <div
            className="o-main o-anime-view o-episode-view"
            style={{
              backgroundImage: `linear-gradient(15deg,rgba(20, 28, 36, 1) 10%, rgba(30, 34, 38, 0.99) 40%,  rgba(30, 34, 38, 0.95) 100%) , url(${
                thumbnail
                  ? thumbnail.original
                    ? thumbnail.original
                    : coverImage.original
                  : coverImage.original
              })`,
            }}
          >
            <Header />
            <div className="anime episode">
              <div className="anime-container episode-container">
                <div className="episode-row">
                  <div
                    className="leftside"
                    style={{
                      backgroundImage: `url("${
                        thumbnail
                          ? thumbnail.original
                            ? thumbnail.original
                            : coverImage.original
                          : coverImage.original
                      }")`,
                    }}
                  />
                  <div className="rightside">
                    <div className="title">{canonicalTitle}</div>
                    <div className="description">{synopsis}</div>
                    <div className="date">
                      <Icon type="clock-circle" theme="outlined" />
                      &nbsp;&nbsp;
                      {length} minutes
                    </div>
                    <div className="date">
                      <Icon type="calendar" theme="outlined" />
                      &nbsp;&nbsp;
                      {airdate}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <RightSidebar
              coverImage={posterImage ? posterImage : thumbnail}
              posterImage={posterImage ? posterImage : thumbnail}
              status={status}
            />
          </div>
        </section>
      </Fragment>
    );
  }
}

export default EpisodeView;
