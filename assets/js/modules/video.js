Vue.component('video-capture', {
  props: [
    'width',
    'height',
  ],
  data: function() {
    return {
      video: {},
      canvas: {},
      showVideo: false,
      error: false,
    }
  },
  template: `
    <div>
      <div v-bind:style="{ width: width + 'px', height: height + 'px' }" class="video-wrapper">
        <video v-show="showVideo && !isFacebookApp()" ref="video" id="video" :width="width" :height="height" autoplay muted playsinline></video>
        <div class="video-error" v-if="error || isFacebookApp()">
          <p v-html="isFacebookApp() ? greenpeace_petition_ajax.translations['If the webcam is not working please visit shorturl in your usual browser!'] : greenpeace_petition_ajax.translations['Please enable your camera to snap a picture of yourself.']"></p>
          <facebook-image @capture="captureFacebookImage" :classes="['button', 'button--small']" :caption="greenpeace_petition_ajax.translations['Use my facebook profile picture']"></facebook-image>
          <p>
            <a v-on:click="capture(false)" v-html="greenpeace_petition_ajax.translations['Or click here to continue without camera.']"></a>
          </p>
        </div>
      </div>
      <a class="button button--camera" v-on:click="capture()" v-if="showVideo && !isFacebookApp()" v-html="greenpeace_petition_ajax.translations['Take photo']"></a>
      <div>
        <facebook-image @capture="captureFacebookImage" :classes="['button', 'button--secondary', 'button--small']" :caption="greenpeace_petition_ajax.translations['Use my facebook profile picture']"></facebook-image>
      </div>
      <div>
        <a class="button" :class="{ 'button--no-bg' : !isFacebookApp() }" v-on:click="capture(false)" v-html="greenpeace_petition_ajax.translations['Proceed without camera']"></a>
        <p class="canvas-instructions" v-html="greenpeace_petition_ajax.translations['Snap a picture and join the protest by allowing the app to use the camera on your device. You can also proceed without a picture.']"></p>
      </div>
      <canvas ref="canvas" v-bind:width="width" v-bind:height="height" style="display: none;"></canvas>
    </div>
  `,
  mounted: function() {
    Vue.nextTick(() => {
      lodash.delay(() => {
        this.video = this.$refs.video
        this.canvas = this.$refs.canvas
        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          this.startCamera()
        } else {
          // console.log( 'No camera' )
          // Todo: show the file input
        }
      }, 400)
    })
  },
  destroyed: function() {
    this.stopCamera()
  },
  methods: {
    startCamera: function() {
      let constraints = {
          video: {
          width: this.width,
          height: this.height,
          facingMode: 'user',
        }
      }
      navigator.mediaDevices.getUserMedia( constraints ).then(stream => {
        this.video.srcObject = stream
        this.video.setAttribute('autoplay', '')
        this.video.setAttribute('muted', '')
        this.video.setAttribute('playsinline', '')
        this.video.play()
        this.showVideo = true
        this.error = false
      }).catch(e => {
        // console.log( 'error', e )
        this.error = true
        this.showVideo = false
      })
    },
    stopCamera: function() {
      this.video.srcObject.getTracks().forEach((track) => {
        track.stop()
      })
    },
    capture: function( takePhoto = true ) {
      if( !takePhoto ) {
        this.$emit('capture', null)
        return
      }
      let context = this.canvas.getContext("2d").drawImage(this.video, 0, 0, this.width, this.height)
      let imgInstance = new fabric.Image(this.canvas, {
        left: 0,
        top: 0,
        width: this.width,
        height: this.height,
        selectable: false
      })
      this.$emit('capture', imgInstance)
    },
    captureFacebookImage: function($event) {
      fabric.Image.fromURL($event.url, imgInstance => {
        let scale = this.width / $event.width
        imgInstance = imgInstance.set({
          left: 0,
          top: 0,
          width: this.width,
          height: $event.height * scale,
          selectable: false
        })
        this.$emit('capture', imgInstance)
      })
    },
    isFacebookApp: function () {
      let ua = navigator.userAgent || navigator.vendor || window.opera
      return (ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1)
    }
  }
})
