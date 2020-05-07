Vue.component('background-image', {
  props: [
    'image',
  ],
  data: function() {
    return {
      c: 'image',
      run: true,
      stop_update: false,
      images: [],
    }
  },
  template: `
		<div v-bind:style="getImageStyle()" v-bind:class="c"></div>
  `,
  mounted: function() {
		setInterval(() => {
			if(lodash.random(0, 200) >= 195) {
        if( this.images.length > 0 ) {
          this.image = this.images[0]
          this.images.splice(0, 1)
          lodash.delay(() => {
            this.c = 'image image--new'
            lodash.delay(() => {
              this.c = 'image'
            }, 5000)
          }, 600)
        } else {
          this.updateImage()
        }
      }
		}, lodash.random(4000, 5000))
    document.addEventListener('visibilitychange', (e) => {
      this.run = !this.run
    })
  },
  methods: {
    getImageStyle: function() {
      if( !this.image )
        return {}
      return {'background-image': 'url(' + this.image + ')'}
    },
		updateImage: function() {
      if( !this.run )
        return
			jQuery.get( `${greenpeace_petition_ajax.site_url}/wp-json/gppt/v1/answers`, { petition_id: greenpeace_petition_ajax.petition.id }, result => {
				this.c = 'image image--loading'
				this.interval = lodash.random(1000, 6000)
        this.images = this.images.concat(result)
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
