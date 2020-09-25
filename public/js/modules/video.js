"use strict";Vue.component("video-capture",{props:["width","height"],data:function(){return{video:{},canvas:{},showVideo:!1,error:!1,step:0}},template:'\n    <div>\n      <div v-bind:style="{ width: width + \'px\', height: height + \'px\' }" class="video-wrapper">\n        <video v-show="showVideo && step > 0 && !isFacebookApp()" ref="video" id="video" :width="width" :height="height" autoplay muted playsinline></video>\n        <div class="video-error" v-if="step == 0">\n          <div>\n            <facebook-image @capture="captureFacebookImage" :classes="[\'button\', \'button--facebook\', \'bm-20\']" :caption="greenpeace_petition_ajax.translations[\'Use my facebook profile picture\']"></facebook-image>\n          </div>\n          <a class="button button--secondary button--camera bm-20" @click="step = 1" v-if="showVideo && !isFacebookApp()" v-html="greenpeace_petition_ajax.translations[\'Use device camera\']"></a>\n          <div>\n            <a class="button" :class="{ \'button--no-bg\' : !isFacebookApp() }" @click="capture(false)" v-html="greenpeace_petition_ajax.translations[\'Proceed without camera\']"></a>\n          </div>\n        </div>\n        <a class="button--capture button button--primary button--camera bm-20" @click="capture()" v-if="showVideo && !isFacebookApp() && step == 1" v-html="greenpeace_petition_ajax.translations[\'Take photo\']"></a>\n      </div>\n      <a class="button button--back button--secondary button--small" @click="step = 0" v-if="step == 1" v-html="greenpeace_petition_ajax.translations[\'Back\']"></a>\n      <canvas ref="canvas" v-bind:width="width" v-bind:height="height" style="display: none;"></canvas>\n    </div>\n  ',mounted:function(){var e=this;Vue.nextTick(function(){lodash.delay(function(){e.video=e.$refs.video,e.canvas=e.$refs.canvas,navigator.mediaDevices&&navigator.mediaDevices.getUserMedia&&e.startCamera()},400)})},destroyed:function(){this.stopCamera()},methods:{startCamera:function(){var t=this,e={video:{width:this.width,height:this.height,facingMode:"user"}};navigator.mediaDevices.getUserMedia(e).then(function(e){t.video.srcObject=e,t.video.setAttribute("autoplay",""),t.video.setAttribute("muted",""),t.video.setAttribute("playsinline",""),t.video.play(),t.showVideo=!0,t.error=!1}).catch(function(e){t.error=!0,t.showVideo=!1})},stopCamera:function(){this.video.srcObject&&this.video.srcObject.getTracks().forEach(function(e){e.stop()})},capture:function(e){if(!(!(0<arguments.length&&void 0!==e)||e))return this.$emit("capture",null),void("undefined"!=typeof dataLayer&&dataLayer.push({event:"engagementPlugin",eventAction:"continued without picture",eventLabel:"step 2"}));this.canvas.getContext("2d").drawImage(this.video,0,0,this.width,this.height);var t=new fabric.Image(this.canvas,{left:0,top:0,width:this.width,height:this.height,selectable:!1});this.$emit("capture",t),"undefined"!=typeof dataLayer&&dataLayer.push({event:"engagementPlugin",eventAction:"took picture",eventLabel:"step 2"})},captureFacebookImage:function(e){var a=this;fabric.util.loadImage(e.url,function(e){var t=new fabric.Image(e);t.scaleToWidth(a.width),a.$emit("capture",t),"undefined"!=typeof dataLayer&&dataLayer.push({event:"engagementPlugin",eventAction:"upload a picture from facebook",eventLabel:"step 2"})},null,{left:0,top:0,selectable:!1,crossOrigin:"Anonymous"})},isFacebookApp:function(){var e=navigator.userAgent||navigator.vendor||window.opera;return-1<e.indexOf("FBAN")||-1<e.indexOf("FBAV")}}});