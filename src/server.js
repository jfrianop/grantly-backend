require('dotenv').config();
const express = require('express');
const { connect } = require('./database');
const routesConfig = require('./routes.config');
const expressConfig = require('./express');
const { transporter, verify } = require('./utils/mailer');

const port = process.env.PORT || 8080;
const app = express();
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(port, () => {
  expressConfig(app);
  connect();
  routesConfig(app);
  verify(transporter);

  console.log(`listening on http://localhost:${port} in ${NODE_ENV}`);
});

module.exports = app;
