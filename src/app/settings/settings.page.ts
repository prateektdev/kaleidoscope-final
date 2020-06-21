import { Component, OnInit, Input } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActionSheetController, ModalController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { GlobalService } from "../service/global.service";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { WebView } from "@ionic-native/ionic-webview/ngx";
import { File, FileEntry } from "@ionic-native/file/ngx";

@Component({
  templateUrl: "settings.page.html",
  styleUrls: ["settings.page.scss"],
})
export class SettingsPage implements OnInit {
  constructor(
    public http: HttpClient,
    public actionSheetCtrl: ActionSheetController,
    private modalController: ModalController,
    private global: GlobalService,
    private camera: Camera,
    private file: File,
    private webview: WebView
  ) {

  }

  @Input() mandala: any;
  @Input() animate: any;
  @Input() speed: any;
  @Input() image: any;
  @Input() segment: any;

  public currentMandala: any;
  public currentAnimate: any;
  public currentSpeed: any;
  public currentSegment: number;
  public currentImage = "assets/img/effect3.jpeg";

  ngOnInit() {
    console.log('this.currentAnimate', this.animate)
    this.currentMandala = this.mandala;
    this.currentAnimate = this.animate;
    this.currentSpeed = this.speed;
    this.currentImage = this.image;
    this.currentSegment = this.segment;
  }

  changeAutoAnimate = () => {
    console.log('animate change');
    console.log(this.currentAnimate);
  }

  changeMandela = () => {
    console.log('animate mandela');
    console.log(this.currentMandala);
  }

  /* save = () => {
    console.log('this.currentMandala', this.currentMandala)
    this.global.publishData({
      mandala: this.currentMandala,
      autoAnimate: this.currentAnimate,
      currentSpeed: this.currentSpeed,
      currentImage: this.currentImage,
      currentSegment: this.currentSegment,
    });
    this.closeModal();
  } */

  closeModal = () => {
    this.global.publishData({
      mandala: this.currentMandala,
      autoAnimate: this.currentAnimate,
      currentSpeed: this.currentSpeed,
      currentImage: this.currentImage,
      currentSegment: this.currentSegment,
    });
    this.modalController.dismiss();
  }

  pickImage(sourceType: any) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      targetWidth: 300,
      targetHeight: 150,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
    };
    this.camera.getPicture(options).then(
      (imageData) => {
        this.file
          .resolveLocalFilesystemUrl(imageData)
          .then((entry: FileEntry) => {
            entry.file((file) => {
              console.log(file);
              this.currentImage = this.webview.convertFileSrc(imageData);
            });
          });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  async selectImage() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: "Select Image source",
      buttons: [
        {
          text: "Load from Library",
          handler: () => {
            this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
          },
        },
        {
          text: "Use Camera",
          handler: () => {
            this.pickImage(this.camera.PictureSourceType.CAMERA);
          },
        },
        {
          text: "Cancel",
          role: "cancel",
        },
      ],
    });
    await actionSheet.present();
  }

  increaseSegment = () => {
    if (this.currentSegment != 23) this.currentSegment += 2;
  };

  decreaseSegment = () => {
    if (this.currentSegment != 9) this.currentSegment -= 2;
  };

  ionViewWillLeave() {
    this.closeModal();
  }
}
