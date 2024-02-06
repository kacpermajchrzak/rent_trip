import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<firebase.User | null>;

  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {
    this.user$ = afAuth.authState;
  }

  register(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  signOut() {
    return this.afAuth.signOut();
  }

  getCurrentUser() {
    return this.afAuth.authState;
  }

  getCurrentUser1() {
    return this.afAuth.currentUser;
  }

  setPersistence(type: 'local' | 'session' | 'none') {
    let persistence;

    switch (type) {
      case 'local':
        persistence = firebase.auth.Auth.Persistence.LOCAL;
        break;
      case 'session':
        persistence = firebase.auth.Auth.Persistence.SESSION;
        break;
      case 'none':
        persistence = firebase.auth.Auth.Persistence.NONE;
        break;
    }

    return this.afAuth.setPersistence(persistence);
  }

  getUserRole(uid: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.firestore.collection('users').doc(uid).valueChanges().subscribe({
        next: (user: any) => {
          resolve(user.role || 'guest');
        },
        error: reject
      });
    });
  }
}