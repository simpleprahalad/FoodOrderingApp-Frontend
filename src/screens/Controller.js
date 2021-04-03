import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Checkout from "../screens/checkout/Checkout";

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
        </div>
      </Router>
    );
  }
}

export default Controller;