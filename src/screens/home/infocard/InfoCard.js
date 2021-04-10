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
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    "@media screen and (max-width:600px)": {
      width: "40%",
    },
    maxWidth: 260,
    margin: theme.spacing(1),
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  button: {
    color: "#FFFFFF",
    background: "#EACC5E",
    backgroundColor: "#EACC5E",
    "&:hover": {
      //you want this to be the same as the backgroundColor above
      backgroundColor: "#EACC5E",
      cursor: "auto",
    },
  },
  ratingContainer: {},
}));

export default function InfoCard(props) {
  const classes = useStyles();
  const starIcon = <FontAwesomeIcon icon={faStar} />;
  const history = useHistory();

  function navigateToRestaurantDetailsScreen() {
    history.push("/restaurant/" + props.id);
  }

  return (
    <Card className={classes.root} onClick={navigateToRestaurantDetailsScreen}>
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
              className={classes.button}
              startIcon={starIcon}
              color="secondary"
              disableRipple
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
