import React, { Component } from "react";
import Header from "../layout/Header";
import ItemsRow from "../components/Dashboard/ItemsRow";
import MangaItem from "../components/Dashboard/MangaItem";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import Loading from "../components/Loading";
import { KAPI } from "../utils";
import AppWrapper from "../components/AppWrapper";

export default class Dashboard extends Component {
  state = {
    trendingManga: [],
    topPublishingManga: [],
    topUpcomingManga: [],
    highestRatedManga: [],
    mostPopularManga: [],
    loading: true
  };

  componentDidMount() {
    axios
      .all([
        axios.get(KAPI + "/trending/manga", {
          params: {
            include: "manga.categories"
          }
        }),
        axios.get(
          "https://kitsu.io/api/edge/manga?filter%5Bstatus%5D=current&page%5Blimit%10D=5&sort=-user_count"
        ),
        axios.get(
          "https://kitsu.io/api/edge/manga?filter%5Bstatus%5D=upcoming&page%5Blimit%5D=10&sort=-user_count"
        ),
        axios.get(
          "https://kitsu.io/api/edge/manga?page%5Blimit%5D=10&sort=-average_rating"
        ),
        axios.get(
          "https://kitsu.io/api/edge/manga?page%5Blimit%5D=10&sort=-user_count"
        )
      ])
      .then(
        ([
          trendingManga,
          topPublishingManga,
          topUpcomingManga,
          highestRatedManga,
          mostPopularManga
        ]) => {
          this.setState({
            trendingManga: trendingManga.data.data,
            topPublishingManga: topPublishingManga.data.data,
            topUpcomingManga: topUpcomingManga.data.data,
            highestRatedManga: highestRatedManga.data.data,
            mostPopularManga: mostPopularManga.data.data,
            loading: false
          });
        }
      )
      .catch(err => console.log(err));
  }

  render() {
    const {
      trendingManga,
      highestRatedManga,
      topPublishingManga,
      topUpcomingManga,
      mostPopularManga,
      loading
    } = this.state;
    if (loading) return <Loading />;
    const content = [
      {
        title: "Trending this week",
        items: trendingManga,
        url: "/manga/list/trending"
      },
      {
        title: "Top publishing Manga",
        items: topPublishingManga,
        url: "/manga/list/top-airing"
      },
      {
        title: "Highest rated Manga",
        items: highestRatedManga,
        url: "/manga/list/highest-rated"
      },
      {
        title: "Top upcoming Manga",
        items: topUpcomingManga,
        url: "/manga/list/top-upcoming"
      }
    ];
    return (
      <AppWrapper title="123">
        <section className="o-main-layout">
          <Sidebar isManga />
          <section className="o-main o-dashboard">
            <Header />
            <div className="main-content">
              {content.map((mangaItem, id) => {
                const { title, url, items = [] } = mangaItem;
                if (!items.length) return null;
                return (
                  <ItemsRow id={id} title={title} url={url}>
                    {items.map(manga => (
                      <MangaItem item={manga} />
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
