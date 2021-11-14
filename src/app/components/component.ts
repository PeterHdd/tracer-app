import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';

@Injectable()
export class TracerComponent {
    loading: HTMLIonLoadingElement;
    constructor(private loadingController: LoadingController,
                private alertController: AlertController){}

    async presentLoading() {
        this.loading = await this.loadingController.create({
          cssClass: 'my-custom-class',
          message: 'Please wait...',
        });
        await this.loading.present();
    }

    async dismissLoading(){
       return await this.loading.dismiss();
    }

    async presentAlertError() {
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Error',
          message: 'Sorry, service is unavailable!',
          buttons: ['OK']
        });
    await alert.present();
    }

}
