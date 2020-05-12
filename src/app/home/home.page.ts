import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController, LoadingController, ToastController, PickerController, } from '@ionic/angular';
import { PickerOptions } from "@ionic/core";
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  data: any = {
    title: '',
    job: '',
    country: 'Select a country'
  };
  items: any;
  countries: any;
  constructor(
    public http: HttpClient,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private pickerController: PickerController,
    private storage: Storage) {
    this.getCountriesData();
  }

  selectjob(job) {
    this.data.job = job;
    this.items = [];
    console.log('here')
  }
  initializeItems(val) {
    var url = `http://api.dataatwork.org/v1/jobs/autocomplete?begins_with=${val}&contains=${val}&?ends_with=${val}`;
    // var url = `http://api.dataatwork.org/v1/jobs`;
    this.http.get(url).subscribe(data => {
      console.log('data : ', data)
      this.items = data;
    })
  }

  async getCountriesData() {
    var url = `https://restcountries.eu/rest/v2/all`;
    await this.http.get(url).subscribe(data => {
      console.log('data : ', data)
      let countries: any = data;
      this.countries = [];
      countries.forEach(element => {
        this.countries.push({ text: element.name, value: element.name })
      });
    })
  }

  getItems(ev) {
    // set val to the value of the ev target
    var val = ev.target.value;
    this.initializeItems(val);
  }
  async showPicker() {
    let options: PickerOptions = {
      buttons: [
        {
          text: "Cancel",
          role: 'cancel'
        },
        {
          text: 'Ok',
          handler: (value: any) => {
            this.data.country = value.countries.value;
            console.log(this.data)
          }
        }
      ],
      columns: [{
        name: 'countries',
        options: this.countries
      }]
    };

    let picker = await this.pickerController.create(options);
    picker.present()
  }

  logForm = async () => {
    this.storage.set('formData', JSON.stringify(this.data));
    const alert = await this.alertCtrl.create({
      header: `Thanks ${this.data.job}: ${this.data.name} for submitting your form`,
      subHeader: `Your application for ${this.data.program} program will saved in our DB `,
      buttons: ['OK']
    });
    alert.present();
    this.storage.get('formData').then((val) => {
      console.log('Your data is', JSON.parse(val));
    });
  }
}