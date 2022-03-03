/* ===================
   Import Environment
=================== */
require('custom-env').env(true);

/* ===================
   Import Node Modules
=================== */
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const port = process.env.PORT || 8080;
const morgan = require('morgan');
const favicon = require('express-favicon');
const { version } = require('./package.json');
require('dotenv').config();

/* ===================
   MongoDB config
=================== */
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const config = require('./config/database');

/* ===================
   Import routes
=================== */
const acuity = require('./routes/acuity');

/* ===================
   Error Tracking
=================== */
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
Sentry.init({
  dsn: "https://813626f335474aa380e4b4a58cdf211e@o685353.ingest.sentry.io/6115692",
  environment: process.env.NODE_ENV,
  release: version,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({
      app,
    }),
  ],
  tracesSampleRate: 1.0,
});

/* ===================
   Database Connection
=================== */
mongoose.connect(
  config.uri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      Sentry.captureException(err);
      throw err;
    } else {
      console.log('Connected to ' + config.db);
    }
  }
);

/* ===================
   Middlewares
=================== */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('tiny'));
}
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

/* ===================
   Swagger API Docs
=================== */
const expressSwagger = require('express-swagger-generator')(app);
let options = {
  swaggerDefinition: {
    info: {
      description:
        '-',
      title: 'HEALFORM API',
      version: version,
    },
    host: process.env.HOST,
    basePath: '',
    produces: ['application/json', 'application/xml'],
    schemes: ['https'],
    securityDefinitions: {
      JWT: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: '',
      },
    },
  },
  basedir: __dirname,
  files: ['./routes/**/*.js'],
};
expressSwagger(options);

/* ===================
   Routes
=================== */
app.use('/acuity', acuity);

/* ===================
   Render base pages
=================== */
app.get('*', (req, res) => {
  res.sendStatus(200);
});

/* ===================
   Start Server on Port 8080
=================== */
app.listen(port, () => {
  console.log('Listening on port ' + port + ' in ' + process.env.NODE_ENV + ' mode');
});
