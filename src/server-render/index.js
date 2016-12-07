import React from 'react';

import App from '../components/App';

import template from './template';

export default (req, res) => {
  res.send(template(
    <App />
  ));
};
