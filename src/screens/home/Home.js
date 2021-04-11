import React, { Component } from "react";
import InfoCard from "./infocard/InfoCard";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import "./Home.css";
import Header from "../../common/header/Header";

class Home extends Component {
  constructor() {
    super();
    this.state = {
      cards: null,
      restaurantsList: [],
      searchResultRestuarants: [],
      isSearchActive: false,
    };
  }

  componentDidMount = () => {
    this.getRestaurantDetails();
    this.noOfColumns();
    //when the window is resized calls the noOfColumns method
    window.addEventListener("resize", this.noOfColumns);
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

  //method updates the no columns according to the window size
  noOfColumns = () => {
    if (window.innerWidth >= 320 && window.innerWidth <= 600) {
      this.setState({
        cards: 1,
      });
      return;
    }

    if (window.innerWidth >= 601 && window.innerWidth <= 1000) {
      this.setState({
        cards: 2,
      });
      return;
    }

    if (window.innerWidth >= 1001 && window.innerWidth <= 1270) {
      this.setState({
        cards: 3,
      });
      return;
    }

    if (window.innerWidth >= 1271 && window.innerWidth <= 1530) {
      this.setState({
        cards: 4,
      });
      return;
    }
    if (window.innerWidth >= 1530) {
      this.setState({ cards: 5 });
      return;
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
        <div style={{ justifyContent: "space-around" }}>
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
            <GridList cols={this.state.cards} cellHeight="auto">
              {this.state.restaurantsList.map((restaurant) => (
                <GridListTile
                  key={"restaurant" + restaurant.id}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <InfoCard {...restaurant} key={restaurant.id} />
                </GridListTile>
              ))}
            </GridList>
          )}
        </div>
      </div>
    );
  }
}

export default Home;
