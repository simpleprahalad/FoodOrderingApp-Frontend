import React, { Component } from "react";
import InfoCard from "./infocard/InfoCard";
import "./Home.css";

class Home extends Component {
  constructor() {
    super();
    this.state = {
      restaurants: [
        {
          item_types: ["Indian", "Continental"],
          restaurant_name: "3 Wise Monkeys",
          restaurant_image_url:
            "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg",
        },
      ],
    };
  }

  render() {
    return (
      <div className="container">
        {this.state.restaurants.map((restaurant) => (
          <InfoCard {...restaurant} />
        ))}
      </div>
    );
  }
}

export default Home;
