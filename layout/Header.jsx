import React, { Component } from "react";
import SimpleSchema from "simpl-schema";
import AutoForm from "uniforms-antd/AutoForm";
import AutoField from "uniforms-antd/AutoField";
import classNames from "classnames";
import axios from "axios";
import { KAPI } from "../utils";
import { Router } from "../routes";
import Link from "next/link";

class Header extends Component {
  state = {
    showInput: "",
    user: false,
    loading: true
  };

  componentDidMount() {
    const userStore = JSON.parse(localStorage.getItem("user"));
    const { user } = this.props;

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
            loading: false
          });
        })
        .catch(err => console.log(err));
  }

  goBack = () => {
    Router.back();
  };

  goForward = () => {
    window.history.forward();
  };

  render() {
    let { showInput, user, loading } = this.state;

    const { isFixed, isFixedNoBg, user: loggedUser } = this.props;
    const { avatar, name } = user && user.attributes;
    const img =
      !loading && avatar
        ? user.avatar.original || loggedUser.avatar.original
        : "https://i.ytimg.com/vi/qwzQPh7dW_4/maxresdefault.jpg";

    const wrapperClassNames = classNames({
      "o-header__wrap": isFixed && !isFixedNoBg,
      "o-header__wrap--main-item": isFixedNoBg
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
            <div className="right-side">
              <div className="icon">
                {!showInput ? (
                  <i
                    className="fa fa-search"
                    onClick={() => {
                      Router.push("/search");
                    }}
                  />
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
