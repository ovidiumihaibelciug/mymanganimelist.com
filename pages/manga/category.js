import React, { Component } from "react";
import Header from "../../layout/Header";
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import Loading from "../../components/Loading";
import MangaItem from "../../components/Dashboard/MangaItem";
import ItemsRow from "../../components/Dashboard/ItemsRow";
import AppWrapper from "../../components/AppWrapper";

export default class AnimeByCategory extends Component {
  static getInitialProps({ query: { category } }) {
    return { category };
  }

  state = {
    trendingAnimes: [],
    topAiring: [],
    topUpcomingAnimes: [],
    highestRatedAnimes: [],
    mostPopularAnimes: [],
    category: "",
    loading: true
  };

  componentDidMount() {
    this.getData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ loading: true });
    this.getData(nextProps);
  }

  getData = props => {
    const { category } = props;
    axios
      .get("https://kitsu.io/api/edge/categories/", {
        params: {
          "filter[slug]": category
        }
      })
      .then(({ data }) => {
        this.setState({ category: data.data[0] });
        axios
          .all([
            axios.get(
              `https://kitsu.io/api/edge/manga?filter%5Bstatus%5D=current&filter%5Bcategories%5D=${category}&page%5Blimit%5D=15&sort=-start_date`
            ),
            axios.get(
              `https://kitsu.io/api/edge/trending/manga?limit=15&in_category=true&category=${
                data.data[0].id
              }`
            ),
            axios.get(
              `https://kitsu.io/api/edge/manga?filter%5Bcategories%5D=${category}&page%5Blimit%5D=15&sort=-user_count`
            )
          ])
          .then(([newlyReleased, trendingAnime, mostPopularAnimes]) => {
            this.setState({
              trendingAnimes: trendingAnime.data.data,
              newlyReleased: newlyReleased.data.data,
              mostPopularAnimes: mostPopularAnimes.data.data,
              loading: false
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
      loading
    } = this.state;
    if (loading) return <Loading />;

    const content = [
      {
        title: `Newly Released ${category.attributes.title} Manga`,
        items: newlyReleased
      },
      {
        title: `Trending ${category.attributes.title} Manga`,
        items: trendingAnimes
      },
      {
        title: `Most popular ${category.attributes.title} Manga`,
        items: mostPopularAnimes
      }
    ];

    return (
      <AppWrapper title="123">
        <section className="o-main-layout">
          <Sidebar isManga />
          <section className="o-main o-dashboard">
            <Header isFixed />
            <div className="main-content">
              {content.map((contentItem, id) => {
                const { title, items } = contentItem;
                return (
                  <ItemsRow id={id} title={title}>
                    {items.map(anime => (
                      <MangaItem item={anime} />
                    ))}
                  </ItemsRow>
                );
              })}
            </div>
          </section>
        </section>
      </AppWrapper>
    );
  }
}
