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

class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const user = loadState();
    console.log(user);
  }

  onSubmit = data => {
    const { email, password } = data;
    axios
      .post(
        `https://kitsu.io/api/oauth/token?grant_type=password&username=${email}&password=${password}`
      )
      .then(result => {
        saveState(result);
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <AppWrapper title="Login">
        <div className="o-login">
          <div className="o-login__form">
            <h1 className="o-login__form__title">Login</h1>
            <AutoForm schema={LoginSchema} onSubmit={this.onSubmit}>
              <AutoField
                className="o-login__form__input"
                name="email"
                placeholder="Enter your email address"
                label={false}
              />
              <AutoField
                className="o-login__form__input"
                name="password"
                placeholder="Password"
                label={false}
                type="password"
              />

              <div className="o-login__form__inputs">
                <Link to={"/register"}>
                  <Button ghost>Register</Button>
                </Link>
                <Button type="primary" htmlType="submit">
                  Login
                </Button>
              </div>
              <ErrorField name="email" />
              <ErrorField name="password" />
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
