import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Person, User } from 'src/app/model/user';
import { DatabaseService } from 'src/app/services/database-service/database.service';
import { TracerComponent } from 'src/app/components/component';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-add-person',
  templateUrl: './add-person.page.html',
  styleUrls: ['./add-person.page.scss'],
})
export class AddPersonPage implements OnInit {

  addPersonForm: FormGroup;
  address: string;

    //Geocoder configuration
    geoencoderOptions: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
  authUser: User;
  constructor(private form: FormBuilder,
              private authService: AuthService,
              private geoLocation: Geolocation,
              private navCtrl: NavController,
              private dbService: DatabaseService,
              private components: TracerComponent,
              private nativeGeoCoder: NativeGeocoder)
  {
    this.addPersonForm = this.form.group({
      name: ['',Validators.compose([Validators.required])],
      dateOfMeeting: ['',Validators.compose([Validators.required])],
      personAge: ['',Validators.compose([Validators.required])],
      locationOfMeeting: [this.address,Validators.compose([Validators.required])],
      phone: ['',Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
    this.fetchCurrentpersonId();
    this.getgeoLocation();
  }

  fetchCurrentpersonId(){
    this.authService.retrieveId().then((result)=>{
        this.authUser = new User();
        this.authUser.name = result.displayName;
        this.authUser.authenticatedUserId = result.uid;
        this.authUser.phone = result.phoneNumber;
        this.dbService.setAuthenticateUserId(this.authUser.authenticatedUserId);
    });
  }

  getgeoLocation() {
    this.geoLocation.getCurrentPosition().then((resp) =>{
      this.getGeoencoder(resp.coords.latitude, resp.coords.longitude);
    },(error) => {
      alert('Error getting location' + JSON.stringify(error));
    });
  }

  getGeoencoder(latitude, longitude) {
    this.nativeGeoCoder.reverseGeocode(latitude, longitude, this.geoencoderOptions)
      .then((result: NativeGeocoderResult[]) => {
        this.address = this.generateAddress(result[0]);
        this.addPersonForm.get('locationOfMeeting').setValue(this.address);
      })
      .catch((error: any) => {
        alert('Error getting location' + JSON.stringify(error));
      });
  }

  generateAddress(addressObj) {
    const obj = [];
    let address = '';
    // eslint-disable-next-line guard-for-in
    for (const key in addressObj) {
      obj.push(addressObj[key]);
    }
    obj.reverse();
    for (const val in obj) {
      if (obj[val].length){
        address += obj[val] + ', ';
      }
    }
    return address.slice(0, -2);
  }

  resetForm(){
    this.addPersonForm.reset();
    this.addPersonForm.get('locationOfMeeting').setValue(this.address);
  }

  async logout(){
    await this.authService.logout();
    this.navCtrl.navigateRoot('\login');
  }

  async onFormSubmit(){
    if(this.addPersonForm.valid){
      const tempObject: Person = Object.assign(new Person(),this.addPersonForm.value);
      tempObject.authenticatedUserId = this.authUser.authenticatedUserId;
      await this.components.presentLoading();
      const result = await this.dbService.addNewPerson(tempObject,this.authUser.authenticatedUserId);
      await this.components.dismissLoading();
      if(result === 'success'){
        this.resetForm();
      }
      else {
        this.components.presentAlertError();
      }
    }
  }

}
