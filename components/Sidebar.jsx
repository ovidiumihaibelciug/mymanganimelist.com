import React, { Component } from "react";
import Link from "next/link";
import classNames from "classnames";
import axios from "axios";
import Logo from "../components/svg/imgs/Logo";

class Sidebar extends Component {
  state = {
    categories: [],
    showSidebar: false,
    loading: true
  };

  componentDidMount() {
    axios
      .get(
        "https://kitsu.io/api/edge/categories?page%5Blimit%5D=10&sort=-total_media_count"
      )
      .then(({ data: { data: categories } }) => {
        const {small} = this.props;
        this.setState({ categories, isSmall: (window.innerWidth < 901 || small),loading: false });
      })
      .catch(err => console.log(err));
  }

  toggleSidebar = () => {
    this.setState(state => {
      const { showSidebar } = state;
      return {
        showSidebar: !showSidebar

      };
    });
  };

  render() {
    const { small, isManga } = this.props;
    const { categories, showSidebar, isSmall, loading } = this.state;

    const classes = classNames("o-sidebar", {
      "o-sidebar__hide": !showSidebar && isSmall
    });

    const hamburgerClasses = classNames({
      "hamburger fa fa-bars": !showSidebar,
      "hamburger fas fa-times": showSidebar
    });

    const toggleSideBarClasses = classNames("toggle-sidebar", {
      hide: !small
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
          <Logo className="o-sidebar__brand" />
          <div className="o-sidebar__main">
            <div className="o-sidebar__main__title">Browse</div>
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
        <div onClick={this.toggleSidebar} className={toggleSideBarClasses}>
          <i
            className={classNames("hamburger fa fa-bars", {
              "hamburger--hide": showSidebar
            })}
          />
          <i
            className={classNames("hamburger hamburger--close fas fa-times", {
              "hamburger--hide": !showSidebar
            })}
          />
        </div>
      </>
    );
  }
}

export default Sidebar;
