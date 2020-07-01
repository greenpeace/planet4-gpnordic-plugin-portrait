Vue.component('facebook-image', {
  props: [
    'classes',
    'caption',
  ],
  data: function() {
    return {
      
    }
  },
  template: `
    <a @click="login" :class="this.classes">Use Facebook profile-picture</a>
`,
  mounted: function() {

  jQuery.getScript("//connect.facebook.net/en_US/sdk.js", function (data, textStatus, jqxhr) {
  window.fbAsyncInit = function() {
      FB.init({
        appId: greenpeace_petition_ajax.facebook_app_id,
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v7.0'
      })
    }
  })
  },
  destroyed: function() {
  },
  methods: {
    login: function() {
      FB.login(response => {
        if (response.authResponse) {
          FB.api('/me/picture/', { redirect: false, width: 640 }, img_response => {
            this.$emit('capture', img_response.data)
          })
        } else {
          console.log('User cancelled login or did not fully authorize.')
        }
      })
    }
  }
})
