import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  AlertController,
  LoadingController,
  ToastController,
  PickerController,
  ActionSheetController,
} from "@ionic/angular";
import { PickerOptions } from "@ionic/core";

import { Storage } from "@ionic/storage";
import * as $ from "jquery";
interface Window {
  requestAnimationFrame: any;
  FileReader: any;
  setTimeout: any;
}
var window: Window;
@Component({
  selector: "app-home",
  templateUrl: "kaleidoscope.page.html",
  styleUrls: ["kaleidoscope.page.scss"],
})
export class KaleidoscopePage {
  fullDisplay: boolean = true;
  autoAnimate:boolean=false;
  constructor(
    public http: HttpClient,
    private alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private storage: Storage
  ) {
    setTimeout(() => {
      this.loadView(this.fullDisplay,this.autoAnimate);
    }, 1000);
  }
  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: "View",
      buttons: [
        {
          text: "Mandala",
          role: "destructive",
          icon: "heart",
          handler: () => { 
            $(".kaleidoscope").html('<div class="kaleidoscope"></div>');
            setTimeout(() => {
              this.fullDisplay=false;
              this.loadView(false,this.autoAnimate);
            }, 1000);
          },
        },
        {
          text: "Full screen",
          icon: "share",
          handler: () => { 
            this.fullDisplay=true;
            $(".kaleidoscope").html('<div class="kaleidoscope"></div>');
            setTimeout(() => {
              this.loadView(true,this.autoAnimate);
            }, 1000);
          },
        },
        {
          text: "Auto Animation",
          icon: "aperture-outline",
          handler: () => {  
            this.autoAnimate= true;
            $(".kaleidoscope").html('<div class="kaleidoscope"></div>');
            setTimeout(() => {
              this.loadView(this.fullDisplay,this.autoAnimate);
            }, 1000);
          },
        },
        {
          text: "Finger Animate",
          icon: "finger-print-outline",
          handler: () => {  
            this.autoAnimate= false;
            $(".kaleidoscope").html('<div class="kaleidoscope"></div>');
            setTimeout(() => {
              this.loadView(this.fullDisplay,this.autoAnimate);
            }, 1000);
          },
        },
      ],
    });
    actionSheet.present();
  }

  loadView = (fullDisplay,autoAnimate) => {
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
      var s = parameters.s || 3;

      // PARAMETER: *n* is the number of segments.
      var n = ~~parameters.n || 7;
      var tiles = "";
      if (n) {
        console.log('this.fullDisplay : ',fullDisplay)
        if (fullDisplay==true) {
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
      var src = parameters.src;
      if (src) {
        $image.css(
          "background-image",
          ["url(", decodeURIComponent(src), ")"].join("")
        );
      }

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
        }, 50);
      })();
    });
  };
}
