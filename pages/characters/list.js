import React, { Component } from "react";
import Header from "../../layout/Header";
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import Loading from "../../components/Loading";
import { Molecule } from "react-molecule";
import {
  EasyList,
  EasyLoaderAgent,
  EasyLoadMore,
  EasyLoadMoreAgent
} from "easify";
import AnimeContentCharacter from "../../components/Anime/AnimeContentCharacter";
import AppWrapper from "../../components/AppWrapper";
import { seoData } from "../../seoData";

async function load({ filters, options }) {
  return axios
    .get("https://kitsu.io/api/edge/characters", {
      params: {
        "page[limit]": options.limit,
        "page[offset]": options.skip
      }
    })
    .then(({ data }) => {
      return data.data;
    })
    .catch(err => console.log(err));
}

export default class CharacterList extends Component {
  static async getInitialProps(req) {
    const initProps = await load({ filters: "", options: "" });

    return {
      ...initProps
    };
  }

  state = {
    characters: [],
    loading: true
  };

  load = ({ filters, options }) => {
    return axios
      .get("https://kitsu.io/api/edge/characters", {
        params: {
          "page[limit]": options.limit,
          "page[offset]": options.skip
        }
      })
      .then(({ data }) => {
        this.setState({
          loading: false
        });
        return data.data;
      })
      .catch(err => console.log(err));
  };

  count = () => {
    return axios
      .get("https://kitsu.io/api/edge/characters", {
        params: {
          "page[limit]": 10,
          "page[offset]": 1
        }
      })
      .then(({ data }) => {
        return 1000;
      })
      .catch(err => console.log(err));
  };

  render() {
    const { loading } = this.props;
    if (loading) return <Loading />;
    return (
      <AppWrapper {...seoData.characters}>
        <section className="o-main-layout">
          <Sidebar />
          <section className="o-main o-dashboard">
            <Header isFixed />
            <div className="main-content anime-view anime-container anime-episodes characters-list">
              <div className="characters__text">
                <h1 className="characters__text__title">
                  Manga & Anime Characters
                </h1>
                <h2 className="characters__text__description">
                  Discover new characters from your favorite Manga or Anime.
                  Explore new manga and anime characters or popular ones from
                  Dragon Ball Super, Attack on Titan, Naruto Shippuden, My Hero
                  Academia, One Piece characters and more.
                </h2>
              </div>
              <Molecule
                agents={{
                  loader: EasyLoaderAgent.factory({ load }),
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
                      let { image = "", name, slug } = item.attributes;
                      return (
                        <AnimeContentCharacter
                          url={`/characters/view/${slug}`}
                          bgImage={image ? image.original : posterImage}
                          name={name}
                        />
                      );
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
