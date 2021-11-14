import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Person } from 'src/app/model/user';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  result: Observable<Person[]>;
  private authenticatedUserId: string;
  constructor(private firestore: AngularFirestore) { }


  public setAuthenticateUserId(authenticatedUserId: string){
    this.authenticatedUserId = authenticatedUserId;
  }

  public getAuthenticatedUserId(){
    return this.authenticatedUserId;
  }

  public addNewPerson(person: Person,uid: string){
    person.dateOfMeeting = new Date(person.dateOfMeeting).toDateString();
    return new Promise<any>((resolve, reject) => {
      this.firestore.collection('people').add(Object.assign({},person)).then((res)=> {
          resolve('success');
        }).catch((error) => {
          console.log(error);
          reject('Sorry, Service is not available');
        });
    });
  }

  public retrievePeople(authenticatedUserId: string): Observable<Person[]>{
    return this.firestore.collection<Person>('people', ref => ref.where('authenticatedUserId', '==',authenticatedUserId)).valueChanges();
  }
}
