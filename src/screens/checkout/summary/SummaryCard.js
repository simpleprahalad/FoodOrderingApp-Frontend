import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRupeeSign, faStopCircle } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 500,
    justify: "center",
  },

  margin: {
    margin: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: "start",
  },
}));

export default function SummaryCard() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const inrIcon = <FontAwesomeIcon icon={faRupeeSign} />;
  const stopCircleIcon = <FontAwesomeIcon icon={faStopCircle} />;

  function BillableItemRow() {
    return (
      <React.Fragment>
        <Grid item xs={6}>
          <FontAwesomeIcon icon={faStopCircle} />
          <Typography
            className={classes.paper}
            variant="body1"
            component="span"
            color="textSecondary"
          >
            Hakka Noodles
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography
            className={classes.paper}
            variant="body1"
            component="span"
            color="textSecondary"
          >
            4
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <FontAwesomeIcon icon={faRupeeSign} />
          <Typography
            className={classes.paper}
            variant="body1"
            component="span"
            color="textSecondary"
          >
            400
          </Typography>
        </Grid>
      </React.Fragment>
    );
  }

  function BillableItemGrid() {
    return (
      <React.Fragment>
        <Grid container spacing={1}>
          <Grid container item xs={10} spacing={4}>
            <BillableItemRow />
          </Grid>
          <Grid container item xs={10} spacing={4}>
            <BillableItemRow />
          </Grid>
          <Grid container item xs={10} spacing={4}>
            <BillableItemRow />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }

  function NetBillableItemRow() {
    return (
      <React.Fragment>
        <Grid>
          <Typography
            className={classes.paper}
            variant="body1"
            component="span"
          >
            Net Amount
          </Typography>
        </Grid>
        <Grid>
          <FontAwesomeIcon icon={faRupeeSign} />
          <Typography
            className={classes.paper}
            variant="body1"
            component="span"
          >
            653
          </Typography>
        </Grid>
      </React.Fragment>
    );
  }

  function NetBillableItemGrid() {
    return (
      <React.Fragment>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          item
        >
          <NetBillableItemRow />
        </Grid>
      </React.Fragment>
    );
  }

  return (
    <Card className={classes.root}>
      <CardHeader title="Summary" />
      <CardContent>
        <Typography variant="body1" color="textSecondary" component="p">
          Restaurant Name
        </Typography>
        <BillableItemGrid />
        <Divider />
        <NetBillableItemGrid />
      </CardContent>
      <CardActions disableSpacing>
        <Button
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
