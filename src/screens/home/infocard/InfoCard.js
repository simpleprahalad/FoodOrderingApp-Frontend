import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { Grid, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 280,
    margin: theme.spacing(1),
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  button: {
    background: "#EACC5E",
  },
  ratingContainer: {},
}));

export default function InfoCard(props) {
  const classes = useStyles();
  const starIcon = <FontAwesomeIcon icon={faStar} />;

  return (
    <Card className={classes.root}>
      <CardMedia
        className={classes.media}
        image={props.photo_URL}
        title="Resturant Name"
      />
      <CardHeader title={props.restaurant_name} />
      <CardHeader subheader={props.categories} />
      <CardActions disableSpacing>
        <Grid container justify="space-between">
          <Grid item>
            <Button
              variant="contained"
              aria-label="start"
              className={classes.button}
              startIcon={starIcon}
              color="secondary"
            >
              {props.customer_rating +
                " (" +
                props.number_customers_rated +
                ")"}
            </Button>
          </Grid>
          <Grid item>
            <FontAwesomeIcon icon={faRupeeSign} />
            <Typography variant="h6" component="span">
              {props.average_price} for two
            </Typography>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
}
