import React, { Component, Fragment } from "react";
import axios from "axios";
import { KAPI } from "../../utils";
import Sidebar from "../../components/Sidebar";
import Header from "../../layout/Header";
import Loading from "../../components/Loading";
import RightSidebar from "../../components/RightSidebar";
import SecondaryContent from "../../components/Anime/SecondaryContent";
import AppWrapper from "../../components/AppWrapper";

class CharacterView extends Component {
  static getInitialProps({ query: { slug } }) {
    return { slug };
  }

  state = {
    anime: {},
    people: "",
    media: "",
    loading: true
  };

  componentDidMount() {
    const { slug } = this.props;

    axios
      .get(KAPI + "/characters", {
        params: {
          "filter[slug]": slug,
          include: "castings.person,mediaCharacters.media"
        }
      })
      .then(({ data }) => {
        let people =
          data.included && data.included.filter(item => item.type === "people");
        let media =
          data.included &&
          data.included.filter(
            item => item.type === "anime" || item.type === "manga"
          );
        this.setState({
          character: data.data[0],
          people,
          media,
          loading: false
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    const { character, people, media, loading } = this.state;
    if (loading) {
      return <Loading />;
    }
    const { slug } = this.props;
    if (!character) return null;
    const { image, canonicalName, description } =
      character && character.attributes;
    let { posterImage } = media[0].attributes;

    return (
      <AppWrapper
        title={
          canonicalName +
          " - " +
          (media[0] &&
            (media[0].attributes.titles.en ||
              media[0].attributes.titles.en_jp)) +
          " - MyMangAnimeList"
        }
        description={`View ${canonicalName +
          " " +
          (media[0] &&
            (media[0].attributes.titles.en ||
              media[0].attributes.titles.en_jp))} character.  ${media[0] &&
          (media[0].attributes.titles.en ||
            media[0].attributes.titles
              .en_jp)} characters. Best manga and anime characters`}
        keywords={canonicalName + "anime, manga, manganime, mymanganimelist"}
      >
        <section className="anime-view o-main-layout character-view">
          <Sidebar small={true} />
          <div
            className="o-main o-anime-view o-episode-view"
            style={{
              backgroundImage: `linear-gradient(15deg,rgba(20, 28, 36, 1) 10%, rgba(30, 34, 38, 0.99) 40%,  rgba(30, 34, 38, 0.95) 100%) , url(${
                posterImage ? posterImage.original : image.original
              })`
            }}
          >
            <Header isFixedNoBg />
            <div className="anime">
              <div className="anime-container episode-container">
                <div className="secondary-item">
                  <div
                    className="secondary-item__leftside"
                    style={{ backgroundImage: `url("${image.original}")` }}
                  />
                  <div className="secondary-item__rightside">
                    <h1 className="secondary-item__rightside__title">
                      {canonicalName}
                    </h1>
                    <h2
                      className="secondary-item__rightside__description"
                      dangerouslySetInnerHTML={{ __html: description }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <RightSidebar
              coverImage={posterImage}
              posterImage={image}
              status={status}
              // nextRelease={nextRelease}
            />
          </div>
          <div className="secondary">
            <SecondaryContent
              data={[
                {
                  title: "Voice actors",
                  type: "actors",
                  data: people
                },
                {
                  title: "Media",
                  type: "franchise",
                  data: media
                }
              ]}
              slug={slug}
              posterImage={posterImage}
            />
          </div>
        </section>
      </AppWrapper>
    );
  }
}

export default CharacterView;
