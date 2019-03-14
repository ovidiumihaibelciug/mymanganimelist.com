import React, { Component } from "react";
import Header from "../../layout/Header";
import MangaItem from "../../components/Dashboard/MangaItem";
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import { Molecule } from "react-molecule";
import {
  EasyList,
  EasyLoaderAgent,
  EasyLoadMore,
  EasyLoadMoreAgent
} from "easify";
import AppWrapper from "../../components/AppWrapper";

const types = [
  {
    type: "trending",
    url: "https://kitsu.io/api/edge/trending/manga?limit=20",
    text: "Trending"
  },
  {
    type: "top-airing",
    url:
      "https://kitsu.io/api/edge/manga?filter%5Bstatus%5D=current&sort=-userCount",
    params: {
      "filter[status]": "current",
      sort: "-userCount"
    },
    text: "Top Airing"
  },
  {
    type: "top-upcoming",
    url:
      "https://kitsu.io/api/edge/manga?filter%5Bstatus%5D=upcoming&sort=-userCount",
    params: {
      "filter%5Bstatus%5D": "upcoming",
      sort: "-userCount"
    },
    text: "Top Upcoming"
  },
  {
    type: "highest-rated",
    url: "https://kitsu.io/api/edge/manga?sort=-averageRating",
    params: {
      sort: "-averageRating"
    },
    text: "Highest Rated"
  },
  {
    type: "most-popular",
    url: "https://kitsu.io/api/edge/manga?sort=-userCount",
    params: {
      sort: "-userCount"
    },
    text: "Most Popular"
  }
];

async function load({ filters, options }, { type }) {
  const activeType = types.find(item => item.type === type);
  const { url, params } = activeType;

  return axios
    .get(
      url,
      type !== "trending" && {
        params: {
          "page[limit]": options.limit,
          "page[offset]": options.skip,
          ...params
        }
      }
    )
    .then(({ data }) => {
      return data.data;
    })
    .catch(err => console.log(err));
}

export default class MangaListType extends Component {
  static async getInitialProps({ query: { type } }) {
    const initProps = await load(
      { filters: {}, options: { limit: 20, skip: 0 } },
      { type }
    );

    return { ...initProps, type };
  }

  state = {
    activeType: "",
    anime: [],
    loading: true
  };

  count = filters => {
    const { type } = this.props;
    const activeType = types.find(item => item.type === type);
    const { url } = activeType;

    return axios
      .get(url, {
        params: {
          "page[limit]": 20,
          "page[offset]": 1,
          sort: "-userCount"
        }
      })
      .then(({ data }) => {
        return 1000;
      })
      .catch(err => console.log(err));
  };

  render() {
    const { type } = this.props;
    const activeType = types.find(item => item.type === type);

    return (
      <AppWrapper
        title={activeType.text + " Anime - MyMangAnimeList"}
        description={`Explore ${activeType.text} manga. Read ${
          activeType.text
        } manga chapters. Search ${activeType.text} manga characters. Read ${
          activeType.text
        } manga chapters online for free`}
        keywords={"anime,manga" + activeType.text + " anime"}
      >
        <section className="o-main-layout">
          <Sidebar />;
          <section className="o-main o-dashboard">
            <Header />
            <div className="main-content anime-view anime-container anime-episodes items">
              <Molecule
                agents={{
                  loader: EasyLoaderAgent.factory({
                    load: ({ filters, options }) =>
                      load({ filters, options }, { type })
                  }),
                  loadMore: EasyLoadMoreAgent.factory({
                    count: this.count,
                    initialItemsCount: 20,
                    loadItemsCount: 20
                  })
                }}
              >
                <EasyList>
                  {({ data }) => {
                    return data.map(item => {
                      return <MangaItem item={item} />;
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
      </AppWrapper>
    );
  }
}
