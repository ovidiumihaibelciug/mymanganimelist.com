import React, { Component } from "react";
import AnimeItem from "../Dashboard/AnimeItem";
import AnimeContentCharacter from "../Anime/AnimeContentCharacter";
import classNames from "classnames";

class FavoriteItems extends Component {
  state = {
    activeItem: 1
  };

  render() {
    const { activeItem } = this.state;
    const { anime, manga, characters } = this.props;

    const items = [
      {
        id: 1,
        title: "Anime",
        items: anime
      },
      {
        id: 2,
        title: "Manga",
        items: manga
      },
      {
        id: 3,
        title: "Characters",
        items: characters
      }
    ];

    const { items: activeItems } = items.find(item => item.id === activeItem);

    return (
      <>
        <div className="o-favorite-items__navbar">
          <h2 className="o-favorite-items__navbar__title">Favorites</h2>
          <div className="o-favorite-items__navbar__items">
            {items.map(item => (
              <div
                className={classNames("o-favorite-items__navbar__items__item", {
                  "o-favorite-items__navbar__items__item--active":
                    activeItem === item.id
                })}
                onClick={() => this.setState({ activeItem: item.id })}
              >
                {item.title}
              </div>
            ))}
          </div>
        </div>
        <div className="o-favorite-items__row items">
          {activeItems.length ? (
            activeItems.map(item => {
              let { image = "", name = "", slug = "" } = item.item.attributes;
              return activeItem !== 3 ? (
                <div className="o-favorite-items__anime__item">
                  <AnimeItem item={item.item} />
                </div>
              ) : (
                <div className="o-favorite-items__anime__item">
                  <AnimeContentCharacter
                    url={`/characters/view/${slug}`}
                    bgImage={image.original}
                    name={name}
                  />
                </div>
              );
            })
          ) : (
            <div className="o-favorite-items__noresult">No favorites yet.</div>
          )}
        </div>
      </>
    );
  }
}

export default FavoriteItems;
