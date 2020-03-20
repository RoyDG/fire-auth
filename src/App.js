/* eslint-disable no-undef */
import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';


firebase.initializeApp(firebaseConfig)

function App() {

  const [user, setUser] = useState({
    isSignIn:false,
    name: '',
    email: '',
    photo: ''
  })

  const provider = new firebase.auth.GoogleAuthProvider();

  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
    .then(result => {

    const {displayNames,photoURL,email} = result.user;
    const signedInUser = {
      isSignedIn: true,
      name: displayNames,
      email: email,
      photo: photoURL
    }
    setUser(signedInUser)
    console.log(displayNames,photoURL,email)
    })
    .catch (error => {
      console.log(error);
      console.log(error.message);
    })
  }
  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(function () {
      const signedOutUser = {
        isSignedIn: false,
        name: '',
        email: '',
        photo: '',
        password:'',
        error: '',
        isValid: false,
        existingUser: false
        
      }
      setUser(signedOutUser)
      
    })
    .catch(function (error) {
      
    });
  }
  const is_vaild_email = email=> /(.+)@(.+){2,}\.(.+){2,}/.test(email);
  const hasNumber = input => /\d/.test(input)
  const switchForm = event => {
    const createdUser = { ...user };
    createdUser.existingUser = event.target.checked;
    createdUser.error = '';
    setUser(createdUser);
  }
  

  const handleChange = event => {
    const newUserInfo = {
      ...user
    };

    let isValid = true;

    if (event.target.name === 'email'){
      isValid = is_vaild_email(event.target.value);
    }
    if (event.target.name === "password"){
      isValid = event.target.value.length > 8 && hasNumber(event.target.va);

    }
    newUserInfo[event.target.name] = event.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);

  }
  const createAccount = (event) => {
    if (user.isValid){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(response => {
        console.log(response);
        const createdUser = {...user};
        createdUser.isSignedIn = true;
        createdUser.error = '';
        setUser(createdUser);
      })   
      .catch(error => {
        console.log(error.message);
        const createdUser = { ...user };
        createdUser.isSignedIn = false;
        createdUser.error = error.message
        setUser(createdUser);
      })
    }
    event.preventDefault();
    event.target.reset();
  }

  const signInUser = event => {
    if (user.isValid) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(response => {
          console.log(response);
          const createdUser = { ...user };
          createdUser.isSignedIn = true;
          createdUser.error = '';
          setUser(createdUser);
        })
        .catch(error => {
          console.log(error.message);
          const createdUser = { ...user };
          createdUser.isSignedIn = false;
          createdUser.error = error.message
          setUser(createdUser);
        })
      }
    event.preventDefault();
    event.target.reset();
  }

  return (
    <div className="App">
    
      {user.isSignedIn ? 
        <button onClick={handleSignOut}>Sign Out</button> :
        <button onClick={handleSignIn}>Sign in</button>
    }
    
    {
      user.isSignedIn && 
      <div>
          <p> Welcome, {user.name}</p>
          <p> Your Email: {user.email}</p>
          <img src={user.photo} alt=""/>     
      </div>
    }
      <h1>User Authentication</h1>
      <input type="checkbox" name="switchForm" id='switchForm' onChange={switchForm} />
      <label htmlFor="switchForm">Return User</label>

      <form style = {{display: user.existingUser ? 'block' : 'none'}} onSubmit={signInUser}>
        <input type="text" onBlur={handleChange} name="name" placeholder="your name" required />
        <br />
        <input type="password" onBlur={handleChange} name="password" placeholder="
        your password" required />
        <br />
        <input type='submit' value='sign in' />
      </form>

      <form style={{ display: user.existingUser ? 'none' : 'block' }} onSubmit={createAccount}>
        <input type="text" onBlur={handleChange} name="name" placeholder="your name" required />
        <br/>
        <input type="text" onBlur={handleChange} name="email" placeholder="your email" required/>
        <br/>
        <input type="password" onBlur={handleChange} name ="password" placeholder="
        your password" required/>
        <br/>
        <input type='submit' value='create account'/>
        </form>
        {
          user.error && <p style = {{color:'red'}}>{user.error}</p>
        }
      </div>
  );   
}

export default App;
