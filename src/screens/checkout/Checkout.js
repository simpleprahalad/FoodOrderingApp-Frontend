import React, { Component } from "react";
import Header from "../header/Header";
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
import Card from "@material-ui/core/Card";
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

const styles = (theme) => ({
  root: {
    width: "100%",
  },
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
      existingAddresses: [
        {
          id: 100,
          flat_buil_number: "B113",
          flat_building_name: "SVS Palsm1",
          locality: "Marathalli",
          city: "Bangalore",
          pincode: 560037,
          state: {
            state_name: "Karnataka",
          },
        },
        {
          id: 101,
          flat_buil_number: "B112",
          flat_building_name: "SVS Palsm1",
          locality: "Marathalli",
          city: "Bangalore",
          pincode: 560037,
          state: {
            state_name: "Karnataka",
          },
        },
      ],
      paymentOptions: [],
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
    };
  }

  handleBack = () => {
    this.setState({ activeStep: this.state.activeStep - 1 });
  };

  handleNext = () => {
    this.setState({ activeStep: this.state.activeStep + 1 });
  };

  tabChangeHandler = (event, value) => {
    this.setState({ value });
  };

  displayAddress = () => {
    return this.state.existingAddresses.map((value) => (
      <Card className={this.props.card} key={value.id}>
        <Typography>
          {value.flat_buil_number && (
            <div>
              {value.flat_buil_number}
              <br />
            </div>
          )}

          {value.flat_building_name && (
            <div>
              {value.flat_building_name}
              <br />
            </div>
          )}

          {value.locality && (
            <div>
              {value.locality}
              <br />
            </div>
          )}

          {value.city && (
            <div>
              {value.city}
              <br />
            </div>
          )}

          {value.state.state_name && (
            <div>
              {value.state.state_name}
              <br />
            </div>
          )}

          {value.pincode && (
            <div>
              {value.pincode}
              <br />
            </div>
          )}
        </Typography>
      </Card>
    ));
  };

  getPaymentMethods = () => {
    // TODO : to be received from backend
    const paymentOptions = [
      "Cash on Delivery",
      "Wallet",
      "Net Banking",
      "Debit / Credit Card",
    ];
    this.setState({ paymentOptions: paymentOptions });
  };

  getStates = () => {
    const states = [
      "Karnataka",
      "Odissa",
      "Kerala",
      "Maharastra",
      "MP",
      "Delhi",
      "Haryana",
    ];
    this.setState({ addressStates: states });
  };

  handlePaymentModeChange = (e) => {
    this.setState({ selectedPaymentOption: e.target.value });
  };

  componentWillMount = () => {
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

    this.state.pincode === ""
      ? this.setState({ pincodeRequired: "dispBlock" })
      : this.setState({ pincodeRequired: "dispNone" });
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
                <Tab label="Existing Address" />
                <Tab label="New Address" />
              </Tabs>
            </AppBar>
            {this.state.value === 0 ? (
              <TabPanel value={this.state.value} index={0}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  {this.state.existingAddresses.length > 0 ? (
                    this.displayAddress()
                  ) : (
                    <p style={{ color: "gray", height: 200 }}>
                      There are no saved addresses! You can save an address
                      using the 'New Address' tab or using your ‘Profile’ menu
                      option.
                    </p>
                  )}
                </div>
              </TabPanel>
            ) : (
              <TabPanel value={this.state.value} index={1}>
                <FormControl required>
                  <InputLabel htmlFor="flatBuildNo">
                    Flat / Building No.
                  </InputLabel>
                  <Input
                    id="flatBuildNo"
                    type="text"
                    username={this.state.flatBuildingNum}
                    onChange={this.flatNumChangeHandler}
                  />
                  <FormHelperText
                    className={this.state.flatBuildingNumRequired}
                  >
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
                    {this.state.addressStates.map((stateName, index) => (
                      <MenuItem key={index + stateName} value={stateName}>
                        {stateName}
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

  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;

    return (
      <div className={classes.root}>
        <Header />
        <div>
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
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Checkout);
