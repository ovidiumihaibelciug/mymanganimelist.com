import React, { Component } from "react";
import SimpleSchema from "simpl-schema";
import AutoForm from "uniforms-antd/AutoForm";
import AutoField from "uniforms-antd/AutoField";
import classNames from "classnames";
import axios from "axios";
import { KAPI } from "../utils";
import { Router } from "../routes";

class Header extends Component {
  state = {
    showInput: "",
    user: {},
    loading: true
  };

  componentDidMount() {
    const userStore = JSON.parse(localStorage.getItem("user"));
    const { profileId } = this.props;

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
    const { showInput, user, isFollowing, loading } = this.state;

    const { isFixed } = this.props;
    const { avatar, name } = !loading && user.attributes;
    const img =
      !loading && avatar
        ? user.avatar.original
        : "https://i.ytimg.com/vi/qwzQPh7dW_4/maxresdefault.jpg";

    return (
      <div className={isFixed && "o-header__main-wrapper"}>
        <div className={isFixed && "o-header__wrap"}>
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
                      const { history } = this.props;
                      history.push("/search");

                      this.setState({ showInput: true });
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
                {!loading && (
                  <div
                    className="user-profile--img"
                    style={{ backgroundImage: `url('${img}')` }}
                  />
                )}
                <div className="user-profile--username">{!loading && name}</div>
              </div>
              <div className="icon options">
                <i className="fa fa-ellipsis-v" />
              </div>
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
