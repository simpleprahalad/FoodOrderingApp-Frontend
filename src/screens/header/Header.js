import React, { Component } from "react";
import "./Header.css";
import {
  Input,
  Button,
  InputAdornment
} from "@material-ui/core";
import {
  Fastfood,
  Search,
  AccountCircle
} from "@material-ui/icons";
import { withStyles } from '@material-ui/core/styles';

// Custom Styles
const styles = (theme => ({
  searchBox: {
    'color': 'white',
    '&:after': {
      borderBottom: '2px solid white'
    },
    "align-self": "flex-start",
  }
}));

class Header extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className="inner-container">
        <Fastfood className="logo" fontSize="large" htmlColor="white" />
        <div className="search-container">
          <Input className={classes.searchBox} id="username" type="search"
            startAdornment={
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            }
            placeholder="Search by Restuarnt Name"
          />
        </div>
        <Button className="login-button" size="medium" variant="contained">
          <AccountCircle /> &nbsp; LOGIN
            </Button>
      </div>
    );
  }
}

export default withStyles(styles)(Header);
