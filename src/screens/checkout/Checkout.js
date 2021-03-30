import React, { Component } from "react";
import Header from "../header/Header";
import { withStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";

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

class Checkout extends Component {
  constructor() {
    super();
    this.state = {
      activeStep: 0,
    };
  }

  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;

    return (
      <div className={classes.root}>
        <Header />
        <div>
          {/* <Stepper activeStep={activeStep} orientation="vertical">
            Checkout Component
          </Stepper> */}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Checkout);
