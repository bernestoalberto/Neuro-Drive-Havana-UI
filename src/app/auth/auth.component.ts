import { Component, OnInit, inject } from '@angular/core';
import {   Auth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  UserCredential } from '@angular/fire/auth';

import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  private _auth = inject(Auth);
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  byGoogle(): Promise<UserCredential> {
    return signInWithPopup(this._auth, new GoogleAuthProvider());
  }

  signup(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(
      this._auth,
      email.trim(),
      password.trim()
    );
  }

  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(
        this._auth,
        email.trim(),
        password.trim()
      );
    }

}
