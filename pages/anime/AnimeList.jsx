import React, { Component } from 'react';
import Header from '../../layout/Header';
import AnimeItem from '../../components/Dashboard/AnimeItem';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import Loading from '../../components/Loading';
import { Molecule, WithMolecule } from 'react-molecule';
import {
  EasyLoaderAgent,
  EasyLoadMoreAgent,
  EasyList,
  EasyPager,
  EasyLoadMore,
  EasyFilters,
} from 'easify';
import { KAPI } from '../../utils';
import AnimeContentCharacter from '../../components/Anime/AnimeContentCharacter';

export default class AnimeList extends Component {
  state = {
    activeType: '',
    anime: [],
    loading: true,
  };

  componentDidMount() {
    const types = [
      {
        type: 'trending',
        url: 'https://kitsu.io/api/edge/trending/anime?limit=20',
      },
      {
        type: 'top-airing',
        url:
          'https://kitsu.io/api/edge/anime?filter%5Bstatus%5D=current&sort=-userCount',
        params: {
          'filter[status]': 'current',
          sort: '-userCount',
        },
      },
      {
        type: 'top-upcoming',
        url:
          'https://kitsu.io/api/edge/anime?filter%5Bstatus%5D=upcoming&sort=-userCount',
        params: {
          'filter%5Bstatus%5D': 'upcoming',
          sort: '-userCount',
        },
      },
      {
        type: 'highest-rated',
        url: 'https://kitsu.io/api/edge/anime?sort=-averageRating',
        params: {
          sort: '-averageRating',
        },
      },
      {
        type: 'most-popular',
        url: 'https://kitsu.io/api/edge/anime?sort=-userCount',
        params: {
          sort: '-userCount',
        },
      },
    ];

    const { type } = this.props.match.params;

    const activeType = types.find(item => item.type === type);

    this.setState({
      loading: false,
      activeType,
    });
  }

  load = ({ filters, options }) => {
    const {
      activeType: { type, url, params },
    } = this.state;
    return axios
      .get(
        url,
        type !== 'trending' && {
          params: {
            'page[limit]': options.limit,
            'page[offset]': options.skip,
            ...params,
          },
        },
      )
      .then(({ data }) => {
        this.setState({
          loading: false,
        });
        return data.data;
      })
      .catch(err => console.log(err));
  };

  count = filters => {
    const {
      activeType: { url },
    } = this.state;
    return axios
      .get(url, {
        params: {
          'page[limit]': 20,
          'page[offset]': 1,
          sort: '-userCount',
        },
      })
      .then(({ data }) => {
        return 1000;
      })
      .catch(err => console.log(err));
  };

  render() {
    const { loading } = this.state;
    if (loading) return <Loading />;
    return (
      <section className="o-main-layout">
        <Sidebar />;
        <section className="o-main o-dashboard">
          <Header isFixed />
          <div className="main-content anime-view anime-container anime-episodes items">
            <Molecule
              agents={{
                loader: EasyLoaderAgent.factory({ load: this.load }),
                loadMore: EasyLoadMoreAgent.factory({
                  count: this.count,
                  initialItemsCount: 20,
                  loadItemsCount: 20,
                }),
              }}
            >
              <EasyList>
                {({ data }) => {
                  return data.map(item => {
                    return <AnimeItem item={item} />;
                  });
                }}
              </EasyList>
              <div className="custom-btn">
                <EasyLoadMore />
              </div>
            </Molecule>
          </div>
        </section>
      </section>
    );
  }
}
