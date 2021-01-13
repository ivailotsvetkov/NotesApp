import { Injectable, NgZone } from '@angular/core';
import firebase from 'firebase/app';

// You don't need to import firebase/app either since it's being imported above
import 'firebase/auth';
import 'firebase/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import IdleTimer from '../scripts/IdleTimer';
import { User } from './../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any; // Save logged in user data
  user: Observable<firebase.User>;
  timer: any;

  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    public router: Router
  ) {}

  email() {
    var user = firebase.auth().currentUser;
    var email;
    if (user != null) {
      email = user.email;
      return email;
    }
  }

  updateExpireDate() {
    const expireDate = new Date();
    expireDate.setMinutes(expireDate.getMinutes() + 0.5);
    localStorage.setItem('ExpireDate', expireDate.toLocaleString());
  }

  get isLoggedIn() {
    if (localStorage.getItem('loggedIn') === '1') {
      this.loggedIn.next(true);
    }

    return this.loggedIn.asObservable();
  }

  // Sign in with email/password
  SignIn(email, password) {
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(() => {
        return firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then((result) => {
            this.ngZone.run(() => {
              this.loggedIn.next(true);
              localStorage.setItem('loggedIn', '1');
              console.log('here');
              this.timer = new IdleTimer(
                60, //expired after one minute
                () => {
                  this.SignOut();
                }
              );
              this.router.navigate(['dashboard']);
            });
            this.SetUserData(result.user);
          })
          .catch((error) => {
            window.alert(error.message);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Sign up with email/password
  SignUp(email, password) {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign 
        up and returns promise */
        this.ngZone.run(() => {
          this.router.navigate(['login']);
        });
        this.SetUserData(result.user);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  // Auth logic to run auth providers
  AuthLogin(provider) {
    return firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        });
        this.SetUserData(result.user);
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  // Sign out
  SignOut() {
    console.log('gfd');

    return firebase
      .auth()
      .signOut()
      .then(() => {
        localStorage.removeItem('loggedIn');
        this.loggedIn.next(false);
        this.router.navigate(['login']);
      });
  }
}
