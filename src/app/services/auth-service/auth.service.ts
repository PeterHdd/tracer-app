import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  confirmationResult: firebase.auth.ConfirmationResult;

  constructor(private auth: AngularFireAuth) { }

  public signInWithPhoneNumber(recaptchaVerifier, phoneNumber) {
    return new Promise<any>((resolve, reject) => {
      this.auth.signInWithPhoneNumber(phoneNumber, recaptchaVerifier)
        .then((confirmationResult) => {
          this.confirmationResult = confirmationResult;
          resolve(confirmationResult);
        }).catch((error) => {
          console.log(error);
          reject('SMS not sent');
        });
    });
  }
  public async enterVerificationCode(code) {
    return new Promise<any>((resolve, reject) => {
      this.confirmationResult.confirm(code).then(async (result) => {
        console.log(result);
        const user = result.user;
        resolve(user);
      }).catch((error) => {
        reject(error.message);
      });

    });
  }

  public retrieveId(){
    return new Promise<firebase.User>((resolve, reject) => {
     this.auth.currentUser.then((result: firebase.User) => {
        console.log(result);
        resolve(result);
     });
    });
  }

  public async logout(){
   return await this.auth.signOut();
  }
}