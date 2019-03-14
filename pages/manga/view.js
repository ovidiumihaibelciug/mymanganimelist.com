import React, { Component } from "react";
import axios from "axios";
import { KAPI } from "../../utils";
import ItemView from "../../components/ItemView";
import AppWrapper from "../../components/AppWrapper";

async function getManga({ slug }) {
  let returnedObj = {};

  await axios
    .get(KAPI + "/manga", {
      params: {
        "filter[slug]": slug,
        include: "genres,categories,mediaRelationships.destination"
      }
    })
    .then(({ data }) => {
      const categories =
        data.included &&
        data.included.filter(item => item.type === "categories");
      const franchises =
        data.included &&
        data.included.filter(
          item => item.type === "manga" || item.type === "anime"
        );

      returnedObj = {
        ...returnedObj,
        anime: data.data[0],
        categories,
        franchises
      };
    })
    .catch(err => console.log(err));

  await axios
    .all([
      axios.get(KAPI + "/chapters", {
        params: {
          "filter[mangaId]": returnedObj.anime.id,
          "page[limit]": 8
        }
      }),
      axios.get(KAPI + `/manga-characters/`, {
        params: {
          "filter[mangaId]": returnedObj.anime.id,
          "page[limit]": 8,
          include: "character"
        }
      })
    ])
    .then(([chapterData = false, charactersData = false]) => {
      returnedObj = {
        ...returnedObj,
        chapters: chapterData.data.data,
        characters: charactersData.data.included
      };
    })
    .catch(err => console.log(err));
  return returnedObj;
}

export default class AnimeView extends Component {
  static async getInitialProps({ query: { slug } }) {
    const initProps = await getManga({ slug });

    return { ...initProps, slug };
  }

  getManga = props => {
    const { slug } = props;

    axios
      .get(KAPI + "/manga", {
        params: {
          "filter[slug]": slug,
          include: "genres,categories,mediaRelationships.destination"
        }
      })
      .then(({ data }) => {
        const categories =
          data.included &&
          data.included.filter(item => item.type === "categories");
        const franchises =
          data.included &&
          data.included.filter(
            item => item.type === "manga" || item.type === "anime"
          );
        this.setState({
          anime: data.data[0],
          categories,
          franchises
        });

        const userStore = JSON.parse(localStorage.getItem("user"));
        axios
          .all([
            axios.get(KAPI + "/chapters", {
              params: {
                "filter[mangaId]": data.data[0].id,
                "page[limit]": 8
              }
            }),
            axios.get(KAPI + `/manga-characters/`, {
              params: {
                "filter[mangaId]": data.data[0].id,
                "page[limit]": 8,
                include: "character"
              }
            }),
            userStore &&
              axios.get(KAPI + "/users?filter%5Bself%5D=true", {
                headers: {
                  Authorization: "Bearer " + userStore.data.access_token
                },
                params: {
                  include: "favorites.item"
                }
              })
          ])
          .then(
            ([
              chapterData = false,
              charactersData = false,
              userData = false
            ]) => {
              const user = userData
                ? {
                    ...userData.data.data[0],
                    included: userData.data.included
                  }
                : false;
              this.setState({
                chapters: chapterData.data.data,
                characters: charactersData.data.data.included,
                user,
                loading: false
              });
            }
          )
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  };

  render() {
    const { anime } = this.props;
    console.log(this.props);
    return (
      <AppWrapper
        title={`${anime.attributes.titles.en ||
          anime.attributes.titles.en_jp} Manga - MyMangAnimeList`}
        keywords={
          anime.attributes.titles.en ||
          anime.attributes.titles.en_jp + "Anime, Watch Anime"
        }
        description={`Explore ${anime.attributes.titles.en ||
          anime.attributes.titles.en_jp} news. Watch ${anime.attributes.titles
          .en || anime.attributes.titles.en_jp} online. Explore ${anime
          .attributes.titles.en ||
          anime.attributes.titles.en_jp} characters. Read ${anime.attributes
          .titles.en ||
          anime.attributes.titles
            .en_jp} chapters online. Explore related manga`}
      >
        <ItemView data={this.props} />
      </AppWrapper>
    );
  }
}
