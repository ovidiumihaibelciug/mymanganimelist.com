import React, { Component } from "react";
import Link from "next/link";
import classNames from "classnames";
import axios from "axios";

const toggleSidebar = () => {
  const sidebar = document.querySelector(".o-sidebar");
  sidebar.classList.toggle("hide");
};

class Sidebar extends Component {
  state = { categories: [], loading: true };

  componentDidMount() {
    axios
      .get(
        "https://kitsu.io/api/edge/categories?page%5Blimit%5D=10&sort=-total_media_count"
      )
      .then(({ data: { data: categories } }) => {
        this.setState({ categories, loading: false });
      })
      .catch(err => console.log(err));
  }

  render() {
    const { small, isManga } = this.props;
    const { categories, loading } = this.state;

    const classes = classNames("o-sidebar", {
      hide: small
    });

    const mainRoutes = [
      {
        to: "/",
        text: "Anime"
      },
      {
        to: "/manga",
        text: "Manga"
      },
      {
        to: "/characters",
        text: "Characters"
      },
      {
        to: "/discussions",
        text: "Discussions"
      }
    ];

    return (
      <>
        <section className={classes}>
          <div className="o-sidebar__brand">MyMangaAnimeList</div>
          <div className="o-sidebar__main">
            <div className="o-sidebar__main__title">Browse Anime</div>
            <div className="o-sidebar__main__title___content">
              {mainRoutes.map((item, id) => (
                <div
                  className="o-sidebar__main__content__item__container"
                  key={id}
                >
                  <Link
                    href={item.to}
                    activeClassName="o-sidebar__main__content__item__active"
                  >
                    <a className="o-sidebar__main__content__item">
                      {item.text}
                    </a>
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <div className="o-sidebar__sec">
            <div className="o-sidebar__sec__title">Categories</div>
            <div className="o-sidebar__sec__content">
              <div className="o-sidebar__sec__content__container">
                {!loading &&
                  categories.map(item => (
                    <div className="o-sidebar__sec__content__container">
                      <Link
                        href={`${isManga ? "/manga/" : "/anime/"}category/${
                          item.attributes.slug
                        }`}
                        activeClassName="o-sidebar__sec__content__container__item__active"
                      >
                        <a className="o-sidebar__sec__content__item">
                          {item.attributes.title}
                        </a>
                      </Link>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>
        {small && (
          <div onClick={toggleSidebar} className="toggle-sidebar">
            <i className="fa fa-bars" />
          </div>
        )}
      </>
    );
  }
}

export default Sidebar;
