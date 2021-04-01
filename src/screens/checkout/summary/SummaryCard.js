import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRupeeSign, faStopCircle } from "@fortawesome/free-solid-svg-icons";
import { StoreMallDirectorySharp } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },

  margin: {
    margin: theme.spacing(1),
  },
}));

export default function SummaryCard() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const inrIcon = <FontAwesomeIcon icon={faRupeeSign} />;
  const stopCircleIcon = <FontAwesomeIcon icon={faStopCircle} />;

  return (
    <Card className={classes.root}>
      <CardHeader title="Summary" />

      <CardContent>
        <Typography variant="body1" color="textSecondary" component="p">
          Restaurant Name
        </Typography>

        <List component="nav" className={classes.root} aria-label="contacts">
          <ListItem button>
            <ListItemIcon>{stopCircleIcon}</ListItemIcon>
            <ListItemText primary="Hakka Noodles" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>{stopCircleIcon}</ListItemIcon>
            <ListItemText primary="Chocolate IceCream" />
          </ListItem>
        </List>

        <Typography variant="body1" color="textPrimary" component="span">
          Net Amount
        </Typography>
        {inrIcon}
        <Typography variant="body1" color="textSecondary" component="span">
          122.00
        </Typography>
        <Divider />
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
