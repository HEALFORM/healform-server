const express = require('express');
const router = express.Router();
const axios = require('axios');
const Sentry = require('@sentry/node');

const acuity = 'https://' + process.env.ACUITY_API_USER + ':' + process.env.ACUITY_API_PASSWORD + '@' + process.env.ACUITY_API_URL;

/* ===============================================================
   GET /user/:email/appointments
=============================================================== */
/**
 * Get all scheduled appointments by specific e-mail.
 * @route GET /user/:email/appointments
 * @group Artists API - Manage artists and performers.
 * @returns {object} 200 - An array of user info
 * @returns {Error} default - Unexpected error
 */
router.get('/user/:email/appointments', async (req, res) => {
  const email = req.params.email;
  const url = acuity + '/appointments?email=' + email;

  if (!email) {
    res.json({
      success: false,
      message: 'Es wurde keine E-Mail Adresse an der Server übermittelt.'
    });
    } else {
      try {
        const response = await axios.get(url);
        res.status(200).json(response.data);
      } catch (error) {
        Sentry.captureException(error);
        res.json({
          success: false,
          message: 'Die Termine konnten nicht geladen werden.'
        });
        throw error;
      }
  }
});

module.exports = router;
