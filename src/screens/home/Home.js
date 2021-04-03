import React, { Component } from "react";
import InfoCard from "./infocard/InfoCard";
import "./Home.css";
import Header from "../header/Header";

class Home extends Component {
  constructor() {
    super();
    this.state = {
      restaurants: [
        {
          avg_rating: 4.0,
          rating_count: 200,
          pricing: 750,
          item_types: ["Indian", "Continental"],
          restaurant_name: "3 Wise Monkeys",
          restaurant_image_url:
            "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg",
        },
        {
          avg_rating: 4.5,
          rating_count: 2008,
          pricing: 500,
          item_types: ["Chinese", "Mughlai"],
          restaurant_name: "Kung-fu Murgh",
          restaurant_image_url:
            "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg",
        },
        {
          avg_rating: 4.1,
          rating_count: 200,
          pricing: 300,
          item_types: ["South Indian", "North Indian"],
          restaurant_name: "Kashmir se KanyaKumari",
          restaurant_image_url:
            "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg",
        },
        {
          avg_rating: 3.5,
          rating_count: 350,
          pricing: 2300,
          item_types: ["French", "German"],
          restaurant_name: "The Grapes Valley",
          restaurant_image_url:
            "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg",
        },
      ],
    };
  }

  render() {
    return (
      <div>
        <Header />
        <div className="container">
          {this.state.restaurants.map((restaurant) => (
            <InfoCard {...restaurant} />
          ))}
        </div>
      </div>
    );
  }
}

export default Home;
