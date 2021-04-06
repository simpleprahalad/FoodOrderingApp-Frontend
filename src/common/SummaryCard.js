import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRupeeSign, faStopCircle } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 400,
  },
  margin: {
    margin: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: "start",
  },
  vegIcon: {
    color: "#5A9A5A",
  },
  nonVegIcon: {
    color: "red",
  },
  inrIcon: {
    color: theme.palette.text.secondary,
  },
}));

export default function SummaryCard(props) {
  const classes = useStyles();
  const inrSymbol = (
    <FontAwesomeIcon icon={faRupeeSign} className={classes.inrIcon} />
  );

  function calculateNetTotal() {
    return props.billedItems
      .map((item) => item.qty * item.price)
      .reduce((total, val) => total + val)
      .toFixed(2);
  }

  function BillableItemRow(billedItem) {
    return (
      <React.Fragment>
        <Grid item xs={6}>
          <FontAwesomeIcon
            icon={faStopCircle}
            className={
              billedItem.isVeg === "true" ? classes.vegIcon : classes.nonVegIcon
            }
          />
          <Typography
            className={classes.paper}
            variant="body1"
            component="span"
            color="textSecondary"
          >
            {billedItem.itemName}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography
            className={classes.paper}
            variant="body1"
            component="span"
            color="textSecondary"
          >
            {billedItem.qty}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          {inrSymbol}
          <Typography
            className={classes.paper}
            variant="body1"
            component="span"
            color="textSecondary"
          >
            {(billedItem.qty * billedItem.price).toFixed(2)}
          </Typography>
        </Grid>
      </React.Fragment>
    );
  }

  function BillableItemGrid() {
    return (
      <React.Fragment>
        <Grid container spacing={1}>
          {props.billedItems.map((billedItem) => (
            <Grid container item>
              <BillableItemRow {...billedItem} />
            </Grid>
          ))}
        </Grid>
      </React.Fragment>
    );
  }

  function NetBillableItemRow(props) {
    return (
      <React.Fragment>
        <Grid item xs={6}>
          <Typography
            className={classes.paper}
            variant="body1"
            component="span"
          >
            {props.text}
          </Typography>
        </Grid>
        <Grid item xs={3} />
        <Grid item xs={3}>
          <FontAwesomeIcon icon={faRupeeSign} className={classes.inrIcon} />
          <Typography
            className={classes.paper}
            variant="body1"
            component="span"
          >
            {props.value}
          </Typography>
        </Grid>
      </React.Fragment>
    );
  }

  function NetBillableItemGrid() {
    return (
      <React.Fragment>
        <Grid container spacing={1}>
          <Grid container item>
            <NetBillableItemRow text="Net Amount" value={calculateNetTotal()} />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }

  return (
    <Card className={classes.root}>
      <CardHeader title="Summary" />
      <CardContent>
        <Typography
          className={classes.margin}
          variant="h6"
          color="textSecondary"
          component="p"
        >
          {props.billedRestaurant}
        </Typography>

        <BillableItemGrid />
        <br />
        <Divider />
        <br />
        <NetBillableItemGrid />
      </CardContent>
      <CardActions disableSpacing>
        <Button
          fullWidth="true"
          variant="contained"
          size="large"
          color="primary"
          className={classes.margin}
          onClick={props.placeOrderClickHandler}
        >
          Place Order
        </Button>
      </CardActions>
    </Card>
  );
}
