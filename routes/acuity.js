const express = require('express');

const router = express.Router();
const Sentry = require('@sentry/node');
const fetch = require('node-fetch');

const acuity = `https://${process.env.ACUITY_API_USER}:${process.env.ACUITY_API_PASSWORD}@${process.env.ACUITY_API_URL}`;

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
  const { email } = req.params;
  const url = `${acuity}/appointments?email=${email}`;

  if (!email) {
    res.json({
      success: false,
      message: 'Es wurde keine E-Mail Adresse an den Server übermittelt.',
    });
  } else {
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        res.status(200).json(json);
      })
      .catch((error) => {
        Sentry.captureException(error);
        res.json({
          success: false,
          message: 'Die Termine konnten nicht geladen werden.',
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
  const { email } = req.params;
  const { id } = req.params;
  const url = `${acuity}/appointments/${id}`;

  if (!email) {
    res.json({
      success: false,
      message: 'Es wurde keine E-Mail Adresse an den Server übermittelt.',
    });
  } else if (!id) {
    res.json({
      success: false,
      message: 'Es wurde keine Termin-ID an den Server übermittelt.',
    });
  } else {
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        if (json.email === email) {
          res.status(200).json(json);
        } else {
          res.status(403).json({
            success: false,
            message: 'Du bist nicht berechtigt diesen Termin einzusehen.',
          });
        }
      })
      .catch((error) => {
        Sentry.captureException(error);
        res.json({
          success: false,
          message: 'Der Termin konnte nicht geladen werden.',
        });
        throw error;
      });
  }
});

router.get('/:email/certificates', async (req, res) => {
  const { email } = req.params;
  const url = `${acuity}/certificates?email=${email}`;

  if (!email) {
    res.json({
      success: false,
      message: 'Es wurde keine E-Mail Adresse an den Server übermittelt.',
    });
  } else {
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        res.json(json);
      })
      .catch((error) => {
        Sentry.captureException(error);
        res.json({
          success: false,
          message: 'Die Zertifikate konnten nicht geladen werden.',
        });
        throw error;
      });
  }
});

router.get('/products', async (req, res) => {
  const url = `${acuity}/products`;
  fetch(url)
    .then((response) => response.json())
    .then((json) => {
      res.json(json);
    })
    .catch((error) => {
      Sentry.captureException(error);
      res.json({
        success: false,
        message: 'Die Produkte konnten nicht geladen werden.',
      });
      throw error;
    });
});

router.get('/locations', async (req, res) => {
  const url = `${acuity}/calendars`;
  fetch(url)
    .then((response) => response.json())
    .then((json) => {
      res.json(json);
    });
});

router.get('/availability/dates/:id/:month/:locationId', async (req, res) => {
  const { id } = req.params;
  const { month } = req.params;
  const { locationId } = req.params;
  const url = `${acuity}/availability/dates?appointmentTypeID=${id}&month=${month}&calendarID=${locationId}`;
  fetch(url)
    .then((response) => response.json())
    .then((json) => {
      res.json(json);
    });
});

router.get('/availability/times/:id/:date/:locationId', async (req, res) => {
  const { id } = req.params;
  const { date } = req.params;
  const { locationId } = req.params;
  const url = `${acuity}/availability/times?appointmentTypeID=${id}&date=${date}&calendarID=${locationId}`;
  fetch(url)
    .then((response) => response.json())
    .then((json) => {
      res.json(json);
    });
});

router.get('/appointment-types', async (req, res) => {
  const url = `${acuity}/appointment-types`;
  fetch(url)
    .then((response) => response.json())
    .then((json) => {
      res.json(json);
    });
});

module.exports = router;
