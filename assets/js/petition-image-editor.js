let v = new Vue({
  el: '#gp-petition-image-editor',
  data: {
    images: greenpeace_petition_admin_ajax.images
  },
  mounted: function() {
  },
  methods: {
    approve: function( image ) {
      jQuery.post( `${greenpeace_petition_admin_ajax.site_url}/wp-json/gppt/v1/answers/${image.ID}`, { approve: 1 }, result => {
        this.images = this.images.filter(i => i.ID !== image.ID)
      } )
    },
    reject: function( image ) {
      jQuery.post( `${greenpeace_petition_admin_ajax.site_url}/wp-json/gppt/v1/answers/${image.ID}`, { approve: 0 }, result => {
        this.images = this.images.filter(i => i.ID !== image.ID)
      } )
    }
  },
})
