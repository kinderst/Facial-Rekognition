import React from 'react';
import ReactDOM from 'react-dom';
//import createHistory from 'history/createBrowserHistory';
import { BrowserRouter } from 'react-router-dom';
//import './index.css';
import App from './App';
//import registerServiceWorker from './registerServiceWorker';

// const history = createHistory({
// 	basename: process.env.PUBLIC_URL,
// });

ReactDOM.render((
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <App />
  </BrowserRouter>
), document.getElementById('root'));
//registerServiceWorker();