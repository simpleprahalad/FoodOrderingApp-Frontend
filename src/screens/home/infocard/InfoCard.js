import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { Grid, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import CardContent from "@material-ui/core/CardContent";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 260,
    margin: theme.spacing(1),
    "&:hover": {
      cursor: "pointer",
    },
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    "@media screen and (max-width:600px)": {
      width: "30%",
    },
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
    },
  },
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
      <CardContent>
        <Typography gutterBottom variant="h6" component="h2">
          {props.restaurant_name}
        </Typography>
        <div>
          <br />
          <Typography style={{ height: "18px" }} variant="body1">
            {props.categories}
          </Typography>
        </div>
        <br />
        <br />
      </CardContent>

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
            <Typography style={{ marginTop: "5px" }}>
              <FontAwesomeIcon icon={faRupeeSign} />
              {props.average_price} for two
            </Typography>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
}
