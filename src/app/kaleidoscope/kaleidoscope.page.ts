import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  AlertController,
  LoadingController,
  ToastController,
  ModalController,
  NavController,
  ActionSheetController,
} from "@ionic/angular";
import { FileChooser } from "@ionic-native/file-chooser/ngx";
import { Storage } from "@ionic/storage";
import * as $ from "jquery";
import { SettingsPage } from "../settings/settings.page";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { File, FileEntry } from "@ionic-native/file/ngx";
import { Capacitor } from '@capacitor/core';
import { WebView } from '@ionic-native/ionic-webview/ngx';

interface Window {
  requestAnimationFrame: any;
  FileReader: any;
  setTimeout: any;
}
var window: Window;
@Component({
  selector: "app-kaleidoscope",
  templateUrl: "kaleidoscope.page.html",
  styleUrls: ["kaleidoscope.page.scss"],
})
export class KaleidoscopePage {
  fullDisplay: boolean = false;
  autoAnimate: boolean = false;
  currentSpeed: number = 3;
  currentSegment: number = 3;
  currentImage: string = "assets/img/effect9.jpeg";

  constructor(
    public http: HttpClient,
    public modalController: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private fileChooser: FileChooser,
    private navCtrl: NavController,
    private storage: Storage,
    private camera: Camera,
    private file: File,
    private webview: WebView
  ) {
    setTimeout(() => {
      this.loadView(this.fullDisplay, this.autoAnimate, this.currentImage);
    }, 1000);
  }

  async presentModal() {
    const modal = await this.navCtrl.navigateForward("/home")
    // ({
    //   component: SettingsPage,
    // });
    // modal.onDidDismiss().then((data) => {
    //   console.log("here : ", data);
    //   const settings = data["settings"]; // Here's your selected user!
    // });
    // return await modal.present();
  }

  refreshApp = () => {
    $(".kaleidoscope").html('<div class="kaleidoscope"></div>');
  };

  showInFullScreen = (fullScreenEnable: boolean) => {
    this.refreshApp();
    setTimeout(() => {
      this.fullDisplay = fullScreenEnable;
      this.loadView(fullScreenEnable, this.autoAnimate, this.currentImage);
    }, 1000);
  };

  enableAutoAnimation = (autoEnable: boolean) => {
    this.refreshApp();
    setTimeout(() => {
      this.autoAnimate = autoEnable;
      this.loadView(this.fullDisplay, this.autoAnimate, this.currentImage);
    }, 1000);
  };

  chaneSpeed = (speed: number) => {
    this.refreshApp();
    setTimeout(() => {
      this.currentSpeed = speed;
      this.loadView(this.fullDisplay, this.autoAnimate, this.currentImage);
    }, 1000);
  };

  changeImage = () => {
    this.refreshApp();
    setTimeout(() => {
      // this.fileChooser
      //   .open()
      //   .then(async (uri) => {
      //     console.log(uri);
      //     // let alert = await this.toastCtrl.create({
      //     //   message: "URI : "+uri,
      //     //   duration: 3000,
      //     //   position: "top",
      //     // });
      //     // alert.present();
      //     if (uri.substring(0, 21) == "content://com.android") {
      //       let photo_split = uri.split("%3A");
      //       uri = "content://media/external/images/media/" + photo_split[1];
      //     }
      //     this.currentImage = "data:image/jpeg;base64," + uri;
      //     console.log(this.currentImage);
      //     this.loadView(this.fullDisplay, this.autoAnimate, this.currentImage);
      //   })
      //   .catch((e) => console.log(e));
      this.selectImage();
    }, 1000);
  };

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: "View",
      buttons: [
        {
          text: "Mandala",
          role: "destructive",
          icon: "heart",
          handler: () => {
            this.showInFullScreen(false);
          },
        },
        {
          text: "Full screen",
          icon: "share",
          handler: () => {
            this.showInFullScreen(true);
          },
        },
        {
          text: "Auto Animation",
          icon: "aperture-outline",
          handler: () => {
            this.enableAutoAnimation(true);
          },
        },
        {
          text: "Finger Animate",
          icon: "finger-print-outline",
          handler: () => {
            this.enableAutoAnimation(false);
          },
        },
        {
          text: "Change Image",
          icon: "image-outline",
          handler: () => {
            this.changeImage();
          },
        },
      ],
    });
    actionSheet.present();
  }

  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    };
    this.camera.getPicture(options).then(
      (imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        // let base64Image = 'data:image/jpeg;base64,' + imageData;
        // this.cropImage(imageData);
        this.file
          .resolveLocalFilesystemUrl(imageData)
          .then((entry: FileEntry) => {
            entry.file((file) => {
              console.log(file);
              this.currentImage = this.webview.convertFileSrc(imageData);
              console.log(this.currentImage);
              this.loadView(
                this.fullDisplay,
                this.autoAnimate,
                this.currentImage
              );
            });
          });
      },
      (err) => {
        // Handle error
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

  loadView = (fullDisplay, autoAnimate, currentImage) => {
    $(document).ready(function () {
      var parameters: any = (function (src) {
        var params = {},
          qryStr = src.split("?")[1];
        if (qryStr) {
          $.each(qryStr.split("&"), function (i, p) {
            var ps = p.replace(/\/$/, "").split("=");
            var k = ps[0].replace(/^\?/, "");
            params[k] = ps[1] || true;
          });
        }
        return params;
      })(location.search);

      var x = 0;
      var y = 0;

      var auto;
      var auto_x = 0;
      var auto_y = 0;
      var auto_throttle;

      // PARAMETER: *s* is the speed of the automatic timeout animation.
      var s = parameters.s || 1;

      // PARAMETER: *n* is the number of segments.
      var n = ~~parameters.n || 7;
      var tiles = "";
      if (n) {
        console.log("this.fullDisplay : ", fullDisplay);
        if (fullDisplay == true) {
          for (var i = 0; i <= n * 2; i++) {
            tiles += [
              `<div class="tile-full tile t`,
              i,
              '"><div class="image"></div></div>',
            ].join("");
          }
        } else {
          for (var i = 0; i <= n * 2; i++) {
            tiles += [
              `<div class="tile-mandala tile t`,
              i,
              '"><div class="image"></div></div>',
            ].join("");
          }
        }
      }

      var $kaleidescope = $(".kaleidoscope")
        .addClass("n" + n)
        .append(tiles);

      var $image = $kaleidescope.find(".image");

      var $fullscreen = $("#fullscreen");
      var k = $kaleidescope[0];

      // PARAMETER: *src* is the URL for an alternate image.
      var src = currentImage;
      if (src) {
        $image.css("background-image", ["url(", src, ")"].join(""));
      }
      // else{
      //   $image.css(
      //     "background-image",
      //     ["url(", decodeURIComponent(src), ")"].join("")
      //   );
      // }

      // PARAMETER: *clean* hides the Github and fullscreen links.
      var clean = parameters.clean;
      if (clean) {
        $("body").addClass("clean");
      }

      // PARAMETER: *opacity* sets opacity (0.0 -> 1.0).
      var opacity = parseFloat(parameters.opacity);
      if (opacity) {
        $kaleidescope.css("opacity", 0).fadeTo(3000, opacity);
      }

      // PARAMETER (undocumented): *mode* changes the animation style.
      var mode = ~~parameters.mode || 2;

      // Project changes in cursor (x, y) onto the image background position.
      // $kaleidescope.mouseover( function ( e ) {
      //   x++;
      //   y++;
      //   console.log('mode : ',mode)
      //   var nx = e.pageX, ny = e.pageY;
      //   switch ( mode ) {
      //     case 1:
      //       nx = -x;
      //       ny = e.pageY;
      //       break;
      //     case 2:
      //       nx = e.pageX;
      //       ny = -y;
      //       break;
      //     case 3:
      //       nx = x;
      //       ny = e.pageY;
      //       break;
      //     case 4:
      //       nx = e.pageX;
      //       ny = y;
      //       break;
      //     case 5:
      //       nx = x;
      //       ny = y;
      //       break;
      //   }

      //   move( nx, ny );
      //   auto = auto_throttle = false;
      // });
      $kaleidescope.bind("mousemove touchmove", function (e: any) {
        x++;
        y++;
        var nx: any = e.pageX,
          ny: any = e.pageY;
        let touch = undefined;
        if (e.originalEvent.touches) touch = e.originalEvent.touches[0];
        nx = e.pageX || touch.pageX;
        ny = e.pageY || touch.pageY;
        switch (mode) {
          case 1:
            nx = -x;
            ny = e.pageY;
            break;
          case 2:
            nx = e.pageX || touch.pageX;
            ny = -y;
            break;
          case 3:
            nx = x;
            ny = e.pageY;
            break;
          case 4:
            nx = e.pageX;
            ny = y;
            break;
          case 5:
            nx = x;
            ny = y;
            break;
        }
        move(parseInt(nx), parseInt(ny));
        auto = auto_throttle = false;
      });
      // An alternate image can be supplied via Dragon Drop.
      // if ( 'draggable' in document.createElement('b') && window.FileReader ) {
      //   k.ondragenter = k.ondragover = function( e ) {
      //     e.preventDefault();
      //   };

      //   k.ondrop = function( e ) {
      //     readFile( e.dataTransfer.files[0] );
      //     e.preventDefault();
      //   };
      // }

      // function readFile( file ) {
      //   var r = new FileReader();
      //   if ( !file.type.match('image\/.*') ) {
      //     return false;
      //   }

      //   r.onload = function( e:any ) {
      //     $image.css( 'background-image', [ 'url(', e.target.result, ')' ].join( '' ) );
      //   };

      //   r.readAsDataURL( file );
      // }

      // Request Fullscreen for maximum LSD effect
      $fullscreen.click(function () {
        if (
          document.fullscreenEnabled
          // || document.mozFullScreenEnabled ||
          //   document.webkitFullscreenEnabled
        ) {
          if (k.requestFullscreen) k.requestFullscreen();
          // if ( k.mozRequestFullScreen )    k.mozRequestFullScreen();
          // if ( k.webkitRequestFullscreen ) k.webkitRequestFullscreen();
        }
      });

      // Animate all the things!
      // window.requestAnimationFrame = ( function( window ) {
      //   console.log('window',window)
      //   var suffix = "equestAnimationFrame",
      //     rAF = [ "r" ].filter( function( val ) {
      //       return val + suffix in window;
      //     })[ 0 ] + suffix;

      //   return window[ rAF ]  || function( callback ) {
      //     window.setTimeout( function() {
      //       callback( +new Date() );
      //     }, 100 / 60 );
      //   };
      // })( window );

      function animate() {
        const a: any = [".0000", s].join("");
        var time = new Date().getTime() * a;
        auto_x = Math.sin(time) * document.body.clientWidth;
        auto_y++;
        move(auto_x, auto_y);
        if (auto) window.requestAnimationFrame(animate);
      }

      function move(x, y) {
        $image.css("background-position", [x + "px", y + "px"].join(" "));
      }

      // Timer to check for inactivity
      (function timer() {
        setTimeout(function () {
          timer();
          if (autoAnimate) {
            animate();
            auto_throttle = true;
          } else {
            auto = true;
          }
        }, 100);
      })();
    });
  };
}
