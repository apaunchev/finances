import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import feather from 'feather-icons';
import './sass/style.scss';
import App from './components/App';

feather.replace({
  'stroke-width': 1,
  width: 24,
  height: 24
});

document.addEventListener('touchstart', function() {}, true);

ReactDOM.render((
  <Router>
    <App />
  </Router>
), document.getElementById('root'));
