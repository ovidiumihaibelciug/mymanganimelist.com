import React, { Component } from 'react';
import Header from '../../layout/Header';
import AnimeItem from '../../components/Dashboard/AnimeItem';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import Loading from '../../components/Loading';

import { KAPI } from '../../utils';
import ItemsRow from '../../components/Dashboard/ItemsRow';

export default class AnimeByCategory extends Component {
  state = {
    trendingAnimes: [],
    topAiring: [],
    topUpcomingAnimes: [],
    highestRatedAnimes: [],
    mostPopularAnimes: [],
    category: '',
    loading: true,
  };

  componentDidMount() {
    this.getData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ loading: true });
    this.getData(nextProps);
  }

  getData = props => {
    const { category } = props.match.params;
    axios
      .get('https://kitsu.io/api/edge/categories/', {
        params: {
          'filter[slug]': category,
        },
      })
      .then(({ data }) => {
        this.setState({ category: data.data[0] });
        axios
          .all([
            axios.get(
              `https://kitsu.io/api/edge/anime?filter%5Bstatus%5D=current&filter%5Bcategories%5D=${category}&page%5Blimit%5D=15&sort=-start_date`,
            ),
            axios.get(
              `https://kitsu.io/api/edge/trending/anime?limit=15&in_category=true&category=${
                data.data[0].id
              }`,
            ),
            axios.get(
              `https://kitsu.io/api/edge/anime?filter%5Bcategories%5D=${category}&page%5Blimit%5D=15&sort=-user_count`,
            ),
          ])
          .then(([newlyReleased, trendingAnime, mostPopularAnimes]) => {
            this.setState({
              trendingAnimes: trendingAnime.data.data,
              newlyReleased: newlyReleased.data.data,
              mostPopularAnimes: mostPopularAnimes.data.data,
              loading: false,
            });
          })

          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  };

  render() {
    const {
      trendingAnimes,
      mostPopularAnimes,
      newlyReleased,
      category,
      loading,
    } = this.state;
    if (loading) return <Loading />;

    const content = [
      {
        title: `Newly Released ${category.attributes.title} Anime`,
        items: newlyReleased,
      },
      {
        title: `Trending ${category.attributes.title} Anime`,
        items: trendingAnimes,
      },
      {
        title: `Most popular ${category.attributes.title} Anime`,
        items: mostPopularAnimes,
      },
    ];

    return (
      <section className="o-main-layout">
        <Sidebar />
        <section className="o-main o-dashboard">
          <Header isFixed />
          <div className="main-content">
            {content.map((contentItem, id) => {
              const { title, items } = contentItem;
              return (
                <ItemsRow id={id} title={title}>
                  {items.map(anime => (
                    <AnimeItem item={anime} />
                  ))}
                </ItemsRow>
              );
            })}
          </div>
        </section>
      </section>
    );
  }
}
