import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import App from './components/App';

console.log(Cookies.get('tabIndex'));
ReactDOM.render(<App storage={Cookies} />,
  document.getElementById('index'));
