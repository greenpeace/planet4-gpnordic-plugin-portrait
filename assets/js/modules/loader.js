Vue.component('loader', {
  props: [
  ],
  data: function() {
    return {
    }
  },
  template: `
		<div ref="loader" class="loader"></div>
  `,
  mounted: function() {

    lottie.loadAnimation({
      container: this.$refs.loader, // the dom element that will contain the animation
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: `${greenpeace_petition_ajax.gppt_url}/public/json/loader.json` // the path to the animation json
    })
  },
  methods: {
  }
})
