"use strict";Vue.component("facebook-image",{props:["classes","caption"],data:function(){return{}},template:'\n    <a @click="login" :class="this.classes">Use Facebook profile-picture</a>\n',mounted:function(){jQuery.getScript("//connect.facebook.net/en_US/sdk.js",function(e,n,o){window.fbAsyncInit=function(){FB.init({appId:greenpeace_petition_ajax.facebook_app_id,autoLogAppEvents:!0,xfbml:!0,version:"v7.0"})}})},destroyed:function(){},methods:{login:function(){var n=this;FB.login(function(e){e.authResponse?FB.api("/me/picture/",{redirect:!1,width:640},function(e){n.$emit("capture",e.data)}):console.log("User cancelled login or did not fully authorize.")})}}});