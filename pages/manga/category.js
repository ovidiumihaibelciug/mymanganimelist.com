import React, { Component } from "react";
import Header from "../../layout/Header";
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import Loading from "../../components/Loading";
import MangaItem from "../../components/Dashboard/MangaItem";
import ItemsRow from "../../components/Dashboard/ItemsRow";
import AppWrapper from "../../components/AppWrapper";

async function getData({ category }) {
  let returnedObj = {};
  await axios
    .get("https://kitsu.io/api/edge/categories/", {
      params: {
        "filter[slug]": category
      }
    })
    .then(({ data }) => {
      returnedObj = { ...returnedObj, categoryData: data.data[0] };
    })
    .catch(err => console.log(err));
  await axios
    .all([
      axios.get(
        `https://kitsu.io/api/edge/manga?filter%5Bstatus%5D=current&filter%5Bcategories%5D=${category}&page%5Blimit%5D=15&sort=-start_date`
      ),
      axios.get(
        `https://kitsu.io/api/edge/trending/manga?limit=15&in_category=true&category=${
          returnedObj.categoryData.id
        }`
      ),
      axios.get(
        `https://kitsu.io/api/edge/manga?filter%5Bcategories%5D=${category}&page%5Blimit%5D=15&sort=-user_count`
      )
    ])
    .then(([newlyReleased, trendingAnime, mostPopularAnimes]) => {
      returnedObj = {
        ...returnedObj,
        trendingAnimes: trendingAnime.data.data,
        newlyReleased: newlyReleased.data.data,
        mostPopularAnimes: mostPopularAnimes.data.data
      };
    })
    .catch(err => console.log(err));

  return returnedObj;
}

class AnimeByCategory extends Component {
  static async getInitialProps({ query: { category } }) {
    const initProps = await getData({ category });

    return { ...initProps, category };
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
      categoryData,
      loading
    } = this.props;

    const content = [
      {
        title: `Newly Released ${categoryData.attributes.title} Manga`,
        items: newlyReleased
      },
      {
        title: `Trending ${categoryData.attributes.title} Manga`,
        items: trendingAnimes
      },
      {
        title: `Most popular ${categoryData.attributes.title} Manga`,
        items: mostPopularAnimes
      }
    ];

    return (
      <AppWrapper
        title={categoryData.attributes.title + " Manga - MyMangAnimeList"}
        description={`Explore newly released ${categoryData.attributes.title.toLowerCase()} manga,  trending ${categoryData.attributes.title.toLowerCase()} manga, most popular newly released ${categoryData.attributes.title.toLowerCase()} manga, Watch online ${categoryData.attributes.title.toLowerCase()} manga,`}
        keywords={
          "anime," +
          categoryData.attributes.title.toLowerCase() +
          ",watch" +
          categoryData.attributes.title.toLowerCase() +
          " anime"
        }
      >
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
export default AnimeByCategory;
