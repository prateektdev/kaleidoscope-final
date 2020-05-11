import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NavParams,ModalController } from '@ionic/angular';
import { Storage } from "@ionic/storage";  

@Component({
  selector: "app-settings",
  templateUrl: "settings.page.html",
  styleUrls: ["settings.page.scss"],
})
export class SettingsPage {
  settings:{
    fullscreen:boolean,
    mandala:boolean,
    speed:number,
    animate:boolean
  } 
  constructor(
    public http: HttpClient, 
    private storage: Storage,
    private modalController: ModalController
  ) { 
  } 

  save =()=>{
    console.log('closing')
    this.modalController.dismiss(this.settings);
  } 
}
