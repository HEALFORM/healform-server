const express = require('express');
const router = express.Router();
const Sentry = require('@sentry/node');
const fetch = require("node-fetch");
const _ = require('lodash')
const moment = require('moment')

const acuity = 'https://' + process.env.ACUITY_API_USER + ':' + process.env.ACUITY_API_PASSWORD + '@' + process.env.ACUITY_API_URL;

/* ===============================================================
   GET /acuity/:email/appointments
=============================================================== */
/**
 * Get all scheduled appointments by specific e-mail.
 * @route GET /acuity/:email/appointments
 * @group Acuity API - Get all the information for appointments by specific user.
 * @returns {object} 200 - An array of appointments info
 * @returns {Error} default - Unexpected error
 */
router.get('/:email/appointments', async (req, res) => {
  const email = req.params.email;
  const url = acuity + '/appointments?email=' + email;

  if (!email) {
    res.json({
      success: false,
      message: 'Es wurde keine E-Mail Adresse an den Server übermittelt.'
    });
    } else {
    fetch(url)
      .then(response => response.json())
      .then(json => {
        res.status(200).json(json);
      })
      .catch(error => {
        Sentry.captureException(error);
        res.json({
          success: false,
          message: 'Die Termine konnten nicht geladen werden.'
        });
        throw error;
      });
  }
});

/* ===============================================================
   GET /acuity/:email/appointments/next
=============================================================== */
/**
 * Get the next scheduled appointment by specific e-mail.
 * @route GET /acuity/:email/appointments/next
 * @group Appointments API - Get all the information for appointments by specific user.
 * @returns {object} 200 - An array of user info
 * @returns {Error} default - Unexpected error
 */
router.get('/:email/appointments/next', async (req, res) => {
  const email = req.params.email;
  const url = acuity + '/appointments?email=' + email;

  if (!email) {
    res.json({
      success: false,
      message: 'Es wurde keine E-Mail Adresse an den Server übermittelt.'
    });
  } else {
    fetch(url)
      .then(response => response.json())
      .then(json => {
        var nextAppointments = json.filter(x => Date.parse(x.datetime) > new Date());
        var nextAppointments = _.sortBy(nextAppointments, function (o) {
          return new moment(o.datetime)
        })
        res.status(200).json(nextAppointments[0]);
      })
      .catch(error => {
        Sentry.captureException(error);
        res.json({
          success: false,
          message: 'Die Termine konnten nicht geladen werden.'
        });
        throw error;
      });
  }
});

/* ===============================================================
   GET /acuity/:email/appointments/future
=============================================================== */
/**
 * Get the future scheduled appointment by specific e-mail.
 * @route GET /acuity/:email/appointments/future
 * @group Appointments API - Get all the information for appointments by specific user.
 * @returns {object} 200 - An array of user info
 * @returns {Error} default - Unexpected error
 */
router.get('/:email/appointments/future', async (req, res) => {
  var email = req.params.email;
  const url = acuity + '/appointments?email=' + email;
  // Search database for all blog posts
  fetch(url)
    .then(response => response.json())
    .then(json => {
      var futureAppointments = json.filter(x => Date.parse(x.datetime) > new Date());
      var futureAppointments = _.sortBy(futureAppointments, function (o) {
        return new moment(o.datetime)
      })
      res.status(200).json(futureAppointments);
    })
    .catch(error => {
      Sentry.captureException(error);
      res.json({
        success: false,
        message: 'Die Termine konnten nicht geladen werden.'
      });
      throw error;
    });
});

/* ===============================================================
    Route: Get all past Appointments by User
=============================================================== */
router.get('/:email/appointments/past', async (req, res) => {
  var email = req.params.email;
  const url = acuity + '/appointments?email=' + email;
  // Search database for all blog posts
  fetch(url)
    .then(response => response.json())
    .then(json => {
      var pastAppointments = json.filter(x => Date.parse(x.datetime) < new Date());
      var pastAppointments = _.sortBy(pastAppointments, function (o) {
        return new moment(o.datetime)
      }).reverse();
      res.status(200).json(pastAppointments);
    })
    .catch(error => {
      Sentry.captureException(error);
      res.json({
        success: false,
        message: 'Die Termine konnten nicht geladen werden.'
      });
      throw error;
    });
});

module.exports = router;
