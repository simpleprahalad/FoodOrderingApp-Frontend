import React, { Component } from "react";
import Header from "../header/Header";
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

  handlePaymentModeChange = (e) => {
    this.setState({ selectedPaymentOption: e.target.value });
  };

  componentWillMount = () => {
    this.getPaymentMethods();
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
                    There are no saved addresses! You can save an address using
                    the 'New Address' tab or using your ‘Profile’ menu option.
                  </p>
                )}
              </div>
            </TabPanel>
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
