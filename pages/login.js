import React from "react";
import Link from "next/link";
import SimpleSchema from "simpl-schema";
import AutoField from "uniforms-antd/AutoField";
import AutoForm from "uniforms-antd/AutoForm";
import ErrorField from "uniforms-antd/ErrorField";
import Button from "antd/lib/button";
import axios from "axios";
import { loadState, saveState } from "../utils/localStorage";
import AppWrapper from "../components/AppWrapper";
import LoginDefault from "../components/svg/imgs/LoginDefault";
import { Router } from "../routes";
import { seoData } from "../seoData";

class Login extends React.Component {
  state = {
    errors: false
  };

  componentDidMount() {
    const userStore = JSON.parse(localStorage.getItem("user"));

    if (userStore) {
      Router.push("/");
    }
  }

  onSubmit = data => {
    const { email, password } = data;
    axios
      .post(
        `https://kitsu.io/api/oauth/token?grant_type=password&username=${email}&password=${password}`
      )
      .then(result => {
        saveState(result);
        Router.push("/");
      })
      .catch(() => {
        this.setState({
          errors: true
        });
      });
  };

  render() {
    const { errors } = this.state;
    return (
      <AppWrapper {...seoData.login}>
        <div className="o-login">
          <div className="o-login__form">
            <h1 className="o-login__form__title">
              Connect to <span className="o-is-primary">MyManganimeList</span>{" "}
              with your <a href="kitsu.io ">kitsu.io </a> account
            </h1>
            <AutoForm
              schema={LoginSchema}
              onSubmit={this.onSubmit}
              className="o-login__form__inputs"
            >
              <AutoField
                className="o-login__form__input"
                name="email"
                placeholder="Email"
                label={false}
              />
              <AutoField
                className="o-login__form__input"
                name="password"
                placeholder="Password"
                label={false}
                type="password"
              />

              <div className="o-login__form__buttons">
                <Link to={"/register"}>
                  <Button ghost>Register</Button>
                </Link>
                <Button type="primary" htmlType="submit">
                  Login
                </Button>
              </div>
              <div className="o-login__form__inputs__errors">
                <ErrorField className="form-err" name="email" />
                <ErrorField className="form-err" name="password" />
                {errors && (
                  <div className="form-err">
                    The provided authorization grant is invalid, expired,
                    revoked, does not match the redirection URI used in the
                    authorization request, or was issued to another client."
                  </div>
                )}
              </div>
            </AutoForm>
            <Link href="/forgot-password">
              <a className="o-login__form__forgot-password">Forgot password?</a>
            </Link>
          </div>
          <div className="o-login__description">
            <LoginDefault className="o-login__description__illustration" />
          </div>
        </div>
      </AppWrapper>
    );
  }
}

const LoginSchema = new SimpleSchema({
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  password: { type: String }
});

export default Login;
