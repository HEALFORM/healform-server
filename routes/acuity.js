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
   GET /acuity/:email/appointment/:id
=============================================================== */
/**
 * Get detailed appointment information by specific e-mail and ID.
 * @route GET /acuity/:email/appointment/:id
 * @group Acuity API - Get all the information for appointments by specific user.
 * @returns {object} 200 - An array of appointments info
 * @returns {Error} default - Unexpected error
 */
router.get('/:email/appointment/:id', async (req, res) => {
  if (!req.params.id) {
    res.json({
      success: false,
      message: 'No appointment ID was provided.'
    }); // Return error message
  } else {
    if (!req.params.email) {
      res.json({
        success: false,
        message: 'Es wurde keine E-Mail Adresse an den Server übermittelt.'
      });
    } else {
      const id = req.params.id;
      const url = acuity + '/appointments/' + id;
      fetch(url)
        .then(response => response.json())
        .then(json => {
          if (json.email === req.params.email) {
            res.json(json);
          } else {
            res.status(404).json({
              success: false,
              message: 'You are not authorized to edit this apoointment.'
            });
          }
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
  }
});

module.exports = router;
