import React, { Component } from "react";
import Header from "../../common/header/Header";
import "./Checkout.css";
import { withStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from "prop-types";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import FormHelperText from "@material-ui/core/FormHelperText";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import SummaryCard from "../../common/SummaryCard";
import Grid from "@material-ui/core/Grid";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import IconButton from "@material-ui/core/IconButton";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";

const styles = (theme) => ({
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
  saveAddressButton: {
    display: "block",
    marginTop: 30,
  },
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(12, 1fr)",
    gridGap: theme.spacing(3),
  },
  gridList: {
    flexWrap: "nowrap",
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: "translateZ(0)",
  },
  gridListTile: {
    //Style for the Grid list tile .
    textAlign: "left",
    margin: "30px 0px 20px 0px",
    "border-style": "solid",
    "border-width": "0.5px 3px 3px 0.5px",
    "border-radius": "10px",
    padding: "8px",
  },
  addressCheckButton: {
    // Style fro the address check button
    float: "right",
  },
  summaryContainer: {
    "@media screen and (max-width: 600px), (max-width: 768px)": {
      margin: "20px",
      xs: 12,
      width: "90%",
    },
    marginLeft: "10px",
    marginTop: "30px",
    xs: 4,
    width: "30%",
  },
});

function getSteps() {
  return ["Delivery", "Payment"];
}

function TabPanel(props) {
  return (
    <Typography component={"div"} variant={"body2"}>
      {props.children}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

class Checkout extends Component {
  constructor() {
    super();
    this.state = {
      activeStep: 0,
      value: 0,
      billedRestaurant: "",
      billedRestaurantId: "",
      billedItems: [],
      totalBillAmount: 0,
      existingAddresses: [],
      paymentOptions: [],
      selectedAddress: "",
      noOfColumn: 3,
      selectedPaymentOptionId: "",
      flatBuildingNum: "",
      flatBuildingNumRequired: "dispNone",
      locality: "",
      localityRequired: "dispNone",
      city: "",
      cityRequired: "dispNone",
      selectedState: "",
      addressStates: [],
      stateRequired: "dispNone",
      pincode: "",
      pincodeRequired: "dispNone",
      pincodeHelpText: "dispNone",
      changeOption: "dispNone",
      isSnackBarVisible: false,
      snackBarMessage: "",
      onNewAddress: false /*flag to trace if user is currently in the
                            "existing address tab or new address tab" */,
      isLoggedIn:
        sessionStorage.getItem("access-token") === null ? false : true,
    };
  }

  snackBarClose = () => {
    // reset snackbar related varibles to hide snackbar
    this.setState({
      ...this.state,
      snackBarMessage: "",
      isSnackBarVisible: false,
    });
  };

  // Handle "Back" button of Stepper
  handleBack = () => {
    this.setState({ activeStep: this.state.activeStep - 1 });
  };

  // Handle "Next" button of Stepper
  handleNext = () => {
    // Handle Next only when the user is in Existing Address Tab
    // Allow Next of stepper only when user Selects address else no action
    if (this.state.onNewAddress !== true && this.state.selectedAddress !== "") {
      if (this.state.activeStep === 1) {
        // Allow Next of stepper only when user Selects one of the payment option
        if (this.state.selectedPaymentOptionId !== "") {
          this.setState({
            activeStep: this.state.activeStep + 1,
            changeOption: "dispBlock",
          });
        }
      } else {
        // Display "Change" option after user has selected 1 address and 1 of the payment mode
        this.setState({
          activeStep: this.state.activeStep + 1,
          changeOption: "dispNone",
        });
      }
    }
  };

  // Handles click between existing address and new address tabs
  tabChangeHandler = (event, value) => {
    this.setState({ value });
  };

  // Method to select address when user clicks on any of the address
  // in the horizontal scroll bar
  addressSelectedClickHandler = (addressId) => {
    let addresses = this.state.existingAddresses;
    let selectedAddress = "";
    addresses.forEach((address) => {
      if (address.id === addressId) {
        address.selected = true;
        selectedAddress = address.id;
      } else {
        address.selected = false;
      }
    });
    this.setState({
      ...this.state,
      addresses: addresses,
      selectedAddress: selectedAddress,
    });
  };

  // Method to display all the address available in DB in an horizontal scroll bar manner
  displayAddressList = () => {
    const { classes } = this.props;
    return (
      <GridList
        className={classes.gridList}
        cols={this.state.noOfColumn}
        spacing={2}
        cellHeight={"auto"}
      >
        {this.state.existingAddresses.map((address) => (
          <GridListTile
            className={classes.gridListTile}
            key={address.id}
            style={{
              borderColor: address.selected ? "rgb(224,37,96)" : "white",
            }}
          >
            <div className="grid-list-tile-container">
              <Typography variant="body1" component="p">
                {address.flat_building_name}
              </Typography>
              <Typography variant="body1" component="p">
                {address.locality}
              </Typography>
              <Typography variant="body1" component="p">
                {address.city}
              </Typography>
              <Typography variant="body1" component="p">
                {address.state.state_name}
              </Typography>
              <Typography variant="body1" component="p">
                {address.pincode}
              </Typography>
              <IconButton
                className={classes.addressCheckButton}
                onClick={() => this.addressSelectedClickHandler(address.id)}
              >
                <CheckCircleIcon
                  style={{ color: address.selected ? "green" : "grey" }}
                />
              </IconButton>
            </div>
          </GridListTile>
        ))}
      </GridList>
    );
  };

  /* Method to handle new address tab with following 5 fields :
    1. Flat / Building No.
    2. Locality
    3. City
    4. State
    5. Pincode */
  getAddNewAddressTabDetails = () => {
    return (
      <div style={{ maxWidth: "250px" }}>
        <FormControl required>
          <InputLabel htmlFor="flatBuildNo">Flat / Building No.</InputLabel>
          <Input
            id="flatBuildNo"
            type="text"
            username={this.state.flatBuildingNum}
            onChange={this.flatNumChangeHandler}
          />
          <FormHelperText className={this.state.flatBuildingNumRequired}>
            <span className="red">required</span>
          </FormHelperText>
        </FormControl>
        <br />
        <br />
        <FormControl required>
          <InputLabel htmlFor="locality">Locality</InputLabel>
          <Input
            id="locality"
            type="text"
            username={this.state.locality}
            onChange={this.localityChangeHandler}
          />
          <FormHelperText className={this.state.localityRequired}>
            <span className="red">required</span>
          </FormHelperText>
        </FormControl>
        <br />
        <br />
        <FormControl required>
          <InputLabel htmlFor="city">City</InputLabel>
          <Input
            id="city"
            type="text"
            username={this.state.city}
            onChange={this.cityChangeHandler}
          />
          <FormHelperText className={this.state.cityRequired}>
            <span className="red">required</span>
          </FormHelperText>
        </FormControl>
        <br />
        <br />
        <FormControl required>
          <InputLabel htmlFor="state-label">State</InputLabel>
          <Select
            id="state"
            value={this.state.selectedState}
            onChange={this.stateChangeHandler}
            style={{ width: "200px" }}
            MenuProps={{
              style: { marginTop: "50px", maxHeight: "250px" },
            }}
          >
            {this.state.addressStates.map((stateDetail, index) => (
              <MenuItem
                key={index + stateDetail.state_name}
                value={stateDetail}
              >
                {stateDetail.state_name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText className={this.state.stateRequired}>
            <span className="red">required</span>
          </FormHelperText>
        </FormControl>
        <br />
        <br />
        <FormControl required>
          <InputLabel htmlFor="pincode">Pincode</InputLabel>
          <Input
            id="pincode"
            type="text"
            username={this.state.pincode}
            onChange={this.pincodeChangeHandler}
          />
          <FormHelperText className={this.state.pincodeRequired}>
            <span className="red">required</span>
          </FormHelperText>
          <FormHelperText className={this.state.pincodeHelpText}>
            <span className="red">
              Pincode must contain only numbers and must be 6 digits long
            </span>
          </FormHelperText>
        </FormControl>
        <br />
        <br />
        <Button
          variant="contained"
          color="secondary"
          onClick={this.saveAddressClickHandler}
        >
          SAVE ADDRESS
        </Button>
        <br />
        <br />
      </div>
    );
  };

  // API call to GET various payment methods from Backend server
  getPaymentMethods = () => {
    let xhrPaymentMethods = new XMLHttpRequest();
    let that = this;

    xhrPaymentMethods.addEventListener("readystatechange", function () {
      if (this.readyState === 4 && xhrPaymentMethods.status === 200) {
        const rspPaymentOptions = JSON.parse(this.responseText).paymentMethods;
        const paymentOptionStrings = rspPaymentOptions.map(
          (paymentMode) => paymentMode
        );
        // Save the payment options list received from backend into a state variable
        that.setState({ paymentOptions: paymentOptionStrings });
      }
    });
    xhrPaymentMethods.open("GET", this.props.baseUrl + "payment");
    xhrPaymentMethods.setRequestHeader("Content-Type", "application/json");
    xhrPaymentMethods.send();
  };

  // API call to GET different states for populating state field in address from Backend server
  getStates = () => {
    let xhrGetStatesMethod = new XMLHttpRequest();
    let that = this;

    xhrGetStatesMethod.addEventListener("readystatechange", function () {
      if (this.readyState === 4 && xhrGetStatesMethod.status === 200) {
        const rspStateDetails = JSON.parse(this.responseText).states;
        const states = rspStateDetails.map((stateDetails) => stateDetails);
        // Save the state list received from backend into a state variable
        that.setState({ addressStates: states });
      }
    });
    xhrGetStatesMethod.open("GET", this.props.baseUrl + "states");
    xhrGetStatesMethod.setRequestHeader("Content-Type", "application/json");
    xhrGetStatesMethod.send();
  };

  // API call to GET different address of a customer from Backend server
  getDeliveryAddresses = () => {
    let xhrGetDeliveryAddressesMethod = new XMLHttpRequest();
    let that = this;

    xhrGetDeliveryAddressesMethod.addEventListener(
      "readystatechange",
      function () {
        if (
          this.readyState === 4 &&
          xhrGetDeliveryAddressesMethod.status === 200
        ) {
          const rspAddressesInDetail = JSON.parse(this.responseText).addresses;
          // Save the address list received from backend into a state variable
          that.setState({ existingAddresses: rspAddressesInDetail });
        }
      }
    );
    xhrGetDeliveryAddressesMethod.open(
      "GET",
      this.props.baseUrl + "address/customer"
    );
    xhrGetDeliveryAddressesMethod.setRequestHeader(
      "Content-Type",
      "application/json"
    );

    xhrGetDeliveryAddressesMethod.setRequestHeader(
      "authorization",
      "Bearer " + sessionStorage.getItem("access-token")
    );

    xhrGetDeliveryAddressesMethod.send();
  };

  handlePaymentModeChange = (e) => {
    this.setState({ selectedPaymentOptionId: e.target.value });
  };

  // Update all the data received from Details page into the summary component
  // displayed in checkout page
  updateSummary = () => {
    this.setState({
      billedRestaurant: this.props.history.location.state.restaurantName,
      billedRestaurantId: this.props.history.location.state.restaurantId,
      billedItems: this.props.history.location.state.orderItems.items,
      totalBillAmount: this.props.history.location.state.total,
    });
  };

  componentDidMount = () => {
    // Make API calls only when user is logged in
    if (this.state.isLoggedIn) {
      this.getDeliveryAddresses();
      this.getPaymentMethods();
      this.getStates();
      this.updateSummary();
      // Adding a event-listener to track resize of screen so as to change the
      // no of columns for the grid.
      window.addEventListener("resize", this.getGridListColumn);
    }
  };

  componentWillUnmount() {
    // Remove listener when component is unmounted
    window.removeEventListener("resize", this.getGridListColumn);
  }

  // Method to redirect to home screen when
  // 1. User logs out
  // 2. Any tries going directly to checkout page using url
  redirectToHome = () => {
    if (sessionStorage.getItem("access-token") === null) {
      this.props.history.push({
        pathname: "/",
      });
    }
  };

  // Input change handler for flat number/building name
  flatNumChangeHandler = (e) => {
    this.setState({ flatBuildingNum: e.target.value });
  };

  // Input change handler for locatity of address field
  localityChangeHandler = (e) => {
    this.setState({ locality: e.target.value });
  };

  // Input change handler for city of address field
  cityChangeHandler = (e) => {
    this.setState({ city: e.target.value });
  };

  // Input change handler for state of address field
  stateChangeHandler = (e) => {
    this.setState({ selectedState: e.target.value });
  };

  // Input change handler for pincode of address field
  pincodeChangeHandler = (e) => {
    this.setState({ pincode: e.target.value });
  };

  // Handling required option for address parameters
  saveAddressClickHandler = () => {
    this.state.flatBuildingNum === ""
      ? this.setState({ flatBuildingNumRequired: "dispBlock" })
      : this.setState({ flatBuildingNumRequired: "dispNone" });

    this.state.locality === ""
      ? this.setState({ localityRequired: "dispBlock" })
      : this.setState({ localityRequired: "dispNone" });

    this.state.city === ""
      ? this.setState({ cityRequired: "dispBlock" })
      : this.setState({ cityRequired: "dispNone" });

    this.state.selectedState === ""
      ? this.setState({ stateRequired: "dispBlock" })
      : this.setState({ stateRequired: "dispNone" });

    // Pincode validation code for 6 digits
    if (this.state.pincode !== "") {
      var pincodePattern = /^\d{6}$/;
      if (!this.state.pincode.match(pincodePattern)) {
        this.setState({
          pincodeRequired: "dispNone",
          pincodeHelpText: "dispBlock",
        });
      } else {
        this.setState({
          pincodeRequired: "dispNone",
          pincodeHelpText: "dispNone",
        });
      }
    } else {
      this.setState({
        pincodeRequired: "dispBlock",
        pincodeHelpText: "dispNone",
      });
    }

    // if any of the fields is null, then donot make API call to save address
    if (
      this.state.flatBuildingNum === "" ||
      this.state.locality === "" ||
      this.state.city === "" ||
      this.state.pincode === "" ||
      this.state.selectedState === ""
    ) {
      return;
    }

    // API call for saving address in the DB
    this.saveNewAddress();
  };

  // POST method to update new address into the backend server
  saveNewAddress() {
    let xhrSaveNewDeliveryAddressesMethod = new XMLHttpRequest();
    let that = this;

    xhrSaveNewDeliveryAddressesMethod.addEventListener(
      "readystatechange",
      function () {
        if (
          this.readyState === 4 &&
          xhrSaveNewDeliveryAddressesMethod.status === 201
        ) {
          // Reset all the fields of address when the address is
          // updated successfully in the DB
          that.setState({
            value: 0, // moving to existing tab after address is updated sccessfully
            onNewAddress: false,
            selectedAddress: "",
            selectedState: "",
            flatBuildingNum: "",
            locality: "",
            city: "",
            pincode: "",
          });

          // Update the screen with the lastest address added in DB
          // Lastest/recent most address is displayed as the 1st address in the list
          that.getDeliveryAddresses();
        }
      }
    );

    xhrSaveNewDeliveryAddressesMethod.open(
      "POST",
      this.props.baseUrl + "address"
    );

    xhrSaveNewDeliveryAddressesMethod.setRequestHeader(
      "Content-Type",
      "application/json"
    );

    xhrSaveNewDeliveryAddressesMethod.setRequestHeader(
      "authorization",
      "Bearer " + sessionStorage.getItem("access-token")
    );

    // Preparing the response object to be stored in the backend
    let requestBody = {};
    requestBody.flat_building_name = this.state.flatBuildingNum;
    requestBody.city = this.state.city;
    requestBody.locality = this.state.locality;
    requestBody.pincode = this.state.pincode;
    requestBody.state_uuid = this.state.selectedState.id;

    xhrSaveNewDeliveryAddressesMethod.send(JSON.stringify(requestBody));
  }

  // Go back to Stepper->Exisiting address tab when "Change" button is pressed by user
  onClickChangeHandler = () => {
    this.setState({
      activeStep: 0,
      changeOption: "dispNone",
    });
  };

  // Displaying all the address available DB and reset all the fields of new address tab
  onExitingAddressTabHandler = () => {
    this.setState({ onNewAddress: false });
    this.setState({
      pincodeRequired: "dispNone",
      flatBuildingNumRequired: "dispNone",
      localityRequired: "dispNone",
      cityRequired: "dispNone",
      stateRequired: "dispNone",
    });
  };

  // Setting flag to indicate that user is currently in the new address tab
  onNewAddressTabHandler = () => {
    this.setState({ onNewAddress: true });
  };

  // Setup the existing and new address tab UI
  getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div>
            <AppBar position="static">
              <Tabs
                value={this.state.value}
                onChange={this.tabChangeHandler}
                aria-label="simple tabs example"
              >
                <Tab
                  label="Existing Address"
                  onClick={this.onExitingAddressTabHandler}
                />
                <Tab
                  label="New Address"
                  onClick={this.onNewAddressTabHandler}
                />
              </Tabs>
            </AppBar>
            {this.state.value === 0 ? (
              <TabPanel value={this.state.value} index={0}>
                {this.state.existingAddresses &&
                this.state.existingAddresses.length !== 0 ? (
                  this.displayAddressList()
                ) : (
                  <Typography
                    variant="body1"
                    component="p"
                    style={{
                      color: "gray",
                      marginTop: "5%",
                      marginBottom: "20%",
                    }}
                  >
                    There are no saved addresses! You can save an address using
                    the 'New Address' tab or using your ‘Profile’ menu option.
                  </Typography>
                )}
              </TabPanel>
            ) : (
              <TabPanel value={this.state.value} index={1}>
                {this.getAddNewAddressTabDetails()}
              </TabPanel>
            )}
          </div>
        );
      case 1:
        return (
          <FormControl component="fieldset">
            <FormLabel component="legend">Select Mode of Payment</FormLabel>
            <RadioGroup
              aria-label="Payment Method"
              name="payment"
              value={this.state.selectedPaymentOptionId}
              onChange={this.handlePaymentModeChange}
            >
              {this.state.paymentOptions.map((payMethod, index) => (
                <FormControlLabel
                  value={payMethod.id}
                  control={<Radio />}
                  label={payMethod.payment_name}
                  key={index}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );
      default:
        return "Unknown step";
    }
  };

  // POST method for saving the order in the backend server and updating
  // snackbar with order id when order is successfull, else displaying a
  // failure message in snackbar
  placeOrderClickHandler = () => {
    let xhrPlaceOrderMethod = new XMLHttpRequest();
    let that = this;

    xhrPlaceOrderMethod.addEventListener("readystatechange", function () {
      if (this.readyState === 4 && xhrPlaceOrderMethod.status === 201) {
        const orderStatus = JSON.parse(this.responseText);
        that.setState({
          snackBarMessage:
            "Order placed successfully! Your order ID is " + orderStatus.id,
          isSnackBarVisible: true,
        });
      } else {
        that.setState({
          snackBarMessage: "Unable to place your order! Please try again!",
          isSnackBarVisible: true,
        });
      }
    });
    xhrPlaceOrderMethod.open("POST", this.props.baseUrl + "order");
    xhrPlaceOrderMethod.setRequestHeader("Content-Type", "application/json");
    xhrPlaceOrderMethod.setRequestHeader(
      "authorization",
      "Bearer " + sessionStorage.getItem("access-token")
    );

    // Creating an order object to be sent out to backend server for storing order
    let requestBody = {};
    requestBody.address_id = this.state.selectedAddress;
    requestBody.bill = this.state.totalBillAmount;
    requestBody.coupon_id = "";
    requestBody.discount = 0;
    requestBody.item_quantities = this.state.billedItems;
    requestBody.payment_id = this.state.selectedPaymentOptionId;
    requestBody.restaurant_id = this.state.billedRestaurantId;

    xhrPlaceOrderMethod.send(JSON.stringify(requestBody));
  };

  // Method to handle displaying of 3 address when in full screen mode
  // and displaying 2 address blocks when in Phone mode
  getGridListColumn = () => {
    if (window.innerWidth <= 600) {
      this.setState({
        ...this.state,
        noOfColumn: 2,
      });
    } else {
      this.setState({
        ...this.state,
        noOfColumn: 3,
      });
    }
  };

  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;

    return (
      <div>
        {this.redirectToHome()}
        <Header
          isSearchBarVisible={false}
          baseUrl={this.props.baseUrl}
          logoutHandler={this.redirectToHome}
        />
        <Grid container spacing={1}>
          <Grid item xs={12} md={8}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                  <StepContent>
                    <Typography component={"div"}>
                      {this.getStepContent(index)}
                    </Typography>
                    <div className={classes.actionsContainer}>
                      <div>
                        <Button
                          disabled={activeStep === 0}
                          onClick={this.handleBack}
                          className={classes.button}
                        >
                          Back
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={this.handleNext}
                          className={classes.button}
                        >
                          {activeStep === steps.length - 1 ? "Finish" : "Next"}
                        </Button>
                      </div>
                    </div>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
            <div
              className={this.state.changeOption}
              style={{ marginTop: "10px" }}
            >
              <div style={{ marginLeft: "3%", fontSize: "24px" }}>
                View the summary and place your order now!
              </div>
              <Button
                style={{ marginLeft: "5%", fontSize: "20px" }}
                onClick={this.onClickChangeHandler}
                className={classes.button}
              >
                CHANGE
              </Button>
            </div>
          </Grid>
          <Grid item className={classes.summaryContainer}>
            <SummaryCard
              {...this.state}
              placeOrderClickHandler={this.placeOrderClickHandler}
            />
          </Grid>
        </Grid>
        <div>
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            open={this.state.isSnackBarVisible}
            autoHideDuration={4000}
            onClose={this.snackBarClose}
            ContentProps={{
              "aria-describedby": "message-id",
            }}
            message={<span id="message-id">{this.state.snackBarMessage}</span>}
            action={
              <IconButton color="inherit" onClick={this.snackBarClose}>
                <CloseIcon />
              </IconButton>
            }
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Checkout);
