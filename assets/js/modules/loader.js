Vue.component('loader', {
  props: {
    messages: {
      default: [{
        message: 'Loading...'
      }]
    }
  },
  data: function() {
    return {
      activeMessageIndex: 0
    }
  },
  template: `
    <div class="loader">
      <div ref="loader">
        <div v-for="(message, index) in messages" class="message" :class="{ 'message--active' : index == activeMessageIndex }" v-html="message.message"></div>
      </div>
    </div>
  `,
  mounted: function() {
    lottie.loadAnimation({
      container: this.$refs.loader, // the dom element that will contain the animation
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: `${greenpeace_petition_ajax.gppt_url}/public/json/loader.json` // the path to the animation json
    })
    setInterval(() => {
      this.activeMessageIndex = this.messages && this.activeMessageIndex < this.messages.length - 1 ? this.activeMessageIndex + 1 : 0;
		}, 4000)
  },
  methods: {
  }
})
