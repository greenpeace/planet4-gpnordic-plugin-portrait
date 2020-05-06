Vue.component('background-image', {
  props: [
    'image',
  ],
  data: function() {
    return {
      c: 'image',
      run: true,
    }
  },
  template: `
		<div v-bind:style="{ 'background-image': 'url(' + image + ')' }" v-bind:class="c"></div>
  `,
  mounted: function() {
		setInterval(() => {
			if(lodash.random(0, 200) >= 195) {
        this.updateImage()
      }
		}, lodash.random(4000, 5000))
    document.addEventListener('visibilitychange', (e) => {
      this.run = !this.run
    })
  },
  methods: {
		updateImage: function() {
      if( !this.run )
        return
			jQuery.get( `${greenpeace_petition_ajax.site_url}/wp-json/gppt/v1/answers`, { petition_id: greenpeace_petition_ajax.petition.id }, result => {
				this.c = 'image image--loading'
				this.interval = lodash.random(1000, 6000)
				lodash.delay(() => {
					this.image = result[0]
					lodash.delay(() => {
						this.c = 'image image--new'
						lodash.delay(() => {
							this.c = 'image'
						}, 5000)
					}, 600)
				}, 400)
			} )
		}
  }
})
