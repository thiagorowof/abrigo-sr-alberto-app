import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from 'firebase';


class App extends Component {

  getInitialState(){
    return { loggedIn: 'false' };
  }

  constructor(){
    super();
    this.state = {
      loggedIn: 'false',
      email: '',
      senha: '',
      messages: []
    };
  }

  componentDidMount(){
  }

  componentWillMount(){
    this.authenticateUser();
    /* Create reference to messages in Firebase Database */
    let messagesRef = firebase.database().ref('messages').orderByKey().limitToLast(100);
    messagesRef.on('child_added', snapshot => {
      /* Update React state when message is added at Firebase Database */
      let message = { text: snapshot.val(), id: snapshot.key };
      this.setState({ messages: [message].concat(this.state.messages) });
    })
  }
  addMessage(e){
    e.preventDefault(); // <- prevent form submit from reloading the page
    /* Send the message to Firebase */
    firebase.database().ref('messages').push( this.inputEl.value );
    this.inputEl.value = ''; // <- clear the input
  }

  removeMessage(event){
    event.preventDefault(); // <- prevent form submit from reloading the page
    /* Send the message to Firebase */
    console.log(event.target.value);
    // firebase.database().ref('/messages/' + event.target.value).remove();
  }



  handleChange(event) {
    // event.preventDefault();
    if (event.target.id === "email") {
      this.setState({email: event.target.value});
      console.log(event.target.id, event.target.value);
    }
    else{
      this.setState({senha: event.target.value})
      console.log(event.target.id, event.target.value);
    }
  }

  handleLogIn(event){
    event.preventDefault();

    var email = this.state.email;
    var password = this.state.senha;

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // ERROR HANDLING
      // var errorCode = error.code;
      // var errorMessage = error.message;

      // [... error handling ...]

    });

    this.setState({ loggedIn: 'true' });

  }

  createUser(event){
    event.preventDefault();

    var email = this.state.email;
    var password = this.state.senha;

    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      // var errorMessage = error.message;
      alert("Usuário não criado" + errorCode)

      // ...
    });
  }

  logout(){
    firebase.auth().signOut().then(() => {
      console.log("deslogado");
    }, function(error) {
    // An error happened.
    });
  }

  authenticateUser(x){
    //CHECKING IF SIGNED IN
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // USER IS SIGNED IN
        console.log('authenticateUser(): true');
        this.setState({ loggedIn: "true" });
      }
      else {
        // USER IS SIGNED OUT
        console.log('authenticateUser(): false');
        this.setState({ loggedIn: "false" });
      }
    });
  }

  whichWindowToShow() {
    if (this.state.loggedIn === 'true'){
      return (
        <div className="App">
        <button id="logout" name="logout" onClick={this.logout}>Logout</button>

        <form onSubmit={this.addMessage.bind(this)}>
          <input type="text" placeholder="Gravar no BD" ref={ el => this.inputEl = el }/>
          <input type="submit" className="gravarBanco" value="gravarBanco"/>
          <h3>Infos do banco de dados:</h3>
          <ul>{this.state.messages.map( message => <li key={message.id}><button id="signin" name="signin" onClick={this.removeMessage.bind(message.text)}>remover</button>{message.text}</li>)}
          </ul>
        </form>
        </div>

      );
    }
    else if (this.state.loggedIn === 'unknow'){
      return (
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>Welcome to React</h2>
            <h1>{this.state.messages[1]}</h1>
          </div>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
          <form onSubmit={this.addMessage.bind(this)}>
            <input type="text" ref={ el => this.inputEl = el }/>
            <input type="submit"/>
            <ul>{this.state.messages.map( message => <li key={message.id}>{message.text}</li> )}
            </ul>
          </form>
        </div>
      );
    }
    else {
      return (
        <div className="App">
          <h3>Login</h3>
          <form>
            <input type="text" id="email" name="email" placeholder="email" value={this.state.email} onChange={this.handleChange.bind(this)}/>
            <input type="password" id="password" name="password" placeholder="password" value={this.state.senha} onChange={this.handleChange.bind(this)}/>
            <button id="signin" name="signin" onClick={this.handleLogIn.bind(this)}>Login</button>
            <button id="criar" name="criar" onClick={this.createUser.bind(this)}>Criar usuário</button>
          </form>
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        { this.whichWindowToShow() }
      </div>
    );
  }
}

export default App;
