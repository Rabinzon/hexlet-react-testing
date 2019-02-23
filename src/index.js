import React from 'react';
import ReactDOM from 'react-dom';
import { JssProvider } from 'react-jss';
import App from './Containers/App';

ReactDOM.render(
  <JssProvider>
    <App />
  </JssProvider>,
  document.getElementById('index'),
);
