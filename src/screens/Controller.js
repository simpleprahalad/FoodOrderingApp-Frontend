import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Checkout from "../screens/checkout/Checkout";
import Home from "../screens/home/Home";
import Details from "../screens/details/Details";
import Profile from "../screens/profile/Profile";

// This is a controller component that provides access and routing for the SPA Food Ordering App and its 4 views viz.
// 1. Home Page ("/")
// 2. Details Page ("/restaurant/:restaurantId")
// 3. Checkout Page ("/checkout")
// 4. Profile Page ("/profile")
class Controller extends Component {
  constructor() {
    super();
    this.baseUrl = "http://localhost:8080/api/";
  }

  render() {
    return (
      <Router>
        <div className="main-container">
          <Route
            exact
            path="/checkout"
            render={(props) => <Checkout {...props} baseUrl={this.baseUrl} />}
          />
          <Route
            exact
            path="/"
            render={(props) => <Home {...props} baseUrl={this.baseUrl} />}
          />
          <Route
            exact
            path="/restaurant/:restaurantId"
            render={(props) => <Details {...props} baseUrl={this.baseUrl} />}
          />
          <Route
            exact
            path="/profile"
            render={(props) => <Profile {...props} baseUrl={this.baseUrl} />}
          />
        </div>
      </Router>
    );
  }
}

export default Controller;
