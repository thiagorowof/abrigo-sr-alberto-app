import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import * as firebase from 'firebase';

//Remover essa apikey do repositorio publico....segurança....
var config = {
    apiKey: "AIzaSyAacCErG7E9PKebnAvW4PZ23nqlOQ7Mypw",
    authDomain: "abrigo-sr-alberto.firebaseapp.com",
    databaseURL: "https://abrigo-sr-alberto.firebaseio.com",
    projectId: "abrigo-sr-alberto",
    storageBucket: "abrigo-sr-alberto.appspot.com",
    messagingSenderId: "117792895934"
  };
  firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
