/* ===================
   Import Node Modules
=================== */
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose
const bcrypt = require('bcrypt-nodejs'); // A native JS bcrypt library for NodeJS
var moment = require('moment');

const env = require('./../env');

// Create authenticated Authy and Twilio API clients
const authy = require('authy')(process.env.authyKey);
const client = require('twilio')(process.env.twilioAccountSid, process.env.twilioAuthToken);

// Validate Function to check e-mail length
let emailLengthChecker = email => {
  // Check if e-mail exists
  if (!email) {
    return false; // Return error
  } else {
    // Check the length of e-mail string
    if (email.length < 5 || email.length > 30) {
      return false; // Return error if not within proper length
    } else {
      return true; // Return as valid e-mail
    }
  }
};

// Validate Function to check if valid e-mail format
let validEmailChecker = email => {
  // Check if e-mail exists
  if (!email) {
    return false; // Return error
  } else {
    // Regular expression to test for a valid e-mail
    const regExp = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    return regExp.test(email); // Return regular expression test results (true or false)
  }
};

// Array of Email Validators
const emailValidators = [
  // First Email Validator
  {
    validator: emailLengthChecker,
    message: 'E-mail must be at least 5 characters but no more than 30'
  },
  // Second Email Validator
  {
    validator: validEmailChecker,
    message: 'Must be a valid e-mail'
  }
];

// Validate Function to check PHONE length
let phoneLengthChecker = phone => {
  // Check if phone exists
  if (!phone) {
    return false; // Return error
  } else {
    // Check the length of e-mail string
    if (phone.length < 7 || phone.length > 25) {
      return false; // Return error if not within proper length
    } else {
      return true; // Return as valid email
    }
  }
};

// Validate Function to check if valid PHONE format
let validPhoneChecker = phone => {
  // Check if e-mail exists
  if (!phone) {
    return false; // Return error
  } else {
    // Regular expression to test for a valid e-mail
    const regExp = new RegExp(
      /^[0-9 ()+-]+$/
    );
    return regExp.test(phone); // Return regular expression test results (true or false)
  }
};

// Array of PHONE Validators
const phoneValidators = [
  // First phone Validator
  {
    validator: phoneLengthChecker,
    message: 'phone must be at least 5 characters but no more than 30'
  },
  // Second phone Validator
  {
    validator: validPhoneChecker,
    message: 'Must be a valid phone'
  }
];

// Validate Function to check username length
let usernameLengthChecker = username => {
  // Check if username exists
  if (!username) {
    return false; // Return error
  } else {
    // Check length of username string
    if (username.length < 3 || username.length > 25) {
      return false; // Return error if does not meet length requirement
    } else {
      return true; // Return as valid username
    }
  }
};

// Validate Function to check if valid username format
let validUsername = username => {
  // Check if username exists
  if (!username) {
    return false; // Return error
  } else {
    // Regular expression to test if username format is valid
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    return regExp.test(username); // Return regular expression test result (true or false)
  }
};

// Array of Username validators
const usernameValidators = [
  // First Username validator
  {
    validator: usernameLengthChecker,
    message: 'Username must be at least 3 characters but no more than 15'
  },
  // Second username validator
  {
    validator: validUsername,
    message: 'Username must not have any special characters'
  }
];

// Validate Function to check password length
let passwordLengthChecker = password => {
  // Check if password exists
  if (!password) {
    return false; // Return error
  } else {
    // Check password length
    if (password.length < 8 || password.length > 65) {
      return false; // Return error if passord length requirement is not met
    } else {
      return true; // Return password as valid
    }
  }
};

// Validate Function to check if valid password format
let validPassword = password => {
  // Check if password exists
  if (!password) {
    return false; // Return error
  } else {
    // Regular Expression to test if password is valid format
    const regExp = new RegExp(
      /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/
    );
    return regExp.test(password); // Return regular expression test result (true or false)
  }
};

// Array of Password validators
const passwordValidators = [
  // First password validator
  {
    validator: passwordLengthChecker,
    message: 'Password must be at least 8 characters but no more than 35'
  },
  // Second password validator
  {
    validator: validPassword,
    message: 'Must have at least one uppercase, lowercase, special character, and number'
  }
];

// Validate Function to check e-mail length
let firstNameLengthChecker = firstName => {
  // Check if e-mail exists
  if (!firstName) {
    return false; // Return error
  } else {
    // Check the length of e-mail string
    if (firstName.length < 3 || firstName.length > 50) {
      return false; // Return error if not within proper length
    } else {
      return true; // Return as valid e-mail
    }
  }
};

// Validate Function to check if valid e-mail format
let validFirstNameChecker = firstName => {
  // Check if e-mail exists
  if (!firstName) {
    return false; // Return error
  } else {
    // Regular expression to test for a valid e-mail
    const regExp = new RegExp(
      /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/
    );
    return regExp.test(firstName); // Return regular expression test results (true or false)
  }
};

// Array of Email Validators
const firstNameValidators = [
  // First Email Validator
  {
    validator: firstNameLengthChecker,
    message: 'firstName must be at least 5 characters but no more than 50'
  },
  // Second Email Validator
  {
    validator: validFirstNameChecker,
    message: 'Must be a valid fistname'
  }
];

// Validate Function to check e-mail length
let lastNameLengthChecker = lastName => {
  // Check if e-mail exists
  if (!lastName) {
    return false; // Return error
  } else {
    // Check the length of e-mail string
    if (lastName.length < 3 || lastName.length > 50) {
      return false; // Return error if not within proper length
    } else {
      return true; // Return as valid e-mail
    }
  }
};

// Validate Function to check if valid e-mail format
let validLastNameChecker = lastName => {
  // Check if e-mail exists
  if (!lastName) {
    return false; // Return error
  } else {
    // Regular expression to test for a valid e-mail
    const regExp = new RegExp(
      /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/
    );
    return regExp.test(lastName); // Return regular expression test results (true or false)
  }
};

// Array of Email Validators
const lastNameValidators = [
  // First Email Validator
  {
    validator: lastNameLengthChecker,
    message: 'lastName must be at least 5 characters but no more than 50'
  },
  // Second Email Validator
  {
    validator: validLastNameChecker,
    message: 'Must be a valid lastName'
  }
];

// Validate Function to check e-mail length
let streetLengthChecker = street => {
  // Check if e-mail exists
  if (!street) {
    return false; // Return error
  } else {
    // Check the length of e-mail string
    if (street.length < 3 || street.length > 50) {
      return false; // Return error if not within proper length
    } else {
      return true; // Return as valid e-mail
    }
  }
};

// Validate Function to check if valid e-mail format
let validStreetChecker = street => {
  // Check if e-mail exists
  if (!street) {
    return false; // Return error
  } else {
    // Regular expression to test for a valid e-mail
    const regExp = new RegExp(
      /^([\S\s]+?)\s+([\d-\s]*?)\s*([\w])?$/
    );
    return regExp.test(street); // Return regular expression test results (true or false)
  }
};

// Array of Email Validators
const streetValidators = [
  // First Email Validator
  {
    validator: streetLengthChecker,
    message: 'street must be at least 5 characters but no more than 50'
  },
  // Second Email Validator
  {
    validator: validStreetChecker,
    message: 'Must be a valid street'
  }
];

// Validate Function to check e-mail length
let cityLengthChecker = city => {
  // Check if e-mail exists
  if (!city) {
    return false; // Return error
  } else {
    // Check the length of e-mail string
    if (city.length < 3 || city.length > 50) {
      return false; // Return error if not within proper length
    } else {
      return true; // Return as valid e-mail
    }
  }
};

// Validate Function to check if valid e-mail format
let validCityChecker = city => {
  // Check if e-mail exists
  if (!city) {
    return false; // Return error
  } else {
    // Regular expression to test for a valid e-mail
    const regExp = new RegExp(
      /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/
    );
    return regExp.test(city); // Return regular expression test results (true or false)
  }
};

// Array of Email Validators
const cityValidators = [
  // First Email Validator
  {
    validator: cityLengthChecker,
    message: 'city must be at least 5 characters but no more than 50'
  },
  // Second Email Validator
  {
    validator: validCityChecker,
    message: 'Must be a valid city'
  }
];

// Validate Function to check e-mail length
let postcodeLengthChecker = postcode => {
  // Check if e-mail exists
  if (!postcode) {
    return false; // Return error
  } else {
    // Check the length of e-mail string
    if (postcode.length < 5 || postcode.length > 5) {
      return false; // Return error if not within proper length
    } else {
      return true; // Return as valid e-mail
    }
  }
};

// Validate Function to check if valid e-mail format
let validPostcodeChecker = postcode => {
  // Check if e-mail exists
  if (!postcode) {
    return false; // Return error
  } else {
    // Regular expression to test for a valid e-mail
    const regExp = new RegExp(
      /\b\d{5}\b/
    );
    return regExp.test(postcode); // Return regular expression test results (true or false)
  }
};

// Array of Email Validators
const postcodeValidators = [
  // First Email Validator
  {
    validator: postcodeLengthChecker,
    message: 'postcode must be at least 5 characters but no more than 50'
  },
  // Second Email Validator
  {
    validator: validPostcodeChecker,
    message: 'Must be a valid postcode'
  }
];

// Validate Function to check e-mail length
let countryLengthChecker = country => {
  // Check if e-mail exists
  if (!country) {
    return false; // Return error
  } else {
    // Check the length of e-mail string
    if (country.length < 3 || country.length > 50) {
      return false; // Return error if not within proper length
    } else {
      return true; // Return as valid e-mail
    }
  }
};

// Validate Function to check if valid e-mail format
let validCountryChecker = country => {
  // Check if e-mail exists
  if (!country) {
    return false; // Return error
  } else {
    // Regular expression to test for a valid e-mail
    const regExp = new RegExp(
      /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/
    );
    return regExp.test(country); // Return regular expression test results (true or false)
  }
};

// Array of Email Validators
const countryValidators = [
  // First Email Validator
  {
    validator: countryLengthChecker,
    message: 'country must be at least 5 characters but no more than 50'
  },
  // Second Email Validator
  {
    validator: validCountryChecker,
    message: 'Must be a valid country'
  }
];

// Validate Function to check if valid password format
let birthdateValidChecker = birthdate => {
  if (!birthdate) {
    return false; // Return error
  } else {
    // Regular expression to test for a valid e-mail
    const regExp = new RegExp(
      /^\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})\s*$/
    );
    return regExp.test(birthdate); // Return regular expression test results (true or false)
  }
};

// Validate Function to check if valid password format
let birthdateAgeChecker = birthdate => {
  // Check if password exists
  if (!birthdate) {
    console.log('hdf');
    return false; // Return error
  } else {
    console.log(birthdate);
    const rawAge = moment(birthdate, 'DD.MM.YYYY');
    const age = moment().diff(rawAge, 'years');
    console.log(age);
    if (age >= 18) {
      return true; // Return error
    } else {
      return false; // Return as invalid email
    }
  }
};

// Array of Password validators
const birthdateValidators = [
  // First password validator
  {
    validator: birthdateValidChecker,
    message: 'Überprüfe deine Eingabe beimBday'
  },
  {
    validator: birthdateAgeChecker,
    message: 'Du musst 18 Jahre oder älter sein'
  }
];

// User Model Definition
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: emailValidators
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    validate: phoneValidators
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: usernameValidators
  },
  password: {
    type: String,
    required: true,
    validate: passwordValidators
  },
  firstName: {
    type: String,
    required: true,
    validate: firstNameValidators
  },
  lastName: {
    type: String,
    required: true,
    validate: lastNameValidators
  },
  street: {
    type: String,
    required: true,
    validate: streetValidators
  },
  city: {
    type: String,
    required: true,
    validate: cityValidators
  },
  postcode: {
    type: Number,
    required: true,
    validate: postcodeValidators
  },
  country: {
    type: String,
    required: true,
    validate: countryValidators
  },
  birthdate: {
    type: String,
    required: true,
    validate: birthdateValidators
  },
  authyID: {
    type: String
  },
  stripeID: {
    type: String
  }
}, {
  timestamps: true
});

// Schema Middleware to Encrypt Password
userSchema.pre('save', function (next) {
  // Ensure password is new or modified before applying encryption
  if (!this.isModified('password')) return next();

  // Apply encryption
  bcrypt.hash(this.password, null, null, (err, hash) => {
    if (err) return next(err); // Ensure no errors
    this.password = hash; // Apply encryption to password
    next(); // Exit middleware
  });
});

// Methods to compare password to encrypted password upon login
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password); // Return comparison of login password to password in database (true or false)
};

// Export Module/Schema
module.exports = mongoose.model('User', userSchema);