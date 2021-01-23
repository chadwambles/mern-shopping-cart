import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import auth from "./tool";

const PvtRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      auth.isAuth() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/signin",
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

export default PvtRoute;
