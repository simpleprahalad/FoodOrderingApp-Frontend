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
  InputLabel,
  Snackbar,
  Menu,
  MenuItem,
  MenuList,
} from "@material-ui/core";
import { Fastfood, Search, AccountCircle } from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Modal from "react-modal";
import { Link } from "react-router-dom";

// Custom Styles
const styles = (theme) => ({
  searchBox: {
    color: "white",
    "&:after": {
      borderBottom: "2px solid white",
    },
    "align-self": "flex-start",
  },
  menuItems: {
    "text-decoration": "none",
    color: "black",
    "text-decoration-underline": "none",
  },
  menuList: {
    padding: "0px",
    textDecorationLine: "none",
    outline: "none",
  },
});

//Modal style
const TabContainer = function (props) {
  return (
    <Typography component="div" style={{ padding: 0, textAlign: "center" }}>
      {props.children}
    </Typography>
  );
};

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    minWidth: "310px",
  },
};

class Header extends Component {
  constructor() {
    super();

    this.state = {
      ...Header.initialState,
      modalIsOpen: false,
      value: 0,
      isSnackBarVisible: false,
      snackBarMessage: "",
      isProfileMenuOpen: false,
      anchorEl: null,
      isLoggedIn:
        sessionStorage.getItem("access-token") === null ? false : true,
      loggedInUsername: sessionStorage.getItem("customer-name"),
      searchText: "",
    };
  }

  static get initialState() {
    const value = {
      contactnumber: "",
      loginContactRequired: "dispNone",
      loginPassword: "",
      loginPasswordRequired: "dispNone",
      firstname: "",
      firstnameRequired: "dispNone",
      lastname: "",
      email: "",
      emailRequired: "dispNone",
      signupPassword: "",
      signupPasswordRequired: "dispNone",
      signupcontact: "",
      signupcontactRequired: "dispNone",
      invalidEmail: "dispNone",
      invalidPasswordFormat: "dispNone",
      invalidcontactnumber: "dispNone",
      invalidLoginContact: "dispNone",
      contactAlreadyInUse: "dispNone",
      invalidPassword: "dispNone",
      notRegisteredContact: "dispNone",
    };
    return value;
  }

  componentDidMount() {
    localStorage.removeItem("savedState");
  }

  openModalHandler = () => {
    const savedState = JSON.parse(localStorage.getItem("savedState"));
    this.setState({ savedState });
    this.setState({ modalIsOpen: true });
  };

  closeModalHandler = () => {
    this.setState({
      ...Header.initialState,
      modalIsOpen: false,
    });
    localStorage.removeItem("savedState");
  };

  tabChangeHandler = (event, value) => {
    this.setState({
      value: value,
    });
  };

  inputcontactnumberChangeHandler = (e) => {
    this.setState({ contactnumber: e.target.value });
  };

  inputPasswordChangeHandler = (e) => {
    this.setState({ loginPassword: e.target.value });
  };

  loginClickHandler = () => {
    if (this.loginFormValidation()) {
      let dataLogin = null;
      let xhrLogin = new XMLHttpRequest();
      let that = this;
      xhrLogin.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          //Successs
          if (xhrLogin.status === 200) {
            let loginResponse = JSON.parse(this.responseText);
            sessionStorage.setItem("uuid", JSON.parse(this.responseText).id);
            sessionStorage.setItem(
              "access-token",
              xhrLogin.getResponseHeader("access-token")
            );
            sessionStorage.setItem("customer-name", loginResponse.first_name);
            that.setState({
              ...that.state,
              isLoggedIn: true,
              isSnackBarVisible: true,
              snackBarMessage: "Logged in successfully!",
              loggedInUsername: loginResponse.first_name,
            });
            //Close modal on successfull login
            that.closeModalHandler();
            //Error
          } else if (xhrLogin.status === 401) {
            let loginResponse = JSON.parse(this.responseText);
            let notRegisteredContact = "dispNone";
            let invalidPassword = "dispNone";
            if (loginResponse.code === "ATH-001") {
              notRegisteredContact = "dispBlock";
            }
            if (loginResponse.code === "ATH-002") {
              invalidPassword = "dispBlock";
            }
            that.setState({
              ...that.state,
              notRegisteredContact: notRegisteredContact,
              invalidPassword: invalidPassword,
            });
            localStorage.setItem("savedState", JSON.stringify(that.state));
          }
        }
      });
      xhrLogin.open("POST", this.props.baseUrl + "customer/login");
      xhrLogin.setRequestHeader(
        "Authorization",
        "Basic " +
          window.btoa(this.state.contactnumber + ":" + this.state.loginPassword)
      );
      xhrLogin.setRequestHeader("Content-Type", "application/json");
      xhrLogin.setRequestHeader("Cache-Control", "no-cache");
      xhrLogin.send(dataLogin);
    }
  };

  signupClickHandler = () => {
    if (this.signUpFormValidation()) {
      //Populate post data
      let data = JSON.stringify({
        contact_number: this.state.signupcontact,
        email_address: this.state.email,
        first_name: this.state.firstname,
        last_name: this.state.lastName,
        password: this.state.signupPassword,
      });
      let xhrSignUp = new XMLHttpRequest();
      let that = this;
      xhrSignUp.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          //Success
          if (xhrSignUp.status === 201) {
            that.setState({
              ...that.state,
              value: 0,
              isSnackBarVisible: true,
              snackBarMessage: "Registered successfully! Please login now!",
            });
          }
          //Error
          if (xhrSignUp.status === 400) {
            let responseData = JSON.parse(this.responseText);
            if (responseData.code === "SGR-001") {
              that.setState({
                ...that.state,
                contactAlreadyInUse: "dispBlock",
              });
            }
          }
        }
        localStorage.setItem("savedState", JSON.stringify(this.state));
      });
      xhrSignUp.open("POST", this.props.baseUrl + "customer/signup");
      xhrSignUp.setRequestHeader("Content-Type", "application/json");
      xhrSignUp.setRequestHeader("Cache-Control", "no-cache");
      xhrSignUp.send(data);
    }
  };

  inputFirstNameChangeHandler = (e) => {
    this.setState({ firstname: e.target.value });
  };

  inputLastNameChangeHandler = (e) => {
    this.setState({ lastname: e.target.value });
  };

  inputEmailChangeHandler = (e) => {
    this.setState({ email: e.target.value });
  };

  inputSignupPasswordChangeHandler = (e) => {
    this.setState({ signupPassword: e.target.value });
  };

  inputsignupcontactChangeHandler = (e) => {
    this.setState({ signupcontact: e.target.value });
  };

  //Validating login from on Login button click
  loginFormValidation = () => {
    let loginContactRequired = "dispNone";
    let invalidLoginContact = "dispNone";
    let loginPasswordRequired = "dispNone";

    let isFormValid = true;

    //Contact validation
    if (this.state.contactnumber === "") {
      loginContactRequired = "dispBlock";
      isFormValid = false;
    } else if (this.state.contactnumber !== "") {
      var pattern = new RegExp(/^[0-9\b]+$/);
      if (!pattern.test(this.state.contactnumber)) {
        invalidLoginContact = "dispBlock";
        isFormValid = false;
      }
    }

    //Password validation
    if (this.state.loginPassword === "") {
      loginPasswordRequired = "dispBlock";
      isFormValid = false;
    }

    this.setState({
      loginContactRequired: loginContactRequired,
      invalidLoginContact: invalidLoginContact,
      loginPasswordRequired: loginPasswordRequired,
    });
    return isFormValid;
  };

  //Validating sign form on Signup button click
  signUpFormValidation = () => {
    let firstnameRequired = "dispNone";
    let emailRequired = "dispNone";
    let signupPasswordRequired = "dispNone";
    let signupcontactRequired = "dispNone";
    let invalidPasswordFormat = "dispNone";
    let invalidcontactnumber = "dispNone";
    let invalidEmail = "dispNone";
    let isSignupFormValidated = true;

    //First name validation
    if (this.state.firstname === "") {
      firstnameRequired = "dispBlock";
      isSignupFormValidated = false;
    }

    //Email validation
    if (this.state.email === "") {
      emailRequired = "dispBlock";
      isSignupFormValidated = false;
    } else if (this.state.email !== "") {
      let pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      );
      if (!pattern.test(this.state.email)) {
        invalidEmail = "dispBlock";
        isSignupFormValidated = false;
      }
    }

    //Contact number validation
    if (this.state.signupcontact === "") {
      signupcontactRequired = "dispBlock";
      isSignupFormValidated = false;
    } else if (this.state.signupcontact !== "") {
      let pattern = new RegExp(/^[0-9\b]+$/);
      if (
        !pattern.test(this.state.signupcontact) ||
        this.state.signupcontact.length !== 10
      ) {
        invalidcontactnumber = "dispBlock";
        isSignupFormValidated = false;
      }
    }

    //Password validation
    if (this.state.signupPassword === "") {
      signupPasswordRequired = "dispBlock";
      isSignupFormValidated = false;
    } else if (this.state.signupPassword !== "") {
      if (!this.isValidPassword(this.state.signupPassword)) {
        invalidPasswordFormat = "dispBlock";
        isSignupFormValidated = false;
      }
    }
    this.setState({
      firstnameRequired: firstnameRequired,
      emailRequired: emailRequired,
      signupPasswordRequired: signupPasswordRequired,
      signupcontactRequired: signupcontactRequired,
      invalidcontactnumber: invalidcontactnumber,
      invalidEmail: invalidEmail,
      invalidPasswordFormat: invalidPasswordFormat,
    });
    return isSignupFormValidated;
  };

  //Password strength validation
  isValidPassword = (password) => {
    let lowerCase = false;
    let upperCase = false;
    let number = false;
    let specialCharacter = false;

    if (password.length < 8) {
      return false;
    }

    if (password.match("(?=.*[0-9]).*")) {
      number = true;
    }

    if (password.match("(?=.*[a-z]).*")) {
      lowerCase = true;
    }
    if (password.match("(?=.*[A-Z]).*")) {
      upperCase = true;
    }
    if (password.match("(?=.*[#@$%&*!^]).*")) {
      specialCharacter = true;
    }

    if (lowerCase && upperCase) {
      if (specialCharacter && number) {
        return true;
      }
    } else {
      return false;
    }
    return false;
  };

  snackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({
      ...this.state,
      snackBarMessage: "",
      isSnackBarVisible: false,
    });
  };

  //Profile menu
  openMenu = () =>
    this.setState({
      isProfileMenuOpen: !this.state.isProfileMenuOpen,
    });

  profileMenuClickHandler = (event) => {
    this.setState({ anchorEl: event.currentTarget });
    this.openMenu();
  };

  //Logout
  logoutClickHandler = () => {
    let logoutData = null;
    let that = this;
    let xhrLogout = new XMLHttpRequest();
    xhrLogout.addEventListener("readystatechange", function () {
      if (xhrLogout.readyState === 4 && xhrLogout.status === 200) {
        sessionStorage.removeItem("uuid");
        sessionStorage.removeItem("access-token");
        sessionStorage.removeItem("customer-name");
        that.setState({
          ...that.state,
          isLoggedIn: false,
          isProfileMenuOpen: !that.state.isProfileMenuOpen,
        });
      }
    });

    xhrLogout.open("POST", this.props.baseUrl + "customer/logout");
    xhrLogout.setRequestHeader(
      "authorization",
      "Bearer " + sessionStorage.getItem("access-token")
    );
    xhrLogout.send(logoutData);
  };

  //Search handler
  searchTextChangeHandler = (event) => {
    if (!(event.target.value === "")) {
      let restaurantData = null;
      let xhrSearchRestaurant = new XMLHttpRequest();
      let that = this;
      xhrSearchRestaurant.addEventListener("readystatechange", function () {
        if (
          xhrSearchRestaurant.readyState === 4 &&
          xhrSearchRestaurant.status === 200
        ) {
          var restaurants = JSON.parse(this.responseText).restaurants || [];
          that.props.restaurantsBySearch(restaurants, true);
        } else {
          that.props.restaurantsBySearch([], true);
        }
      });

      xhrSearchRestaurant.open(
        "GET",
        this.props.baseUrl + "restaurant/name/" + event.target.value
      );
      xhrSearchRestaurant.setRequestHeader("Content-Type", "application/json");
      xhrSearchRestaurant.setRequestHeader("Cache-Control", "no-cache");
      xhrSearchRestaurant.send(restaurantData);
    } else {
      this.props.restaurantsBySearch([], false);
    }
  };

  render() {
    const { classes } = this.props;
    return (
      //Header UI with logo, search box and login icon
      <div>
        <div className="inner-container">
          <Fastfood className="logo" fontSize="large" htmlColor="white" />
          {/*Show serach bar if flag is true*/}
          {this.props.isSearchBarVisible && (
            <div className="search-container">
              <Input
                className={classes.searchBox}
                id="search-box"
                type="search"
                startAdornment={
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                }
                placeholder="Search by Restuarant Name"
                onChange={this.searchTextChangeHandler}
              />
            </div>
          )}
          {this.state.isLoggedIn !== true ? (
            <Button
              className="login-button"
              size="medium"
              variant="contained"
              onClick={this.openModalHandler}
            >
              <AccountCircle /> &nbsp; LOGIN
            </Button>
          ) : (
            <Button
              className="profile-button"
              size="medium"
              variant="text"
              onClick={this.profileMenuClickHandler}
            >
              <AccountCircle /> &nbsp; {this.state.loggedInUsername}
            </Button>
          )}
          <Menu
            className="profile-menu"
            anchorEl={this.state.anchorEl}
            open={this.state.isProfileMenuOpen}
            onClose={this.profileMenuClickHandler}
          >
            <MenuList className={classes.menuList}>
              <Link
                className={classes.menuItems}
                to={"/profile"}
                underline="none"
                color={"default"}
              >
                <MenuItem className={classes.menuItems} disableGutters={false}>
                  My profile
                </MenuItem>
              </Link>
              <MenuItem onClick={this.logoutClickHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>

        {/* Login and signup modal */}
        <Modal
          ariaHideApp={false}
          isOpen={this.state.modalIsOpen}
          contentLabel="Login"
          onRequestClose={this.closeModalHandler}
          style={customStyles}
        >
          <Tabs
            className="tabs"
            value={this.state.value}
            onChange={this.tabChangeHandler}
          >
            <Tab label="Login" />
            <Tab label="Signup" />
          </Tabs>
          {this.state.value === 0 && (
            <TabContainer>
              <form>
                <FormControl required>
                  <InputLabel htmlFor="contactnumber">Contact No.</InputLabel>
                  <Input
                    id="contactnumber"
                    type="text"
                    contactnumber={this.state.contactnumber}
                    value={this.state.contactnumber}
                    onChange={this.inputcontactnumberChangeHandler}
                  />
                  <FormHelperText className={this.state.loginContactRequired}>
                    <span className="red">required</span>
                  </FormHelperText>
                  <FormHelperText className={this.state.invalidLoginContact}>
                    <span className="red">Invalid Contact</span>
                  </FormHelperText>
                </FormControl>
                <br />
                <br />
                <FormControl required>
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <Input
                    id="password"
                    type="password"
                    password={this.state.loginPassword}
                    value={this.state.loginPassword}
                    onChange={this.inputPasswordChangeHandler}
                    autoComplete="password"
                  />
                  <FormHelperText className={this.state.loginPasswordRequired}>
                    <span className="red">required</span>
                  </FormHelperText>
                  <FormHelperText className={this.state.invalidPassword}>
                    <span className="red">Invalid Credentials</span>
                  </FormHelperText>
                  <FormHelperText className={this.state.notRegisteredContact}>
                    <span className="red">
                      This contact number has not been registered!
                    </span>
                  </FormHelperText>
                </FormControl>
                <br />
                <br />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.loginClickHandler}
                >
                  LOGIN
                </Button>
              </form>
            </TabContainer>
          )}

          {this.state.value === 1 && (
            <TabContainer>
              <form>
                <FormControl required>
                  <InputLabel htmlFor="firstname">First Name</InputLabel>
                  <Input
                    id="firstname"
                    type="text"
                    firstname={this.state.firstname}
                    value={this.state.firstname}
                    onChange={this.inputFirstNameChangeHandler}
                  />
                  <FormHelperText className={this.state.firstnameRequired}>
                    <span className="red">required</span>
                  </FormHelperText>
                </FormControl>
                <br />
                <br />
                <FormControl>
                  <InputLabel htmlFor="lastname">Last Name</InputLabel>
                  <Input
                    id="lastname"
                    type="text"
                    lastname={this.state.lastname}
                    value={this.state.lastname}
                    onChange={this.inputLastNameChangeHandler}
                  />
                </FormControl>
                <br />
                <br />
                <FormControl required>
                  <InputLabel htmlFor="email">Email</InputLabel>
                  <Input
                    id="email"
                    type="text"
                    email={this.state.email}
                    value={this.state.email}
                    onChange={this.inputEmailChangeHandler}
                  />
                  <FormHelperText className={this.state.emailRequired}>
                    <span className="red">required</span>
                  </FormHelperText>
                  <FormHelperText className={this.state.invalidEmail}>
                    <span className="red">Invalid Email</span>
                  </FormHelperText>
                </FormControl>
                <br />
                <br />
                <FormControl required>
                  <InputLabel htmlFor="signupPassword">Password</InputLabel>
                  <Input
                    id="signupPassword"
                    type="password"
                    signuppassword={this.state.signupPassword}
                    value={this.state.signupPassword}
                    onChange={this.inputSignupPasswordChangeHandler}
                    autoComplete="signupPassword"
                  />
                  <FormHelperText className={this.state.signupPasswordRequired}>
                    <span className="red">required</span>
                  </FormHelperText>
                  <FormHelperText className={this.state.invalidPasswordFormat}>
                    <span className="red">
                      Password must contain at least one capital letter, one
                      small letter, one number, and one special character
                    </span>
                  </FormHelperText>
                </FormControl>
                <br />
                <br />
                <FormControl required>
                  <InputLabel htmlFor="contact">Contact No.</InputLabel>
                  <Input
                    id="contact"
                    type="text"
                    signupcontact={this.state.signupcontact}
                    value={this.state.signupcontact}
                    onChange={this.inputsignupcontactChangeHandler}
                  />
                  <FormHelperText className={this.state.signupcontactRequired}>
                    <span className="red">required</span>
                  </FormHelperText>
                  <FormHelperText className={this.state.invalidcontactnumber}>
                    <span className="red">
                      Contact No. must contain only numbers and must be 10
                      digits long
                    </span>
                  </FormHelperText>
                  <FormHelperText className={this.state.contactAlreadyInUse}>
                    <span className="red">
                      This contact number is already registered! Try other
                      contact number.
                    </span>
                  </FormHelperText>
                </FormControl>
                <br />
                <br />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.signupClickHandler}
                >
                  SIGNUP
                </Button>
              </form>
            </TabContainer>
          )}
        </Modal>

        {/* Snack bar  for toast message*/}
        <div>
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            style={{
              color: "red",
            }}
            open={this.state.isSnackBarVisible}
            autoHideDuration={3000}
            onClose={this.snackBarClose}
            TransitionComponent={this.state.transition}
            ContentProps={{
              "aria-describedby": "message-id",
            }}
            message={<span id="message-id">{this.state.snackBarMessage}</span>}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Header);
