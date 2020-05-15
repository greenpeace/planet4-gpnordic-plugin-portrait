"use strict";jQuery(function(){new Vue({el:"#background",template:'\n\t\t\t<div class="background" :class="{\'background--blur\' : blur}"><background-image v-for="image in images" :image="image"></background-image></div>\n\t\t',data:{numBoxes:100,images:[],blur:!1},mounted:function(){var a=this;jQuery.get(greenpeace_petition_ajax.site_url+"/wp-json/gppt/v1/answers",{petition_id:greenpeace_petition_ajax.petition.id,num_images:this.numBoxes},function(t){var e=t;if(t.length<a.numBoxes)for(var i=0;i<a.numBoxes;i++)e.push(t[lodash.random(0,t.length-1)]);a.images=e}),window.addEventListener("scroll",function(t){var e=jQuery(window).scrollTop();100<e&&(a.blur=!0),e<100&&(a.blur=!1)})},methods:{}}),new Vue({el:"#app",template:'<div>\n\t\t\t<div class="join-protest" v-if="step == 5">\n\t\t\t\t<div class="tp-40 small-tp-20">\n\t\t\t\t\t<a @click="setStep(0)" class="button button--chat" v-text="greenpeace_petition_ajax.translations[\'Join the protest\']"></a>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class="category-select" v-if="step < 3">\n\t\t\t\t<div class="controls" v-if="categories.length > 1">\n\t\t\t\t\t<a @click="changeCategory(\'-\')" ></a>\n\t\t\t\t\t<h2><span v-html="greenpeace_petition_ajax.translations[\'Category\']"></span> {{ activeCategory.title }}</h2>\n\t\t\t\t\t<a class="next" @click="changeCategory(\'+\')"></a>\n\t\t\t\t</div>\n\t\t\t\t<blockquote><span v-html="activeCategory.messages[0].message"></span></blockquote>\n\t\t\t\t<a class="button button--small" v-html="greenpeace_petition_ajax.translations[\'About this demand\']" v-if="!show_category_description" @click="show_category_description = true"></a>\n\t\t\t\t<div v-show="show_category_description" v-html="activeCategory.description"></div>\n\t\t\t\t<div class="text-center">\n\t\t\t\t\t<span class="arrow"></span>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div v-if="step == 0">\n\t\t\t\t<div class="info">\n\t\t\t\t\t<p><span v-html="cta"></span></p>\n\t\t\t\t\t<a @click="setStep(1)" class="button button--chat button--blue" v-text="greenpeace_petition_ajax.translations[\'Join the protest\']"></a>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class="form-wrapper">\n\t\t\t\t<div v-if="step == 1">\n\t\t\t\t\t<video-capture :width="video_width" :height="video_height" @capture="captureImage"></video-capture>\n\t\t\t\t</div>\n\t\t\t\t<div v-if="step == 2">\n\t\t\t\t\t<canvas-editor :width="video_width" :height="video_height" :image="image" :category="activeCategory" @save="savePhoto" @clear="clearPhoto"></canvas-editor>\n\t\t\t\t</div>\n\t\t\t\t<div v-show="step == 3">\n\t\t\t\t\t<img :src="composition" class="tm-40 small-tm-20" v-if="!loading" />\n\t\t\t\t\t<div class="caption tp-40" v-if="!loading">\n\t\t\t\t\t\t<h4 v-text="encouragement"></h4>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div v-if="loading">\n\t\t\t\t\t\t<loader :messages="greenpeace_petition_ajax.translations[\'Loading\']"></loader>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="form" v-if="!loading">\n\t\t\t\t\t\t<div class="input-wrapper">\n\t\t\t\t\t\t\t<input :placeholder="greenpeace_petition_ajax.translations[\'First Name\']" type="text" v-model="details.firstname">\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="input-wrapper">\n\t\t\t\t\t\t\t<input :placeholder="greenpeace_petition_ajax.translations[\'Last Name\']" type="text" v-model="details.lastname">\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="input-wrapper">\n\t\t\t\t\t\t\t<input :placeholder="greenpeace_petition_ajax.translations[\'E-mail\']" type="text" v-model="details.email">\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="input-wrapper">\n\t\t\t\t\t\t\t<input :placeholder="greenpeace_petition_ajax.translations[\'Phone\']" type="text" v-model="details.phone">\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="input-wrapper input-wrapper--wide">\n\t\t\t\t\t\t\t<input :placeholder="greenpeace_petition_ajax.translations[\'Leave a comment\']" type="text" v-model="details.own_protest">\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="input-wrapper input-wrapper--wide legal" v-html="legal_text"></div>\n\t\t\t\t\t\t\x3c!--\n\t\t\t\t\t\t<div class="bm-20 small-bm-10">\n\t\t\t\t\t\t\t<label class="checkbox" v-if="!loading">I accept <a :href="terms_url" target="_blank">{{greenpeace_petition_ajax.translations[\'the terms\']}}</a>\n\t\t\t\t\t\t\t\t<input type="checkbox" class="checkbox__input" v-model="details.terms" />\n\t\t\t\t\t\t\t\t<div class="checkbox__box"></div>\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t<label class="checkbox" v-if="!loading">{{greenpeace_petition_ajax.translations[\'Keep me posted\']}}\n\t\t\t\t\t\t\t\t<input type="checkbox" class="checkbox__input" v-model="details.newsletter" />\n\t\t\t\t\t\t\t\t<div class="checkbox__box"></div>\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t--\x3e\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="social-sharing bp-40" v-if="!loading && articles_title !== \'\' && projections_title !== \'\'">\n\t\t\t\t\t\t<div class="social-sharing__action">\n\t\t\t\t\t\t\t<div class="social-sharing__action-text">\n\t\t\t\t\t\t\t\t<h5>{{projections_title}}</h5>\n\t\t\t\t\t\t\t\t<p v-text="projections_text"></p>\n\t\t\t\t\t\t\t\t<div class="switch" :class="{\'switch--active\' : details.projections}" @click="details.projections = !details.projections">\n\t\t\t\t\t\t\t\t\t<span :class="{\'active\' : details.projections}">{{greenpeace_petition_ajax.translations[\'Yes\']}}</span>\n\t\t\t\t\t\t\t\t\t<span :class="{\'active\' : !details.projections}">{{greenpeace_petition_ajax.translations[\'No\']}}</span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="social-sharing__action-image">\n\t\t\t\t\t\t\t <span></span>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="social-sharing__action">\n\t\t\t\t\t\t\t<div class="social-sharing__action-text">\n\t\t\t\t\t\t\t\t<h5>{{articles_title}}</h5>\n\t\t\t\t\t\t\t\t<p v-text="articles_text"></p>\n\t\t\t\t\t\t\t\t<div class="switch" :class="{\'switch--active\' : details.articles}" @click="details.articles = !details.articles">\n\t\t\t\t\t\t\t\t\t<span :class="{\'active\' : details.articles}">{{greenpeace_petition_ajax.translations[\'Yes\']}}</span>\n\t\t\t\t\t\t\t\t\t<span :class="{\'active\' : !details.articles}">{{greenpeace_petition_ajax.translations[\'No\']}}</span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="social-sharing__action-image">\n\t\t\t\t\t\t\t <span class="articles"></span>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div v-show="error" class="callout error" v-html="greenpeace_petition_ajax.translations[\'Make sure you have entered your name and provided a working e-mail address.\']"></div>\n\t\t\t\t\t<div class="button-wrapper" v-if="!loading">\n\t\t\t\t\t\t<a class="button button--back button--secondary" @click="step = 2" v-html="greenpeace_petition_ajax.translations[\'Back\']"></a>\n\t\t\t\t\t\t<a class="button button--send" @click="submit()" v-html="greenpeace_petition_ajax.translations[\'Send\']"></a>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class="bullets" v-if="step < 4 && step > 0">\n\t\t\t\t\t<div class="bullet" v-for="i in 3" @click="i < 3 && setStep(i)" :class="{ \'bullet--active\' : step == i }"></div>\n\t\t\t\t</div>\n\t\t\t\t<div class="tp-60 small-tp-40" v-show="step == 4">\n\t\t\t\t\t<img :src="composition" />\n\t\t\t\t\t<div class="caption tp-30 bp-50">\n\t\t\t\t\t\t<div v-html="thank_you_text"></div>\n\t\t\t\t\t\t<div class="tm-30">\n\t\t\t\t\t\t\t<a :href="thank_you_image" target="_blank" class="button" v-html="greenpeace_petition_ajax.translations[\'Download image\']"></a>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>',data:{step:0,video_width:640,video_height:640,canvas:{},image:"",composition:"",composition_no_text:"",show_category_description:!1,details:{firstname:"",lastname:"",email:"",phone:"",own_protest:"",terms:!0,newsletter:!0,projections:!0,articles:!0},categories:greenpeace_petition_ajax.petition.categories,cta:greenpeace_petition_ajax.petition.cta,thank_you_image:greenpeace_petition_ajax.petition.thank_you_image,thank_you_text:greenpeace_petition_ajax.petition.thank_you_text,terms_url:greenpeace_petition_ajax.petition.terms_url,join_protest_text:greenpeace_petition_ajax.petition.join_protest_text,projections_title:greenpeace_petition_ajax.petition.projections_title,projections_text:greenpeace_petition_ajax.petition.projections_text,articles_title:greenpeace_petition_ajax.petition.articles_title,articles_text:greenpeace_petition_ajax.petition.articles_text,encouragement:greenpeace_petition_ajax.petition.encouragement,legal_text:greenpeace_petition_ajax.petition.legal_text,active_category_index:0,error:!1,loading:!1,colors:[{foreground:"#FFFFFF",background:"#26AFDC"},{foreground:"#FFFFB9",background:"#00334B"},{foreground:"#00334B",background:"#FFFFB9"}],active_color_index:0},mounted:function(){this.getQueryVariable("join")&&(this.setStep(5),jQuery("body").addClass("join")),jQuery("body").css({"background-color":"#093944"}),Vue.nextTick(function(){})},computed:{activeCategory:function(){return this.categories[this.active_category_index]}},methods:{getQueryVariable:function(t){var e=window.location.search.substring(1).split("&");return e[0]==t&&e[0]},getDownloadable:function(){return this.composition?(console.log(this.composition),URL.createObjectURL(this.composition)):""},captureImage:function(t){this.image=t,this.setStep(2)},clearPhoto:function(){this.setStep(1)},savePhoto:function(t){this.composition=t.image,this.composition_no_text=t.image_no_text,this.setStep(3)},submit:function(){var e=this;this.error=!this.details.terms||""===this.details.firstname||""===this.details.lastname||""===this.details.email||!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(this.details.email).toLowerCase()),this.error||(this.loading=!0,this.scrollFormIntoView(),jQuery.post(greenpeace_petition_ajax.site_url+"/wp-json/gppt/v1/answers",{petition_id:greenpeace_petition_ajax.petition.id,utm:greenpeace_petition_ajax.utm,image:this.composition,image_no_text:this.composition_no_text,firstname:this.details.firstname,lastname:this.details.lastname,email:this.details.email,phone:this.details.phone,own_protest:this.details.own_protest,terms:this.details.terms,newsletter:this.details.newsletter,projections:this.details.projections,articles:this.details.articles,nonce:greenpeace_petition_ajax.nonce},function(t){e.loading=!1,e.setStep(4),e.thank_you_image=t,dataLayer&&dataLayer.push({event:"engagementPlugin"})}))},setStep:function(e){var i=this;this.step=e,this.show_category_description=!1,Vue.nextTick(function(){if(1==i.step){var t=jQuery(".video-wrapper");i.video_width=t[0].offsetWidth,i.video_height=t[0].offsetWidth}jQuery("body").attr("data-step",e),0!==i.step&&5!==i.step&&i.scrollFormIntoView()})},scrollFormIntoView:function(){var t=jQuery(".form-wrapper").offset();jQuery("html, body").stop().animate({scrollTop:t.top-80},500,"swing",function(){})},changeCategory:function(t){return this.active_category_index="+"==t?this.active_category_index<this.categories.length-1?this.active_category_index+1:0:0<this.active_category_index?this.active_category_index-1:this.categories.length-1}}})});