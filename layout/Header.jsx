import React, { Component } from "react";
import SimpleSchema from "simpl-schema";
import AutoForm from "uniforms-antd/AutoForm";
import AutoField from "uniforms-antd/AutoField";
import classNames from "classnames";
import axios from "axios";
import { KAPI } from "../utils";
import { Router } from "../routes";
import Link from "next/link";
import _ from "underscore";
import { detectPassiveEvents } from "../components/functions";
import { defaultImage } from "../utils/general";

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: false,
      showInput: "",
      user: false,
      loading: true
    };

    this.scrollThrottle = _.throttle(this.isScrolled, 250);
    this.passiveEvents = detectPassiveEvents();
  }
  componentDidMount() {
    const userStore = JSON.parse(localStorage.getItem("user"));
    const { user } = this.props;

    window.addEventListener(
      "scroll",
      this.scrollThrottle,
      this.passiveEvents ? { passive: true } : false
    );
    window.addEventListener(
      "resize",
      this.scrollThrottle,
      this.passiveEvents ? { passive: true } : false
    );

    !user &&
      userStore &&
      axios
        .get(KAPI + "/users?filter%5Bself%5D=true", {
          headers: {
            Authorization: "Bearer " + userStore.data.access_token
          }
        })
        .then(({ data }) => {
          this.setState({
            user: data.data[0],
            loading: false,
            isSmall: window.innerWidth < 901
          });
        })
        .catch(err => console.log(err));
  }

  componentWillUnmount() {
    window.removeEventListener(
      "scroll",
      this.scrollThrottle,
      this.passiveEvents ? { passive: true } : false
    );
    window.removeEventListener(
      "resize",
      this.scrollThrottle,
      this.passiveEvents ? { passive: true } : false
    );
  }

  isScrolled = () => {
    const { isVisible } = this.state;
    const scrolled = window.pageYOffset;

    if (scrolled > 0) {
      if (!isVisible) {
        this.setState({
          isVisible: true
        });
      }
    } else {
      if (isVisible) {
        this.setState({
          isVisible: false
        });
      }
    }
  };

  goBack = () => {
    Router.back();
  };

  goForward = () => {
    Router.back();
  };

  render() {
    let { showInput, user, isVisible, isSmall, loading } = this.state;

    const {
      isFixed,
      isFixedNoBg,
      user: loggedUser,
      showRightSideInfo,
      showRightSideBar
    } = this.props;

    const { avatar, name } = user && user.attributes;

    const img =
      !loading && avatar
        ? user.avatar.original || loggedUser.avatar.original
        : defaultImage;

    const wrapperClassNames = classNames({
      "o-header__wrap": isFixed && !isFixedNoBg,
      "o-header__wrap--main-item": isFixedNoBg,
      "o-header__wrap--no-bg": (!isVisible && isSmall) || showRightSideBar
    });

    return (
      <div className={isFixed && "o-header__main-wrapper"}>
        <div className={wrapperClassNames}>
          <div className="o-header">
            <div className="left-side" onClick={this.goBack}>
              <div className="icon">
                <i className="fa fa-angle-left" />
              </div>
              <div className="icon" onClick={this.goForward}>
                <i className="fa fa-angle-right" />
              </div>
            </div>
            <div />
            {isFixedNoBg && (
              <div className="mobile-show-more" onClick={showRightSideInfo}>
                <i
                  className={classNames(
                    "hamburger hamburger-rightsidebar far fa-heart",
                    {
                      "hamburger--hide": showRightSideBar
                    }
                  )}
                />
                <i
                  className={classNames(
                    "hamburger hamburger-rightsidebar fas fa-times",
                    {
                      "hamburger--hide": !showRightSideBar
                    }
                  )}
                />
              </div>
            )}
            <div className="right-side">
              <div className="icon">
                {!showInput ? (
                  <a href="/search" className="icon--search">
                    <i className="fa fa-search" />
                  </a>
                ) : (
                  <div className="o-search">
                    <AutoForm
                      onChange={(name, value) => console.log(name, value)}
                      schema={SearchSchema}
                      autoComplete="off"
                    >
                      <AutoField name="string" placeholder="Search" />
                    </AutoForm>
                  </div>
                )}
              </div>
              <div className="user-profile">
                {user || loggedUser ? (
                  <div
                    className="user-profile--img"
                    style={{ backgroundImage: `url('${img}')` }}
                  />
                ) : (
                  <div className="user-profile__header-links">
                    <Link href="/login">
                      <a>Login</a>
                    </Link>
                    <Link href="/login">
                      <a>Register</a>
                    </Link>
                  </div>
                )}
                <div className="user-profile--username">
                  {(user && name) || (loggedUser && loggedUser.attributes.name)}
                </div>
              </div>
              {!!user ||
                (!!loggedUser && (
                  <div className="icon options">
                    <i className="fa fa-ellipsis-v" />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const SearchSchema = new SimpleSchema({
  string: {
    type: String,
    optional: true
  }
});

export default Header;
