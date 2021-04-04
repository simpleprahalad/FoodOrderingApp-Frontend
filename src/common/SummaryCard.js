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
import coupon from "../assets/CouponFlat50.png";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 420,
  },
  margin: {
    margin: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: "start",
  },
  stopIcon: {
    color: "#5A9A5A",
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

  function calculateSubTotal() {
    return props.billedItems
      .map((item) => item.qty * item.price)
      .reduce((total, val) => total + val);
  }

  function calculateDiscount(discount = 0) {
    return discount * calculateSubTotal();
  }

  function calculateNetTotal(discount = 0) {
    return calculateSubTotal() - calculateDiscount(discount);
  }

  function BillableItemRow(billedItem) {
    return (
      <React.Fragment>
        <Grid item xs={6}>
          <FontAwesomeIcon icon={faStopCircle} className={classes.stopIcon} />
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
            {billedItem.qty * billedItem.price}
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

  function applyButtonClickHandler() {
    console.log("Apply Discount !!!");
    calculateNetTotal(0.5);
  }

  function DiscountCoupons() {
    return (
      <React.Fragment>
        <div
          style={{
            display: "flex",
            direction: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <img
            src={coupon}
            alt={"flat 50"}
            style={{ width: "200px", height: "60px" }}
          />
          <Button
            variant="contained"
            color="default"
            onClick={applyButtonClickHandler}
            style={{ width: "80px", height: "40px" }}
          >
            APPLY
          </Button>
        </div>
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

  function SubtotalItemGrid() {
    return (
      <React.Fragment>
        <Grid container spacing={1}>
          <Grid container item>
            <NetBillableItemRow text="Subtotal" value={calculateSubTotal()} />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }

  function DiscountGrid() {
    return (
      <React.Fragment>
        <Grid container spacing={1}>
          <Grid container item>
            <NetBillableItemRow text="Discount" value={calculateDiscount()} />
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
        <DiscountCoupons />
        <br />
        <SubtotalItemGrid />
        <br />
        <DiscountGrid />
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
        >
          Place Order
        </Button>
      </CardActions>
    </Card>
  );
}
