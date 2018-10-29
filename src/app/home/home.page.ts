import { Component } from '@angular/core';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import * as Tesseract from 'tesseract.js';
import { NavController, ActionSheetController, Platform, LoadingController, ToastController } from '@ionic/angular';
// import { NgProgress } from 'ngx-progressbar';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';


@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {

    //     OCRAD: any;
    //     selectedImage: string;
    //     imageText: string;
    //     ncount: number;

    //     constructor(
    //         public toss: ToastController,
    //         private ns: NativeStorage,
    //         private tts: TextToSpeech,
    //         private loading: LoadingController,
    //         public navCtrl: NavController,
    //         private actionSheetCtrl: ActionSheetController,
    //         private camera: Camera) {

    //         this.ns.getItem('notecount').then(result => {
    //             this.ncount = result.count;
    //         })
    //             .catch(_ => {
    //                 this.ns.setItem('notecount', {
    //                     count: 0,
    //                 });
    //             });
    //     }
    //     refresh() {
    //         this.selectedImage = '';
    //         this.imageText = '';
    //     }

    //     async chooseImage() {
    //         const actionSheet = await this.actionSheetCtrl.create({
    //             header: 'Select Source',
    //             buttons: [
    //                 {
    //                     text: 'Capture Image',
    //                     role: 'camera',
    //                     icon: 'camera',
    //                     handler: () => {
    //                         return this.getPicture(this.camera.PictureSourceType.CAMERA);
    //                     }
    //                 },
    //                 {
    //                     text: 'Use Libary',
    //                     role: 'libary',
    //                     icon: 'folder-open',
    //                     handler: () => {
    //                         return this.getPicture(this.camera.PictureSourceType.PHOTOLIBRARY);
    //                     }
    //                 }
    //             ]
    //         });
    //         await actionSheet.present();
    //     }

    //     getPicture(source: PictureSourceType) {
    //         this.camera.getPicture({
    //             quality: 100,
    //             destinationType: this.camera.DestinationType.DATA_URL,
    //             allowEdit: true,
    //             correctOrientation: true,
    //             sourceType: source,
    //             saveToPhotoAlbum: false,
    //         }).then(imageData => {
    //             this.selectedImage = `data:image/jpeg;base64,${imageData}`;

    //         })
    //             .catch(reason => {
    //                 alert(reason);
    //             });
    //     }

    //     speak() {
    //         this.tts.speak(this.imageText)
    //             .then(response => {

    //             })
    //             .catch(error => {
    //                 alert(error);
    //             });
    //     }

    //     async recog() {
    //         const loading = await this.loading.create({
    //             message: 'Recognizing...',
    //             spinner: 'lines', // lines, lines-small, dots, bubbles, circles, crescent
    //         });
    //         loading.present();

    //         (<any>window).OCRAD(document.getElementById('image'), text => {
    //             loading.dismiss();
    //             alert(JSON.stringify(text));
    //             console.log(text);
    //           });

    //         // Tesseract.recognize(this.selectedImage)
    //         //     .progress(result => {
    //         //         alert(result);
    //         //         if (result.status === 'recognizing text') {
    //         //             // this.progress.set(result.progress);
    //         //         }
    //         //     })
    //         //     .catch(e => {
    //         //         alert(e);
    //         //     })
    //         //     .then(result => {
    //         //         this.imageText = result.text;
    //         //         alert(result);
    //         //     })
    //         //     .finally(ress => {
    //         //         alert(ress);
    //         //         // this.progress.done();
    //         //         loading.dismiss();
    //         //     });
    //     }



    // }
    selectedImage: string;
    imageText: string;


    constructor(
        public navCtrl: NavController,
        private camera: Camera,
        private actionSheetCtrl: ActionSheetController,
        private loading: LoadingController,
        // public progress: NgProgress,
        public platform: Platform) {
    }

    async selectSource() {
        const actionSheet = await this.actionSheetCtrl.create({
            header: 'Select Source',
            buttons: [
                {
                    text: 'Capture Image',
                    role: 'camera',
                    icon: 'camera',
                    handler: () => {
                        return this.getPicture(this.camera.PictureSourceType.CAMERA);
                    }
                },
                {
                    text: 'Use Libary',
                    role: 'libary',
                    icon: 'folder-open',
                    handler: () => {
                        return this.getPicture(this.camera.PictureSourceType.PHOTOLIBRARY);
                    }
                }
            ]
        });
        await actionSheet.present();
    }

    getPicture(sourceType: PictureSourceType) {
        if (this.platform.is('cordova')) {
            this.camera.getPicture({
                quality: 100,
                destinationType: this.camera.DestinationType.DATA_URL,
                sourceType: sourceType,
                allowEdit: true,
                saveToPhotoAlbum: false,
                correctOrientation: true
            }).then((imageData) => {
                this.selectedImage = `data:image/jpeg;base64,${imageData}`;
            });
        } else {
            alert('cordova not available');
        }

    }

    async recognizeImage() {
        const loading = await this.loading.create({
            message: 'Recognizing...',
            spinner: 'lines', // lines, lines-small, dots, bubbles, circles, crescent
        });
        loading.present();

        Tesseract.recognize(this.selectedImage)
            .progress(message => {
                console.log(message);

                if (message.status === 'recognizing text') {
                    // this.progress.set(message.progress);
                }
            })
            .catch(err => console.error(err))
            .then(result => {
                loading.dismiss();
                this.imageText = result.text;
                alert(this.imageText);
            })
            .finally(resultOrError => {
                loading.dismiss();
                // this.progress.complete();
                alert(resultOrError);

            });
    }
}
