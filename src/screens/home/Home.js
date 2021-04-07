import React, { Component } from "react";
import InfoCard from "./infocard/InfoCard";
import "./Home.css";
import Header from "../../common/header/Header";

class Home extends Component {
  constructor() {
    super();
    this.state = {
      restaurantsList: [],
    };
  }

  componentDidMount = () => {
    this.getRestaurantDetails();
  };

  getRestaurantDetails = () => {
    let xhrPaymentMethods = new XMLHttpRequest();
    let that = this;

    xhrPaymentMethods.addEventListener("readystatechange", function () {
      if (this.readyState === 4 && xhrPaymentMethods.status === 200) {
        const restaurantsObjArray = JSON.parse(this.responseText).restaurants;
        that.setState({ restaurantsList: restaurantsObjArray });
      } else {
        console.log(this.responseText);
      }
    });
    xhrPaymentMethods.open("GET", "http://localhost:8080/api/" + "restaurant");
    xhrPaymentMethods.setRequestHeader("Accept", "application/json");
    xhrPaymentMethods.send();
  };

  render() {
    return (
      <div>
        <Header />
        <div className="container">
          {this.state.restaurantsList.map((restaurant) => (
            <InfoCard {...restaurant} />
          ))}
        </div>
      </div>
    );
  }
}

export default Home;
