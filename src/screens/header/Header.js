import React, { Component } from "react";
import "./Header.css";
import {
  Input,
  Button,
  InputAdornment,
  Tabs,
  Tab,
  Typography,
  FormControl,
  FormHelperText,
  InputLabel
} from "@material-ui/core";
import {
  Fastfood,
  Search,
  AccountCircle
} from "@material-ui/icons";
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Modal from "react-modal";

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

//Modal style
const TabContainer = function (props) {
  return (
    <Typography component="div" style={{ padding: 0, textAlign: 'center' }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
}

const customStyles = {
  content: {
    top: '50%',
    left: '48%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    minWidth: '310px'
  }
};

class Header extends Component {

  constructor() {
    super();
    this.state = {
      modalIsOpen: false,
      value: 0,
      contactNumber: "",
      contactNumberRequired: "dispNone",
      password: "",
      passwordRequired: "dispNone",
      loginPassword: "",
      loginPasswordRequired: "dispNone",
      firstname: "",
      firstnameRequired: "dispNone",
      lastname: "",
      lastnameRequired: "dispNone",
      email: "",
      emailRequired: "dispNone",
      signupPassword: "",
      signupPasswordRequired: "dispNone",
      contact: "",
      contactRequired: "dispNone"
    };
  }

  openModalHandler = () => {
    this.setState({ value: 0 })
    this.setState({ modalIsOpen: true });
  }

  closeModalHandler = () => {
    this.setState({ modalIsOpen: false });
    this.setState({ contactNumberRequired: "dispNone" })
    this.setState({ passwordRequired: "dispNone" })
  }

  tabChangeHandler = (event, value) => {
    this.setState({ value });
  }

  loginClickHandler = () => {
    this.state.contactNumber === "" ? this.setState({ contactNumberRequired: "dispBlock" }) : this.setState({ contactNumberRequired: "dispNone" });
    this.state.password === "" ? this.setState({ passwordRequired: "dispBlock" }) : this.setState({ passwordRequired: "dispNone" });
  }

  inputContactNumberChangeHandler = (e) => {
    this.setState({ contactNumber: e.target.value });
  }

  inputPasswordChangeHandler = (e) => {
    this.setState({ password: e.target.value });
  }

  signupClickHandler = () => {
    this.state.firstname === "" ? this.setState({ firstnameRequired: "dispBlock" }) : this.setState({ firstnameRequired: "dispNone" });
    this.state.lastname === "" ? this.setState({ lastnameRequired: "dispBlock" }) : this.setState({ lastnameRequired: "dispNone" });
    this.state.email === "" ? this.setState({ emailRequired: "dispBlock" }) : this.setState({ emailRequired: "dispNone" });
    this.state.signupPassword === "" ? this.setState({ signupPasswordRequired: "dispBlock" }) : this.setState({ signupPasswordRequired: "dispNone" });
    this.state.contact === "" ? this.setState({ contactRequired: "dispBlock" }) : this.setState({ contactRequired: "dispNone" });
  }

  inputFirstNameChangeHandler = (e) => {
    this.setState({ firstname: e.target.value });
  }

  inputLastNameChangeHandler = (e) => {
    this.setState({ lastname: e.target.value });
  }

  inputEmailChangeHandler = (e) => {
    this.setState({ email: e.target.value });
  }

  inputSignupPasswordChangeHandler = (e) => {
    this.setState({ signupPassword: e.target.value });
  }

  inputContactChangeHandler = (e) => {
    this.setState({ contact: e.target.value });
  }

  render() {
    const { classes } = this.props;
    return (
      //Header UI with logo, search box and login icon
      <div>
        <div className="inner-container">
          <Fastfood className="logo" fontSize="large" htmlColor="white" />
          <div className="search-container">
            <Input className={classes.searchBox} id="contactNumber" type="search"
              startAdornment={
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              }
              placeholder="Search by Restuarnt Name"
            />
          </div>
          <Button className="login-button" size="medium" variant="contained" onClick={this.openModalHandler}>
            <AccountCircle /> &nbsp; LOGIN
            </Button>
        </div>
        {/* Login and signup modal */}
        <Modal ariaHideApp={false} isOpen={this.state.modalIsOpen} contentLabel="Login" onRequestClose={this.closeModalHandler} style={customStyles}>
          <Tabs className="tabs" value={this.state.value} onChange={this.tabChangeHandler}>
            <Tab label="Login" />
            <Tab label="Signup" />
          </Tabs>
          {this.state.value === 0 &&
            <TabContainer>
              <FormControl required>
                <InputLabel htmlFor="contactNumber">Contact No.</InputLabel>
                <Input id="contactNumber" type="text" contactNumber={this.state.contactNumber} onChange={this.inputContactNumberChangeHandler} />
                <FormHelperText className={this.state.contactNumberRequired}>
                  <span className="red">required</span>
                </FormHelperText>
              </FormControl>
              <br /><br />
              <FormControl required>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input id="password" type="password" password={this.state.password} onChange={this.inputPasswordChangeHandler} />
                <FormHelperText className={this.state.passwordRequired}>
                  <span className="red">required</span>
                </FormHelperText>
              </FormControl>
              <br /><br />
              <Button variant="contained" color="primary" onClick={this.loginClickHandler}>LOGIN</Button>
            </TabContainer>}

          {this.state.value === 1 &&
            <TabContainer>
              <FormControl required>
                <InputLabel htmlFor="firstname">First Name</InputLabel>
                <Input id="firstname" type="text" firstname={this.state.firstname} onChange={this.inputFirstNameChangeHandler} />
                <FormHelperText className={this.state.firstnameRequired}>
                  <span className="red">required</span>
                </FormHelperText>
              </FormControl>
              <br /><br />
              <FormControl required>
                <InputLabel htmlFor="lastname">Last Name</InputLabel>
                <Input id="lastname" type="text" lastname={this.state.lastname} onChange={this.inputLastNameChangeHandler} />
                <FormHelperText className={this.state.lastnameRequired}>
                  <span className="red">required</span>
                </FormHelperText>
              </FormControl>
              <br /><br />
              <FormControl required>
                <InputLabel htmlFor="email">Email</InputLabel>
                <Input id="email" type="text" email={this.state.email} onChange={this.inputEmailChangeHandler} />
                <FormHelperText className={this.state.emailRequired}>
                  <span className="red">required</span>
                </FormHelperText>
              </FormControl>
              <br /><br />
              <FormControl required>
                <InputLabel htmlFor="signupPassword">Password</InputLabel>
                <Input id="signupPassword" type="password" signuppassword={this.state.signupPassword} onChange={this.inputSignupPasswordChangeHandler} />
                <FormHelperText className={this.state.signupPasswordRequired}>
                  <span className="red">required</span>
                </FormHelperText>
              </FormControl>
              <br /><br />
              <FormControl required>
                <InputLabel htmlFor="contact">Contact No.</InputLabel>
                <Input id="contact" type="text" contact={this.state.contact} onChange={this.inputContactChangeHandler} />
                <FormHelperText className={this.state.contactRequired}>
                  <span className="red">required</span>
                </FormHelperText>
              </FormControl>
              <br /><br />
              <Button variant="contained" color="primary" onClick={this.signupClickHandler}>SIGNUP</Button>
            </TabContainer>}
        </Modal>
      </div>
    );
  }
}

export default withStyles(styles)(Header);
