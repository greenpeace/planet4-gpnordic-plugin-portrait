let v = new Vue({
  el: '#gp-petition-image-editor',
  data: {
    images: greenpeace_petition_admin_ajax.images,
    petition_id: greenpeace_petition_admin_ajax.petition_id
  },
  mounted: function() {
  },
  methods: {
    approve: function( image ) {
      $.ajax({
        url: `${greenpeace_petition_admin_ajax.site_url}/wp-json/gppt/v1/answers`,
        type: 'PUT',
        data: { approve: 1, id: image.ID, petition_id: this.petition_id },
        success: (result) =>  {
          this.images = this.images.filter(i => i.ID !== image.ID)
        }
      })
    },
    reject: function( image ) {
      $.ajax({
        url: `${greenpeace_petition_admin_ajax.site_url}/wp-json/gppt/v1/answers`,
        type: 'PUT',
        data: { approve: 0, id: image.ID, petition_id: this.petition_id },
        success: (result) => {
          this.images = this.images.filter(i => i.ID !== image.ID)
        }
      })
    }
  },
})
