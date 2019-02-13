import React, { Component } from "react";
import Header from "../layout/Header";
import AnimeItem from "../components/Dashboard/AnimeItem";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import Loading from "../components/Loading";

import { KAPI } from "../utils";
import ItemsRow from "../components/Dashboard/ItemsRow";
import AppWrapper from "../components/AppWrapper";

export default class Dashboard extends Component {
  state = {
    trendingAnimes: [],
    topAiring: [],
    topUpcomingAnimes: [],
    highestRatedAnimes: [],
    mostPopularAnimes: [],
    loading: true
  };

  componentDidMount() {
    axios
      .all([
        axios.get(KAPI + "/trending/anime", {
          params: {
            include: "anime.categories"
          }
        }),
        axios.get(
          "https://kitsu.io/api/edge/anime?filter%5Bstatus%5D=current&page%5Blimit%5D=10&sort=-user_count"
        ),
        axios.get(
          "https://kitsu.io/api/edge/anime?filter%5Bstatus%5D=upcoming&page%5Blimit%5D=10&sort=-user_count"
        ),
        axios.get(
          "https://kitsu.io/api/edge/anime?page%5Blimit%5D=10&sort=-average_rating"
        ),
        axios.get(
          "https://kitsu.io/api/edge/anime?page%5Blimit%5D=10&sort=-user_count"
        )
      ])
      .then(
        ([
          trendingAnimes,
          topAiring,
          topUpcomingAnimes,
          highestRatedAnimes,
          mostPopularAnimes
        ]) => {
          this.setState({
            trendingAnimes: trendingAnimes.data.data,
            topAiring: topAiring.data.data,
            topUpcomingAnimes: topUpcomingAnimes.data.data,
            highestRatedAnimes: highestRatedAnimes.data.data,
            mostPopularAnimes: mostPopularAnimes.data.data,
            loading: false
          });
        }
      )
      .catch(err => console.log(err));
  }

  render() {
    const {
      trendingAnimes,
      topUpcomingAnimes,
      topAiring,
      highestRatedAnimes,
      mostPopularAnimes,
      loading
    } = this.state;
    if (loading) return <Loading />;

    const content = [
      {
        title: "Trending Animes",
        items: trendingAnimes,
        url: "/anime/list/trending"
      },
      {
        title: "Top Airing anime",
        items: topAiring,
        url: "/anime/list/top-airing"
      },
      {
        title: "Top upcoming anime",
        items: topUpcomingAnimes,
        url: "/anime/list/top-upcoming"
      },
      {
        title: "Highest rated anime",
        items: highestRatedAnimes,
        url: "/anime/list/highest-rated"
      },
      {
        title: "Most popular anime",
        items: mostPopularAnimes,
        url: "/anime/list/most-popular"
      }
    ];

    return (
      <AppWrapper title={"Dashboard"}>
        <section className="o-main-layout">
          <Sidebar />
          <section className="o-main o-dashboard">
            <Header isFixed />
            <div className="main-content">
              {content.map((contentItem, id) => {
                const { title, url, items } = contentItem;
                return (
                  <ItemsRow id={id} title={title} url={url}>
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
