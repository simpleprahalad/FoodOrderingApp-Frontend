import React, { Component, Fragment } from "react";
import "./Details.css";
import StyledSnackBar from "../common/StyledSnackBar";
import Header from "../../common/header/Header";
import {
  IconButton,
  Divider,
  Card,
  CardContent,
  Button,
  Badge,
  Typography,
  Grid,
} from "@material-ui/core/";
import AddIcon from "@material-ui/icons/Add";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import "font-awesome/css/font-awesome.min.css";

//This is Details component used to show details of the user selected restaurant
//This component shows the restuarant details' such as avg rating, avg price, menu items, etc.
//This component also provides the functionality of adding items in a cart and proceed to checkout page.
class Details extends Component {
  constructor() {
    super();
    this.state = {
      //State variables of the component that captures details of restuarant that was clicked from the home page by user
      id: null,
      restaurantName: null,
      restaurantId: null,
      photoUrl: null,
      customerRating: null,
      averagePrice: null,
      numberOfCustomersRated: null,
      locality: null,
      categories: [],

      //State variables that captures and updates the user's cart according to the items added by him/her
      totalAmount: 0,
      totalItemCount: 0,
      orderItems: { id: null, items: [], total: 0 },
      cartItems: [],
      cartItem: {},

      //State variables to show snackbar notifications to user as per the requirement
      //This shows notification to user on adding/removing an item, increasing/decreasing item's quanitity, 
      // checking out while not logged in, etc.
      itemAddedNotification: false,
      isCartEmpty: false,
      itemQuantityDecreased: false,
      itemRemovedFromCart: false,
      itemQuantityIncreased: false,
      itemAddedFromCart: false,
      userNotLoggedIn: false,
    };
  }

  //This function is invoked immediately after it is mounted
  //This function hits the backend API with GET request to fetch the information of the respective 
  // restaurant (which user clicked upon)
  componentDidMount() {
    let data = null;
    let xhr = new XMLHttpRequest();
    let url = this.props.baseUrl + "restaurant/";
    xhr.open("GET", url + this.props.match.params.restaurantId);
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.send(data);

    let that = this;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4 && this.status === 200) {
        let responseObject = JSON.parse(this.responseText);
        that.setState({
          //Sets the state variables that captures restaurant information from response from backend
          id: responseObject.id,
          restaurantId: responseObject.id,
          restaurantName: responseObject.restaurant_name,
          photoUrl: responseObject.photo_URL,
          customerRating: responseObject.customer_rating,
          averagePrice: responseObject.average_price,
          numberOfCustomersRated: responseObject.number_customers_rated,
          locality: responseObject.address.locality,
          categories: responseObject.categories,
          orderItems: { id: responseObject.id },
        });
      }
    });
  }

  //Handler function for adding an item to cart
  addToCartHandler = (event, id, type, name, price) => {
    let totalAmount = this.state.totalAmount;
    let totalItemCount = this.state.totalItemCount;
    totalItemCount += 1;

    const newItem = this.state.cartItem;
    newItem.item_id = id;
    newItem.type = type;
    newItem.name = name;
    newItem.pricePerItem = price;
    newItem.quantity = 1;
    newItem.price = price;

    this.setState({ cartItem: newItem });
    totalAmount += price;

    //If the item exist in the cart already and its amount/quantity is to be incremented and cart is not empty
    if (
      this.state.orderItems.items !== undefined &&
      this.state.orderItems.items.some((item) => item.name === name)
    ) {
      let index = this.state.orderItems.items.findIndex(
        (element) => element["name"] === name
      );
      let quantity = this.state.orderItems.items[index].quantity + 1;
      let priceForAll =
        this.state.orderItems.items[index].price +
        this.state.orderItems.items[index].pricePerItem;
      let item = this.state.orderItems.items[index];
      item.quantity = quantity;
      item.price = priceForAll;
      this.setState(item);
    } else { 
      //If the item does not exist in the cart or cart is empty
      this.state.cartItems.push(this.state.cartItem);
      this.setState({ cartItem: {} });
      const orderItems = this.state.orderItems;
      orderItems.items = this.state.cartItems;
      this.setState({ orderItems: orderItems });
    }

    //Show notification via snackbar
    this.setState({ itemAddedNotification: true });

    //Update the item count and total amount of the cart for the user
    this.setState({ totalItemCount: totalItemCount });
    this.setState({ totalAmount: totalAmount });
  };

  //Handler for incrementing item quantity from the cart
  incrementItemQuantity = (item, index) => {
    let itemIndex = this.state.orderItems.items.findIndex(
      (element) => element["name"] === item.name
    );
    let quantity = this.state.orderItems.items[itemIndex].quantity + 1;
    let priceForAll =
      this.state.orderItems.items[itemIndex].price +
      this.state.orderItems.items[itemIndex].pricePerItem;
    let itemAdded = this.state.orderItems.items[itemIndex];
    itemAdded.quantity = quantity;
    itemAdded.price = priceForAll;
    this.setState(item);
    this.setState({ itemQuantityIncreased: true });
    let totalAmount = this.state.totalAmount;
    totalAmount += item.pricePerItem;
    let totalItemCount = this.state.totalItemCount;
    totalItemCount += 1;

    //Update state variables of the component to re-render the 
    // updated amount/item count of the cart
    this.setState({ totalItemCount: totalItemCount });
    this.setState({ totalAmount: totalAmount });
  };

  //Handler for decrementing item quantity from the cart
  decrementItemQuantity = (event, id, type, name, price) => {
    let index = this.state.orderItems.items.findIndex(
      (element) => element["name"] === name
    );
    if (this.state.orderItems.items[index].quantity > 1) {
      let quantity = this.state.orderItems.items[index].quantity - 1;
      let priceForAll =
        this.state.orderItems.items[index].price -
        this.state.orderItems.items[index].pricePerItem;
      let item = this.state.orderItems.items[index];
      item.quantity = quantity;
      item.price = priceForAll;
      this.setState(item);
      this.setState({ itemQuantityDecreased: true });
    } else {
      this.state.orderItems.items.splice(index, 1);
      this.setState({ itemRemovedFromCart: true });
    }
    let totalAmount = this.state.totalAmount;
    totalAmount -= price;
    let totalItemCount = this.state.totalItemCount;
    totalItemCount -= 1;

    //Update state variables of the component to re-render the 
    // updated amount/item count of the cart
    this.setState({ totalItemCount: totalItemCount });
    this.setState({ totalAmount: totalAmount });
  };

  //Handler that validates the cart and takes logged in user to 
  // the checkout page in case of a valid cart + user is logged in
  checkoutHandler = () => {
    //In case no items are added to the cart - show respective 
    // snackbar notification by updating respective state variable
    if (this.state.totalItemCount === 0) {
      this.setState({ isCartEmpty: true });
    } 
    //In user is not logged - show respective 
    // snackbar notification by updating respective state variable
    else if (sessionStorage.getItem("access-token") === null) {
      this.setState({ userNotLoggedIn: true });
    } else {
      //Let user proceed to the checkout page in case of 
      // valid cart + user is logged in.
      this.props.history.push({
        pathname: "/checkout",
        state: {
          orderItems: this.state.orderItems,
          total: this.state.totalAmount,
          restaurantName: this.state.restaurantName,
          restaurantId: this.state.restaurantId,
        },
      });
    }
  };

  //Auto close the snackbar notification for irrespective of type of notification
  closeSnackBar = () => {
    this.setState({ itemAddedNotification: false });
    this.setState({ isCartEmpty: false });
    this.setState({ userNotLoggedIn: false });
    this.setState({ itemQuantityDecreased: false });
    this.setState({ itemRemovedFromCart: false });
    this.setState({ itemAddedFromCart: false });
    this.setState({ itemQuantityIncreased: false });
  };

  //Render method for the Details react component.
  render() {
    return (
      <div>
        <Header baseUrl={this.props.baseUrl} />
        {this.state.text}
        <div className="main">
          <div className="restaurant-details">
            <div className="image-container">
              <img
                src={this.state.photoUrl}
                alt="none"
                className="restaurant-image"
              />
            </div>
            <div className="details-container">
              <div
                style={{
                  fontWeight: "medium",
                  fontSize: "30px",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                }}
              >
                {this.state.restaurantName}
              </div>
              <div
                style={{
                  fontWeight: "medium",
                  fontSize: "16px",
                  paddingBottom: "10px",
                }}
              >
                {this.state.locality}
              </div>
              <div style={{ fontSize: "14px", paddingBottom: "20px" }}>
                {this.state.categories.map((category, index) => (
                  <span key={category.id + "category"}>
                    {category.category_name}
                    {index < this.state.categories.length - 1 ? ", " : " "}{" "}
                  </span>
                ))}
              </div>
              <div className="rating-avgprice-container">
                <div className="rating-container">
                  <i
                    className="fa fa-star"
                    aria-hidden="true"
                    style={{
                      paddingRight: "3px",
                      paddingBottom: "3px",
                      paddingLeft: "2px",
                    }}
                  ></i>
                  {this.state.customerRating}
                  <div style={{ color: "gray", fontSize: "12px" }}>
                    AVERAGE RATING BY
                  </div>
                  <div
                    style={{
                      color: "gray",
                      fontSize: "12px",
                    }}
                  >
                    {this.state.numberOfCustomersRated} CUTOMERS
                  </div>
                </div>
                <div className="avgprice-container">
                  <i
                    className="fa fa-inr"
                    aria-hidden="true"
                    style={{
                      paddingRight: "4px",
                      paddingBottom: "3px",
                      paddingLeft: "2px",
                    }}
                  ></i>
                  {this.state.averagePrice}
                  <div style={{ color: "gray", fontSize: "12px" }}>
                    AVERAGE COST FOR
                  </div>
                  <div style={{ color: "gray", fontSize: "12px" }}>
                    TWO PEOPLE
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="menu">
            <div className="items-list">
              {this.state.categories.map((category) => (
                <div className="category" key={"category" + category.id}>
                  <span
                    style={{
                      color: "grey",
                      fontWeight: "bolder",
                    }}
                  >
                    {category.category_name.toUpperCase()}
                  </span>{" "}
                  <Divider
                    style={{
                      marginTop: "10px",
                      marginBottom: "10px",
                      width: "100%",
                    }}
                  />
                  {category.item_list.map((item) => (
                    <Grid container key={item.id} style={{ marginBottom: 5 }}>
                      <Grid item xs={1}>
                        {item.item_type === "VEG" ? (
                          <span
                            className="fa fa-circle"
                            aria-hidden="true"
                            style={{ fontSize: "12px", color: "green" }}
                          />
                        ) : (
                          <span
                            className="fa fa-circle"
                            aria-hidden="true"
                            style={{ fontSize: "12px", color: "red" }}
                          />
                        )}
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>
                          <span className="item-name">
                            {/* To Pascal Case */}
                            {item.item_name.replace(
                              /(\w)(\w*)/g,
                              function (g0, g1, g2) {
                                return g1.toUpperCase() + g2.toLowerCase();
                              }
                            )}{" "}
                          </span>
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <div className="price">
                          <span>
                            <i className="fa fa-inr" aria-hidden="true"></i>
                            <span
                              style={{ paddingLeft: "2px", float: "right" }}
                            >
                              {item.price.toFixed(2)}
                            </span>
                          </span>
                        </div>
                      </Grid>
                      <Grid item xs={2}>
                        <IconButton
                          style={{ padding: 0, float: "right" }}
                          onClick={(event) =>
                            this.addToCartHandler(
                              event,
                              item.id,
                              item.item_type,
                              item.item_name,
                              item.price
                            )
                          }
                        >
                          <AddIcon style={{ padding: 0, fontSize: "large" }} />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}
                </div>
              ))}
            </div>
            <div className="cart-container">
              <Card>
                <CardContent>
                  <div style={{ fontWeight: "bold" }}>
                    <span style={{ paddingRight: "20px" }}>
                      <Badge
                        className="cart-counter"
                        badgeContent={this.state.totalItemCount}
                        color="primary"
                        showZero
                      >
                        <ShoppingCartIcon />
                      </Badge>
                    </span>
                    My Cart
                  </div>
                  <div className="items-in-cart">
                    <Grid container>
                      {this.state.orderItems.items !== undefined
                        ? this.state.orderItems.items.map((item, index) => (
                            <Fragment key={item.item_id}>
                              <Grid item xs={1}>
                                {item.type === "VEG" ? (
                                  <span
                                    className="fa fa-stop-circle-o"
                                    aria-hidden="true"
                                    style={{
                                      fontSize: "12px",
                                      color: "green",
                                      paddingRight: "12px",
                                    }}
                                  />
                                ) : (
                                  <span
                                    className="fa fa-stop-circle-o"
                                    aria-hidden="true"
                                    style={{
                                      fontSize: "12px",
                                      color: "red",
                                      paddingRight: "12px",
                                    }}
                                  />
                                )}
                              </Grid>
                              <Grid item xs={5}>
                                <Typography>
                                  {/* Pascal case */}
                                  {item.name.replace(
                                    /(\w)(\w*)/g,
                                    function (g0, g1, g2) {
                                      return (
                                        g1.toUpperCase() + g2.toLowerCase()
                                      );
                                    }
                                  )}
                                </Typography>
                              </Grid>
                              <Grid item xs={3}>
                                <div className="add-remove-icon">
                                  <div className="minus">
                                    <IconButton
                                      className="add-remove-btn"
                                      style={{
                                        display: "flex",
                                        padding: 0,
                                        fontSize: "30",
                                      }}
                                      onClick={(event) =>
                                        this.decrementItemQuantity(
                                          event,
                                          item.id,
                                          item.type,
                                          item.name,
                                          item.pricePerItem
                                        )
                                      }
                                    >
                                      <i
                                        className="fa fa-minus add-icon-plus-button"
                                        aria-hidden="true"
                                      ></i>
                                    </IconButton>
                                    <Typography
                                      style={{
                                        color: "black",
                                        fontSize: "medium",
                                      }}
                                    >
                                      {item.quantity}
                                    </Typography>
                                  </div>
                                  <div className="plus">
                                    <IconButton
                                      className="add-remove-btn"
                                      style={{ display: "flex", padding: 0 }}
                                      onClick={this.incrementItemQuantity.bind(
                                        this,
                                        item,
                                        index
                                      )}
                                    >
                                      <i
                                        className="fa fa-plus add-icon-plus-button"
                                        aria-hidden="true"
                                      ></i>
                                    </IconButton>
                                  </div>
                                </div>
                              </Grid>
                              <Grid item xs={3}>
                                <span style={{ float: "right" }}>
                                  <i
                                    className="fa fa-inr"
                                    aria-hidden="true"
                                  ></i>
                                  <span style={{ paddingLeft: "2px" }}>
                                    {item.price.toFixed(2)}
                                  </span>
                                </span>
                              </Grid>
                            </Fragment>
                          ))
                        : null}
                      <Grid item xs={8} lg={9}>
                        <div style={{ marginTop: 15, marginBottom: 15 }}>
                          <span style={{ fontWeight: "bold" }}>
                            TOTAL AMOUNT
                          </span>
                        </div>
                      </Grid>
                      <Grid item xs={4} lg={3}>
                        <div style={{ marginTop: 15, marginBottom: 15 }}>
                          <span style={{ fontWeight: "bold", float: "right" }}>
                            <i
                              className="fa fa-inr"
                              aria-hidden="true"
                              style={{ paddingRight: "2px" }}
                            ></i>
                            {this.state.totalAmount.toFixed(2)}
                          </span>
                        </div>
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          className="checkout-btn"
                          variant="contained"
                          color="primary"
                          onClick={this.checkoutHandler}
                        >
                          <Typography>CHECKOUT</Typography>
                        </Button>
                      </Grid>
                    </Grid>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <StyledSnackBar
            open={this.state.itemAddedNotification}
            onClose={this.closeSnackBar}
            message="Item added to cart!"
          />
          <StyledSnackBar
            open={this.state.isCartEmpty}
            onClose={this.closeSnackBar}
            message="Please add an item to your cart!"
          />
          <StyledSnackBar
            open={this.state.itemQuantityDecreased}
            onClose={this.closeSnackBar}
            message="Item quantity decreased by 1!"
          />
          <StyledSnackBar
            open={this.state.itemRemovedFromCart}
            onClose={this.closeSnackBar}
            message="Item removed from cart!"
          />
          <StyledSnackBar
            open={this.state.itemQuantityIncreased}
            onClose={this.closeSnackBar}
            message="Item quantity increased by 1!"
          />
          <StyledSnackBar
            open={this.state.userNotLoggedIn}
            onClose={this.closeSnackBar}
            message="Please login first!"
          />
        </div>
      </div>
    );
  }
}

//Export the component in its default config for the Controller.js 
// react component to use according to the design of SPA
export default Details;
