import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import firebase from 'firebase/compat/app';
import { Country } from 'src/app/model/country';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { SampleDataService } from 'src/app/services/sample-data/sample-data.service';
import { TracerComponent } from 'src/app/components/component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

    countryData: Country[] = [];
    otp = '';
    code: any;
    phoneNo: any;
    countryCode: any = '+49';
    recaptchaVerifier: firebase.auth.RecaptchaVerifier;
    confirmationResult: any;
    constructor(
      private alertController: AlertController,
      private components: TracerComponent,
      private authService: AuthService,
      private sampleDataService: SampleDataService,
      private navController: NavController
    ) {}

  ngOnInit(): void {
    this.fetchCountryCode();
  }

     async fetchCountryCode() {
        await this.components.presentLoading();
        await this.sampleDataService.getCountryCode().subscribe((res: Country[]) =>
        {
          this.countryData = res;
        });
        await this.components.dismissLoading();
     }

    async ionViewDidEnter() {
      this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
        size: 'invisible',
        callback: (response) => {
        },
        'expired-callback': () => {
        }
      });
    }
    ionViewDidLoad() {
      this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
        size: 'invisible',
        callback: (response) => {

        },
        'expired-callback': () => {
        }
      });
    }
    countryCodeChange($event) {
      this.countryCode = $event.detail.value;
    }
    // Button event after the nmber is entered and button is clicked
    async signinWithPhoneNumber($event) {
      console.log('country', this.recaptchaVerifier);
      if (this.phoneNo && this.countryCode) {
        await this.components.presentLoading();
        this.authService.signInWithPhoneNumber(this.recaptchaVerifier, this.countryCode + this.phoneNo).then(
          async success => {
            await this.components.dismissLoading();
            this.otpVerification();
          }, async error =>{
            await this.components.dismissLoading();
            this.components.presentAlertError();
          });
      }
    }
    async showSuccess() {
      const alert = await this.alertController.create({
        header: 'Status',
        message: 'OTP Verified Successfully!',
        buttons: [
          {
            text: 'Ok',
            handler: (res) => {
              this.navController.navigateRoot('\dashboard');
            }
          }
        ]
      });
      alert.present();
    }
    async otpVerification() {
      const alert = await this.alertController.create({
        header: 'Enter OTP',
        backdropDismiss: false,
        inputs: [
          {
            name: 'otp',
            type: 'text',
            placeholder: 'Enter your otp',
          }
        ],
        buttons: [{
          text: 'Enter',
          handler: async (res) => {
            await this.components.presentLoading();
            this.authService.enterVerificationCode(res.otp).then(
              async userData => {
                await this.components.dismissLoading();
                this.showSuccess();
                console.log(userData);
              }, async error => {
                console.log(error);
                await this.components.dismissLoading();
                this.components.presentAlertError();
              });
          }
        }
        ]
      });
      await alert.present();
    }
  }
