import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import './assets/stylus/main.styl';

import App from './components/App';

ReactDOM.render(
  <AppContainer>
    <App />
  </AppContainer>,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept('./components/App', () => {
    /* eslint-disable global-require */
    const NewApp = require('./components/App').default;
    /* eslint-disable global-require */

    ReactDOM.render(
      <AppContainer>
        <NewApp />
      </AppContainer>,
      document.getElementById('root'),
    );
  });
}
