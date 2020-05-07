"use strict";Vue.component("video-capture",{props:["width","height"],data:function(){return{video:{},canvas:{},showVideo:!1,error:!1}},template:'\n    <div>\n      <div v-bind:style="{ width: width + \'px\', height: height + \'px\' }" class="video-wrapper">\n        <video v-show="showVideo" ref="video" id="video" :width="width" :height="height" autoplay muted playsinline></video>\n        <div class="video-error" v-if="error">\n          <p v-html="greenpeace_petition_ajax.translations[\'Please enable your camera to snap a picture of yourself.\']">\n\n          </p>\n          <p>\n            <a v-on:click="capture(false)" v-html="greenpeace_petition_ajax.translations[\'Or click here to continue without camera.\']"></a>\n          </p>\n        </div>\n      </div>\n      <input type="file" accept="image/*" style="display: none;"> \x3c!-- This can be used on devices with no camera --\x3e\n      <a class="button button--camera" v-on:click="capture()" v-if="showVideo" v-html="greenpeace_petition_ajax.translations[\'Take photo\']"></a>\n      <div>\n        <a class="button button--no-bg" v-on:click="capture(false)" v-html="greenpeace_petition_ajax.translations[\'Proceed without camera\']"></a>\n        <p class="canvas-instructions" v-html="greenpeace_petition_ajax.translations[\'Snap a picture and join the protest by allowing the app to use the camera on your device. You can also proceed without a picture.\']"></p>\n      </div>\n      <canvas ref="canvas" v-bind:width="width" v-bind:height="height" style="display: none;"></canvas>\n    </div>\n  ',mounted:function(){var e=this;Vue.nextTick(function(){lodash.delay(function(){e.video=e.$refs.video,e.canvas=e.$refs.canvas,navigator.mediaDevices&&navigator.mediaDevices.getUserMedia?e.startCamera():console.log("No camera")},400)})},destroyed:function(){this.stopCamera()},methods:{startCamera:function(){var t=this,e={video:{width:this.width,height:this.height,facingMode:"user"}};navigator.mediaDevices.getUserMedia(e).then(function(e){t.video.srcObject=e,t.video.setAttribute("autoplay",""),t.video.setAttribute("muted",""),t.video.setAttribute("playsinline",""),t.video.play(),t.showVideo=!0,t.error=!1}).catch(function(e){console.log("error",e),t.error=!0,t.showVideo=!1})},stopCamera:function(){this.video.srcObject.getTracks().forEach(function(e){e.stop()})},capture:function(e){if(!(0<arguments.length&&void 0!==e)||e){this.canvas.getContext("2d").drawImage(this.video,0,0,this.width,this.height);var t=new fabric.Image(this.canvas,{left:0,top:0,width:this.width,height:this.height,selectable:!1});this.$emit("capture",t)}else this.$emit("capture",null)}}});