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
  Snackbar
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
      loginContactRequired: "dispNone",
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
      signupContact: "",
      signupContactRequired: "dispNone",
      invalidEmail: "dispNone",
      invalidPasswordFormat: "dispNone",
      invalidContactNumber: "dispNone",
      invalidLoginContact: "dispNone",
      contactAlreadyInUse: "dispNone",
      isSnackBarVisible: false,
      snackBarMessage: "",
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

  inputContactNumberChangeHandler = (e) => {
    this.setState({ contactNumber: e.target.value });
  }

  inputPasswordChangeHandler = (e) => {
    this.setState({ loginPassword: e.target.value });
  }

  loginClickHandler = () => {
    if (this.loginFormValidation()) {

    }
  }

  signupClickHandler = () => {
    console.log('I was triggered during componentDidMount')
    if (this.signUpFormValidation()) {
      //Populate post data
      let data = JSON.stringify({
        "contact_number": this.state.signupContact,
        "email_address": this.state.email,
        "first_name": this.state.firstname,
        "last_name": this.state.lastName,
        "password": this.state.signupPassword
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
              snackBarMessage: "Registered successfully! Please login now!"
            })
          }
          //Error
          if (xhrSignUp.status === 400) {
            let responseData = JSON.parse(this.responseText)
            console.log(responseData);
            if (responseData.code === 'SGR-001') {
              that.setState({
                ...that.state,
                contactAlreadyInUse: "dispBlock"
              })
            }
          }
        }
      });
      xhrSignUp.open("POST", "http://localhost:8080/api/" + "customer/signup");
      xhrSignUp.setRequestHeader("Content-Type", "application/json");
      xhrSignUp.setRequestHeader("Cache-Control", "no-cache");
      xhrSignUp.send(data);
    }
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

  inputSignupContactChangeHandler = (e) => {
    this.setState({ signupContact: e.target.value });
  }

  //Validating login from on Login button click
  loginFormValidation = () => {
    let loginContactRequired = "dispNone";
    let invalidLoginContact = "dispNone";
    let loginPasswordRequired = "dispNone";

    let isFormValid = true;

    //Contact validation
    if (this.state.contactNumber === "") {
      loginContactRequired = "dispBlock";
      isFormValid = false;
    }
    else if (this.state.contactNumber !== "") {
      var validator = "[7-9][0-9]{9}";
      if (!this.state.contactNumber.match(validator)) {
        invalidLoginContact = "dispBlock"
        isFormValid = false;
      }
    }

    //Password validation
    if (this.state.loginPassword === "") {
      loginPasswordRequired = "dispBlock"
      isFormValid = false;
    }

    this.setState({
      loginContactRequired: loginContactRequired,
      invalidLoginContact: invalidLoginContact,
      loginPasswordRequired: loginPasswordRequired
    })
    return (isFormValid);
  }

  //Validating sign form on Signup button click
  signUpFormValidation = () => {
    let firstnameRequired = "dispNone";
    let emailRequired = "dispNone";
    let signupPasswordRequired = "dispNone";
    let signupContactRequired = "dispNone";
    let invalidPasswordFormat = "dispNone";
    let invalidContactNumber = "dispNone";
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
    }
    else if (this.state.email !== "") {
      if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(this.state.email))) {
        invalidEmail = "dispBlock"
        isSignupFormValidated = false;
      }
    }

    //Contact number validation
    if (this.state.signupContact === "") {
      signupContactRequired = "dispBlock";
      isSignupFormValidated = false;
    }
    else if (this.state.signupContact !== "") {
      var pattern = new RegExp(/^[0-9\b]+$/);
      if (!pattern.test(this.state.signupContact) || this.state.signupContact.length != 10) {
        invalidContactNumber = "dispBlock"
        isSignupFormValidated = false;
      }
    }

    //Password validation
    if (this.state.signupPassword === "") {
      signupPasswordRequired = "dispBlock";
      isSignupFormValidated = false;
    }
    else if (this.state.signupPassword !== "") {
      if (!this.isValidPassword(this.state.signupPassword)) {
        invalidPasswordFormat = "dispBlock"
        isSignupFormValidated = false;

      }
    }
    this.setState({
      firstnameRequired: firstnameRequired,
      emailRequired: emailRequired,
      signupPasswordRequired: signupPasswordRequired,
      signupContactRequired: signupContactRequired,
      invalidContactNumber: invalidContactNumber,
      invalidEmail: invalidEmail,
      invalidPasswordFormat: invalidPasswordFormat,
    })
    return (isSignupFormValidated);

  }

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
  }

  snackBarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({
      ...this.state,
      snackBarMessage: "",
      isSnackBarVisible: false,
    })
  }

  render() {
    const { classes } = this.props;
    return (
      //Header UI with logo, search box and login icon
      <div>
        <div className="inner-container">
          <Fastfood className="logo" fontSize="large" htmlColor="white" />
          <div className="search-container">
            <Input className={classes.searchBox} id="search-box" type="search"
              startAdornment={
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              }
              placeholder="Search by Restuarant Name"
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
                <FormHelperText className={this.state.loginContactRequired}>
                  <span className="red">required</span>
                </FormHelperText>
                <FormHelperText className={this.state.invalidLoginContact}>
                  <span className="red">Invalid Contact</span>
                </FormHelperText>
              </FormControl>
              <br /><br />
              <FormControl required>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input id="password" type="password" password={this.state.loginPassword} onChange={this.inputPasswordChangeHandler} />
                <FormHelperText className={this.state.loginPasswordRequired}>
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
              <FormControl>
                <InputLabel htmlFor="lastname">Last Name</InputLabel>
                <Input id="lastname" type="text" lastname={this.state.lastname} onChange={this.inputLastNameChangeHandler} />
              </FormControl>
              <br /><br />
              <FormControl required>
                <InputLabel htmlFor="email">Email</InputLabel>
                <Input id="email" type="text" email={this.state.email} onChange={this.inputEmailChangeHandler} />
                <FormHelperText className={this.state.emailRequired}>
                  <span className="red">required</span>
                </FormHelperText>
                <FormHelperText className={this.state.invalidEmail}>
                  <span className="red">Invalid Email</span>
                </FormHelperText>
              </FormControl>
              <br /><br />
              <FormControl required>
                <InputLabel htmlFor="signupPassword">Password</InputLabel>
                <Input id="signupPassword" type="password" signuppassword={this.state.signupPassword} onChange={this.inputSignupPasswordChangeHandler} />
                <FormHelperText className={this.state.signupPasswordRequired}>
                  <span className="red">required</span>
                </FormHelperText>
                <FormHelperText className={this.state.invalidPasswordFormat}>
                  <span className="red">Password must contain at least one capital letter, one small letter, one number, and one special character</span>
                </FormHelperText>
              </FormControl>
              <br /><br />
              <FormControl required>
                <InputLabel htmlFor="contact">Contact No.</InputLabel>
                <Input id="contact" type="text" signupContact={this.state.signupContact} onChange={this.inputSignupContactChangeHandler} />
                <FormHelperText className={this.state.signupContactRequired}>
                  <span className="red">required</span>
                </FormHelperText>
                <FormHelperText className={this.state.invalidContactNumber}>
                  <span className="red">Contact No. must contain only numbers and must be 10 digits long</span>
                </FormHelperText>
                <FormHelperText className={this.state.contactAlreadyInUse}>
                  <span className="red">This contact number is already registered! Try other contact number.</span>
                </FormHelperText>
              </FormControl>
              <br /><br />
              <Button variant="contained" color="primary" onClick={this.signupClickHandler}>SIGNUP</Button>
            </TabContainer>}
        </Modal>

        {/* Snack bar  for toast message*/}
        <div>
          
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            style={{
              color: 'red'
            }}
            open={this.state.isSnackBarVisible}
            autoHideDuration={4000}
            onClose={this.snackBarClose}
            TransitionComponent={this.state.transition}
            ContentProps={{
              'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">{this.state.snackBarMessage}</span>}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Header);
