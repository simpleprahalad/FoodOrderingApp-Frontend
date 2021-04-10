import React, { Component } from "react";
import InfoCard from "./infocard/InfoCard";
import "./Home.css";
import Header from "../../common/header/Header";

class Home extends Component {
  constructor() {
    super();
    this.state = {
      restaurantsList: [],
      searchResultRestuarants: [],
      isSearchActive: false,
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
      }
    });
    xhrPaymentMethods.open("GET", this.props.baseUrl + "restaurant");
    xhrPaymentMethods.setRequestHeader("Accept", "application/json");
    xhrPaymentMethods.send();
  };

  //Populate searched restaurants from header callback
  getRestaurantsBySearch = (searchedRestaurants, isSearchActive) => {
    if (isSearchActive) {
      this.setState({
        searchResultRestuarants: searchedRestaurants,
        isSearchActive: true,
      });
    } else {
      this.setState({
        isSearchActive: false,
      });
    }
  };

  render() {
    return (
      <div>
        <Header
          baseUrl={this.props.baseUrl}
          isSearchBarVisible={true}
          restaurantsBySearch={this.getRestaurantsBySearch}
        />
        <div className="container">
          {this.state.isSearchActive ? (
            this.state.searchResultRestuarants.length > 0 ? (
              this.state.searchResultRestuarants.map((restaurant) => (
                <InfoCard {...restaurant} key={restaurant.id} />
              ))
            ) : (
              <span className="no-restaurant">
                No restaurant with the given name
              </span>
            )
          ) : (
            this.state.restaurantsList.map((restaurant) => (
              <InfoCard {...restaurant} key={restaurant.id} />
            ))
          )}
        </div>
      </div>
    );
  }
}

export default Home;
