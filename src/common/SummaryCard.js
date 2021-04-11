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

//Custom styles
const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 400,
  },
  margin: {
    margin: theme.spacing(1),
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

//Re-usable functional component
export default function SummaryCard(props) {
  const classes = useStyles();
  const inrSymbol = (
    <FontAwesomeIcon icon={faRupeeSign} className={classes.inrIcon} />
  );

  //Billable Item
  function BillableItemRow(billedItem) {
    return (
      <React.Fragment>
        <Grid item xs={8}>
          <FontAwesomeIcon
            icon={faStopCircle}
            className={
              billedItem.type === "VEG" ? classes.vegIcon : classes.nonVegIcon
            }
          />
          <Typography
            variant="body1"
            component="span"
            color="textSecondary"
            style={{ marginLeft: "5px" }}
          >
            {billedItem.name.replace(/(\w)(\w*)/g, function (g0, g1, g2) {
              return g1.toUpperCase() + g2.toLowerCase();
            })}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography
            variant="body1"
            component="span"
            color="textSecondary"
            style={{ marginLeft: "-20px" }}
          >
            {billedItem.quantity}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography
            variant="body1"
            component="span"
            color="textSecondary"
            style={{ float: "right" }}
          >
            {inrSymbol} {}
            {billedItem.price.toFixed(2)}
          </Typography>
        </Grid>
      </React.Fragment>
    );
  }

  //Billable grid - Collection of Billable items
  function BillableItemGrid() {
    return (
      <React.Fragment>
        <Grid container spacing={1}>
          {props.billedItems.map((billedItem) => (
            <Grid container item key={billedItem.item_id}>
              <BillableItemRow {...billedItem} />
            </Grid>
          ))}
        </Grid>
      </React.Fragment>
    );
  }

  //Net-billable item.
  function NetBillableItemRow(props) {
    return (
      <React.Fragment>
        <Grid item xs={6}>
          <Typography variant="body1" component="span">
            {props.text}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography
            variant="body1"
            component="span"
            style={{ float: "right" }}
          >
            {inrSymbol} {}
            {props.value}
          </Typography>
        </Grid>
      </React.Fragment>
    );
  }

  //Net-billable item wrapper
  function NetBillableItemGrid() {
    return (
      <React.Fragment>
        <Grid container spacing={1}>
          <Grid container item>
            <NetBillableItemRow
              text="Net Amount"
              value={props.totalBillAmount.toFixed(2)}
            />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }

  //The final UI layout
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
          fullWidth={true}
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
