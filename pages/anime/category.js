import React, { Component } from "react";
import Header from "../../layout/Header";
import AnimeItem from "../../components/Dashboard/AnimeItem";
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import Loading from "../../components/Loading";
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
  const { id } = returnedObj.categoryData;
  await axios
    .all([
      axios.get(
        `https://kitsu.io/api/edge/anime?filter%5Bstatus%5D=current&filter%5Bcategories%5D=${category}&page%5Blimit%5D=15&sort=-start_date`
      ),
      axios.get(
        `https://kitsu.io/api/edge/trending/anime?limit=15&in_category=true&category=${id}`
      ),
      axios.get(
        `https://kitsu.io/api/edge/anime?filter%5Bcategories%5D=${category}&page%5Blimit%5D=15&sort=-user_count`
      )
    ])
    .then(([newlyReleased, trendingAnime, mostPopularAnimes]) => {
      returnedObj = {
        ...returnedObj,
        trendingAnimes: trendingAnime.data.data,
        newlyReleased: newlyReleased.data.data,
        mostPopularAnimes: mostPopularAnimes.data.data,
        loading: false
      };
    })
    .catch(err => console.log(err));

  return returnedObj;
}

class AnimeByCategory extends Component {
  static async getInitialProps({ query: { category } }) {
    const initProps = await getData({ category });
    console.log("123", initProps);
    return { ...initProps, category };
  }

  render() {
    const {
      trendingAnimes,
      mostPopularAnimes,
      newlyReleased,
      categoryData,
      loading
    } = this.props;

    if (loading) return <Loading />;

    const content = [
      {
        title: `Newly Released ${categoryData.attributes.title} Anime`,
        items: newlyReleased
      },
      {
        title: `Trending ${categoryData.attributes.title} Anime`,
        items: trendingAnimes
      },
      {
        title: `Most popular ${categoryData.attributes.title} Anime`,
        items: mostPopularAnimes
      }
    ];

    return (
      <AppWrapper
        title={categoryData.attributes.title + " Anime - MyMangAnimeList"}
        description={`Explore newly released ${categoryData.attributes.title.toLowerCase()} anime,  trending ${categoryData.attributes.title.toLowerCase()} anime, most popular newly released ${categoryData.attributes.title.toLowerCase()} anime, Watch online ${categoryData.attributes.title.toLowerCase()} anime,`}
        keywords={
          "anime," +
          categoryData.attributes.title.toLowerCase() +
          ",watch" +
          categoryData.attributes.title.toLowerCase() +
          " anime"
        }
      >
        <section className="o-main-layout">
          <Sidebar />
          <section className="o-main o-dashboard">
            <Header isFixed />
            <div className="main-content">
              {content.map((contentItem, id) => {
                const { title, items = [] } = contentItem;
                if (!items.length) return null;
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
      </AppWrapper>
    );
  }
}

export default AnimeByCategory;
