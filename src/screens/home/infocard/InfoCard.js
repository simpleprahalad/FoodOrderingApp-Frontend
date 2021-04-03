import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { Container, Grid, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    margin: theme.spacing(1),
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  button: {
    background: "#EACC5E",
  },
}));

export default function InfoCard(props) {
  const classes = useStyles();

  const starIcon = <FontAwesomeIcon icon={faStar} />;

  const ratingString = () => {
    return (
      props.avg_rating.toString() + " (" + props.rating_count.toString() + ")"
    );
  };

  const itemTypes = () => {
    let finalString = props.item_types.map((item) => item).toString();
    return finalString.toString().substring(0, finalString.length - 1);
  };

  return (
    <Card className={classes.root}>
      <CardMedia
        className={classes.media}
        image={props.restaurant_image_url}
        title="Resturant Name"
      />
      <CardHeader title={props.restaurant_name} />
      <br />
      <CardHeader subheader={itemTypes()} />
      <br />
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
              {ratingString()}
            </Button>
          </Grid>
          <Grid item>
            <Container>
              <FontAwesomeIcon icon={faRupeeSign} />
              <Typography variant="h6" component="span">
                {props.pricing} for two
              </Typography>
            </Container>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
}
