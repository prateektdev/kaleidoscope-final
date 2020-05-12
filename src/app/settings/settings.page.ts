import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NavParams, ModalController } from '@ionic/angular';
import { Storage } from "@ionic/storage";
import { GlobalService } from '../service/global.service';

@Component({
  templateUrl: "settings.page.html",
  styleUrls: ["settings.page.scss"],
})
export class SettingsPage {
  constructor(
    public http: HttpClient,
    private storage: Storage,
    private modalController: ModalController,
    private global: GlobalService
  ) { }

  /* public settings: {
    fullscreen: false,
    mandala: false,
    speed: 0,
    animate: false
  }; */

  public fullscreen = false;
  public mandala = false;
  public animate = false;
  public speed = 0;

  save = () => {
    console.log('closing')
    this.global.publishData({
      fullscreen: this.fullscreen,
      mandala: this.mandala,
      animate: this.animate,
      speed: this.speed,
    });
    // this.modalController.dismiss(this.settings);
  }

  /* emitEvent() {
    console.log(this.mandala);
    this.global.publishData({
      foo: 'bar'
    });
  } */

  /* onRangeChangeHandler() {
    console.log(this.speed);
  } */

}
