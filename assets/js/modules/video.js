Vue.component('video-capture', {
  props: [
    'width',
    'height',
  ],
  data: function () {
    return {
      video: {},
      canvas: {},
      showVideo: false,
      error: false,
      step: 0,
    }
  },
  template: `
    <div>
      <div v-bind:style="{ width: width + 'px', height: height + 'px' }" class="video-wrapper">
        <video v-show="showVideo && step > 0 && !isFacebookApp()" ref="video" id="video" :width="width" :height="height" autoplay muted playsinline></video>
        <div class="video-error" v-if="step == 0">
          <div>
            <facebook-image @capture="captureFacebookImage" :classes="['button', 'button--facebook', 'bm-20']" :caption="greenpeace_petition_ajax.translations['Use my facebook profile picture']"></facebook-image>
          </div>
          <a class="button button--secondary button--camera bm-20" @click="step = 1" v-if="showVideo && !isFacebookApp()" v-html="greenpeace_petition_ajax.translations['Use device camera']"></a>
          <div>
            <a class="button" :class="{ 'button--no-bg' : !isFacebookApp() }" @click="capture(false)" v-html="greenpeace_petition_ajax.translations['Proceed without camera']"></a>
          </div>
        </div>
        <a class="button--capture button button--primary button--camera bm-20" @click="capture()" v-if="showVideo && !isFacebookApp() && step == 1" v-html="greenpeace_petition_ajax.translations['Take photo']"></a>
      </div>
      <a class="button button--back button--secondary button--small" @click="step = 0" v-if="step == 1" v-html="greenpeace_petition_ajax.translations['Back']"></a>
      <canvas ref="canvas" v-bind:width="width" v-bind:height="height" style="display: none;"></canvas>
    </div>
  `,
  mounted: function () {
    Vue.nextTick(() => {
      lodash.delay(() => {
        this.video = this.$refs.video
        this.canvas = this.$refs.canvas
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          this.startCamera()
        } else {
          // console.log( 'No camera' )
          // Todo: show the file input
        }
      }, 400)
    })
  },
  destroyed: function () {
    this.stopCamera()
  },
  methods: {
    startCamera: function () {
      let constraints = {
        video: {
          width: this.width,
          height: this.height,
          facingMode: 'user',
        }
      }
      navigator.mediaDevices.getUserMedia(constraints).then(stream => {
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
    stopCamera: function () {
      this.video.srcObject && this.video.srcObject.getTracks().forEach((track) => {
        track.stop()
      })
    },
    capture: function (takePhoto = true) {
      if (!takePhoto) {
        this.$emit('capture', null)
        if (typeof dataLayer !== 'undefined') {
          dataLayer.push({
            'event': 'engagementPlugin',
            'eventAction': 'continued without picture',
            'eventLabel': 'step 2'
          })
        }
        return
      }
      let context = this.canvas.getContext("2d").drawImage(this.video, 0, 0, this.width, this.height)
      let imgInstance = new fabric.Image(this.canvas, {
        left: 0,
        top: 0,
        width: this.width,
        height: this.height,
        selectable: false,
      })
      this.$emit('capture', imgInstance)
      if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
          'event': 'engagementPlugin',
          'eventAction': 'took picture',
          'eventLabel': 'step 2'
        })
      }
    },
    captureFacebookImage: function ($event) {
      fabric.util.loadImage($event.url,
        (img) => {
          let imgInstance = new fabric.Image(img)
          imgInstance.scaleToWidth(this.width)
          this.$emit('capture', imgInstance)
          if (typeof dataLayer !== 'undefined') {
            dataLayer.push({
              'event': 'engagementPlugin',
              'eventAction': 'upload a picture from facebook',
              'eventLabel': 'step 2'
            })
          }
        }, null, { left: 0, top: 0, selectable: false, crossOrigin: "Anonymous" })
    },
    isFacebookApp: function () {
      let ua = navigator.userAgent || navigator.vendor || window.opera
      return (ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1)
    }
  }
})
