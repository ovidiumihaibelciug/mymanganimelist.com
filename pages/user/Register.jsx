import React from "react";
import Link from "next/link";
import SimpleSchema from "simpl-schema";
import { AutoForm, AutoField, ErrorField } from "uniforms-antd";
import Button from "antd/lib/button";
import notification from "antd/lib/notification";
import { Roles } from "meteor/alanning:roles";

class Register extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {};
  characterdat;

  onSubmit({ email, username, password, rpassword }) {
    const history = this.props;
    if (password !== rpassword) {
      notification.open({
        message: "Error",
        description: "pass !== rpass"
      });
    } else {
      try {
        let user = {
          email,
          username,
          password,
          profile: {},
          roles: []
        };
        Meteor.call("user.register", user, err => {
          console.log(err);
        });
      } catch (error) {
        notification.open({
          message: "Error",
          description: "aa"
        });
      }
    }
  }

  render() {
    return (
      <div>
        <AutoForm schema={RegisterSchema} onSubmit={this.onSubmit.bind(this)}>
          <AutoField
            name="email"
            placeholder="Enter your email address"
            label={false}
          />
          <AutoField
            name="username"
            placeholder="Enter your username"
            label={false}
          />
          <AutoField
            name="password"
            placeholder="Password"
            label={false}
            type="password"
          />
          <AutoField
            name="rpassword"
            placeholder="Repeat Password"
            label={false}
            type="password"
          />

          <Button type="primary" htmlType="submit">
            Register
          </Button>
          <Link to={"/login"}>Already registered? Login now!</Link>
          <ErrorField name="email" />
          <ErrorField name="username" />
          <ErrorField name="password" />
          <ErrorField name="rpassword" />
        </AutoForm>
      </div>
    );
  }
}

export default Register;

const RegisterSchema = new SimpleSchema({
  email: {
    type: String
  },
  username: {
    type: String
  },
  password: {
    type: String
  },
  rpassword: {
    type: String
  }
});
