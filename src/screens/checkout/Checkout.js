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
});

function getSteps() {
  return ["Delivery", "Payment"];
}

function TabPanel(props) {
  return (
    <div
      role="tabpanel"
      hidden={props.value !== props.index}
      id={`simple-tabpanel-${props.index}`}
      aria-labelledby={`simple-tab-${props.index}`}
    >
      {props.value === props.index && <Typography>{props.children}</Typography>}
    </div>
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
      billedRestaurant: "The Food League",
      billedItems: [
        {
          itemName: "Hakka Noodles",
          price: 100,
          qty: 2,
          isVeg: "true",
        },
        {
          itemName: "Hyderabadi Biryani",
          price: 250,
          qty: 1,
          isVeg: "false",
        },
        {
          itemName: "Veg. Manchuriyan",
          price: 140,
          qty: 2,
          isVeg: "true",
        },
      ],
      existingAddresses: [],
      paymentOptions: [],
      selectedAddress: "",
      noOfColumn: 3,
      selectedPaymentOption: "",
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
      onNewAddress: false,
      apiUrl: "http://localhost:8080/api/",
    };
  }

  snackBarClose = () => {
    this.setState({
      ...this.state,
      snackBarMessage: "",
      isSnackBarVisible: false,
    });
  };

  handleBack = () => {
    this.setState({ activeStep: this.state.activeStep - 1 });
  };

  handleNext = () => {
    if (this.state.onNewAddress !== true) {
      if (this.state.activeStep === 1) {
        this.setState({
          activeStep: this.state.activeStep + 1,
          changeOption: "dispText",
        });
      } else {
        this.setState({
          activeStep: this.state.activeStep + 1,
          changeOption: "dispNone",
        });
      }
    }
  };

  tabChangeHandler = (event, value) => {
    this.setState({ value });
  };

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

  displayAddressList = () => {
    const { classes } = this.props;
    return (
      <GridList
        className={classes.gridList}
        cols={this.state.noOfColumn}
        spacing={2}
        cellHeight="auto"
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

  getPaymentMethods = () => {
    let xhrPaymentMethods = new XMLHttpRequest();
    let that = this;

    xhrPaymentMethods.addEventListener("readystatechange", function () {
      if (this.readyState === 4 && xhrPaymentMethods.status === 200) {
        const rspPaymentOptions = JSON.parse(this.responseText).paymentMethods;
        const paymentOptionStrings = rspPaymentOptions.map(
          (paymentMode) => paymentMode.payment_name
        );
        that.setState({ paymentOptions: paymentOptionStrings });
      } else {
        console.log(this.responseText);
      }
    });
    xhrPaymentMethods.open("GET", this.state.apiUrl + "payment");
    xhrPaymentMethods.setRequestHeader("Content-Type", "application/json");
    xhrPaymentMethods.send();
  };

  getStates = () => {
    let xhrGetStatesMethod = new XMLHttpRequest();
    let that = this;

    xhrGetStatesMethod.addEventListener("readystatechange", function () {
      if (this.readyState === 4 && xhrGetStatesMethod.status === 200) {
        const rspStateDetails = JSON.parse(this.responseText).states;
        const states = rspStateDetails.map((stateDetails) => stateDetails);
        that.setState({ addressStates: states });
      } else {
        console.log(this.responseText);
      }
    });
    xhrGetStatesMethod.open("GET", this.state.apiUrl + "states");
    xhrGetStatesMethod.setRequestHeader("Content-Type", "application/json");
    xhrGetStatesMethod.send();
  };

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
          that.setState({ existingAddresses: rspAddressesInDetail });
        } else {
          console.log(this.responseText);
        }
      }
    );
    xhrGetDeliveryAddressesMethod.open(
      "GET",
      this.state.apiUrl + "address/customer"
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
    this.setState({ selectedPaymentOption: e.target.value });
  };

  componentDidMount = () => {
    this.getDeliveryAddresses();
    this.getPaymentMethods();
    this.getStates();
  };

  flatNumChangeHandler = (e) => {
    this.setState({ flatBuildingNum: e.target.value });
  };

  localityChangeHandler = (e) => {
    this.setState({ locality: e.target.value });
  };

  cityChangeHandler = (e) => {
    this.setState({ city: e.target.value });
  };

  stateChangeHandler = (e) => {
    this.setState({ selectedState: e.target.value });
  };

  pincodeChangeHandler = (e) => {
    this.setState({ pincode: e.target.value });
  };

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

    if (this.state.pincode !== "") {
      var pincodePattern = /^\d{6}$/;
      if (!this.state.pincode.match(pincodePattern)) {
        this.setState({
          pincodeRequired: "dispNone",
          pincodeHelpText: "dispBlock",
        });
      } else {
        this.setState({
          pincodeHelpText: "dispNone",
        });
      }
    } else {
      this.setState({
        pincodeRequired: "dispBlock",
        pincodeHelpText: "dispNone",
      });
    }

    //Check if all the fields needed are present fire the REST api
    if (
      this.state.flatBuildingNumRequired === "dispNone" &&
      this.state.localityRequired === "dispNone" &&
      this.state.cityRequired === "dispNone" &&
      this.state.stateRequired === "dispNone" &&
      this.state.pincodeRequired === "dispNone"
    ) {
      this.saveNewAddress();
    }
  };

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
          const rspAddressesInDetail = JSON.parse(this.responseText);
          that.setState({
            value: 0,
          });
          that.getDeliveryAddresses();
          console.log(rspAddressesInDetail);
        } else {
          console.log(this.responseText);
        }
      }
    );
    xhrSaveNewDeliveryAddressesMethod.open(
      "POST",
      this.state.apiUrl + "address"
    );

    xhrSaveNewDeliveryAddressesMethod.setRequestHeader(
      "Content-Type",
      "application/json"
    );

    xhrSaveNewDeliveryAddressesMethod.setRequestHeader(
      "authorization",
      "Bearer " + sessionStorage.getItem("access-token")
    );

    let requestBody = {};
    requestBody.flat_building_name = this.state.flatBuildingNum;
    requestBody.city = this.state.city;
    requestBody.locality = this.state.locality;
    requestBody.pincode = this.state.pincode;
    requestBody.state_uuid = this.state.selectedState.id;

    xhrSaveNewDeliveryAddressesMethod.send(JSON.stringify(requestBody));
  }

  onClickChangeHandler = () => {
    this.setState({
      activeStep: 0,
    });
  };

  onExitingAddressTabHandler = () => {
    this.setState({ onNewAddress: false });
  };

  onNewAddressTabHandler = () => {
    this.setState({ onNewAddress: true });
  };

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
              value={this.state.selectedPaymentOption}
              onChange={this.handlePaymentModeChange}
            >
              {this.state.paymentOptions.map((payMethod, index) => (
                <FormControlLabel
                  value={payMethod}
                  control={<Radio />}
                  label={payMethod}
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

  placeOrderClickHandler = () => {
    // TODO : handler order/success failure cases
    this.setState({
      snackBarMessage: "Order placed successfully! Your order ID is XXX",
      isSnackBarVisible: true,
    });
  };

  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;

    return (
      <div>
        <Header />
        <Grid container spacing={1}>
          <Grid item xs={12} md={8}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                  <StepContent>
                    <Typography>{this.getStepContent(index)}</Typography>
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

          <Grid item xs={4} style={{ marginTop: "20px", marginLeft: "-10px" }}>
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
