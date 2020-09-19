jQuery(function () {
	if (document.getElementById('gp-petition'))
		new Vue({
			el: '#background',
			template: `
			<div class="background" :class="{'background--blur' : blur}"><background-image v-for="image in images" :image="image"></background-image></div>
		`,
			data: {
				numBoxes: 100,
				images: [],
				blur: false,
			},
			mounted: function () {
				jQuery.get(`${greenpeace_petition_ajax.site_url}/wp-json/gppt/v1/answers`, { petition_id: greenpeace_petition_ajax.petition.id, num_images: this.numBoxes }, (result) => {
					result = Array.isArray(result) ? result : Object.values(result)
					let images = result
					if (result.length < this.numBoxes) {
						for (let i = 0; i < this.numBoxes; i++) {
							images.push(result[lodash.random(0, result.length - 1)])
						}
					}
					this.images = images
				})
				window.addEventListener('scroll', (e) => {
					let scrollTop = jQuery(window).scrollTop()
					if (scrollTop > 100) {
						this.blur = true
					}
					if (scrollTop < 100) {
						this.blur = false
					}
				});
			},
			methods: {
			}
		})
	if (document.getElementById('gp-petition'))
		new Vue({
			el: '#app',
			template: `<div>
				<div class="join-protest" v-if="step == 5">
					<div class="tp-40 small-tp-20">
						<a @click="setStep(0)" class="button button--chat" v-text="greenpeace_petition_ajax.translations['Join the protest']"></a>
					</div>
				</div>
				<!-- Categories -->
				<div class="category-select" v-if="step < 3 && categories.length > 1">
					<div class="controls">
						<a @click="changeCategory('-')" ></a>
						<h2><span v-html="greenpeace_petition_ajax.translations['Category']"></span> {{ activeCategory.title }}</h2>
						<a class="next" @click="changeCategory('+')"></a>
					</div>
					<blockquote><span v-html="activeCategory.messages[0].message"></span></blockquote>
					<a class="button button--small" v-html="greenpeace_petition_ajax.translations['About this demand']" v-if="!show_category_description" @click="showCategoryDescription()"></a>
					<div v-show="show_category_description" v-html="activeCategory.description"></div>
					<div class="text-center">
						<span class="arrow"></span>
					</div>
				</div>
				<!-- Step 0 -->
				<div v-if="step == 0">
					<div class="info">
						<p><span v-html="cta"></span></p>
						<a @click="setStep(1)" class="button button--chat button--blue" v-text="greenpeace_petition_ajax.translations['Join the protest']"></a>
					</div>
				</div>
				<div class="form-wrapper">
					<div v-if="step == 1">
						<video-capture :width="video_width" :height="video_height" @capture="captureImage"></video-capture>
					</div>
					<div v-if="step == 2">
						<canvas-editor :width="video_width" :height="video_height" :image="image" :category="activeCategory" @save="savePhoto" @clear="clearPhoto"></canvas-editor>
					</div>
					<div v-show="step == 3">
						<img :src="composition" class="tm-40 small-tm-20" v-if="!loading" />
						<div class="caption tp-40" v-if="!loading">
							<h4 v-text="encouragement"></h4>
						</div>
						<div v-if="loading">
							<loader :messages="greenpeace_petition_ajax.translations['Loading']"></loader>
						</div>
						<div class="form" v-if="!loading">
							<div class="input-wrapper">
								<input :placeholder="greenpeace_petition_ajax.translations['First Name']" type="text" v-model="details.firstname">
							</div>
							<div class="input-wrapper">
								<input :placeholder="greenpeace_petition_ajax.translations['Last Name']" type="text" v-model="details.lastname">
							</div>
							<div class="input-wrapper">
								<input :placeholder="greenpeace_petition_ajax.translations['E-mail']" type="text" v-model="details.email">
							</div>
							<div class="input-wrapper">
								<input :placeholder="greenpeace_petition_ajax.translations['Phone']" type="text" v-model="details.phone">
							</div>
							<div class="input-wrapper input-wrapper--wide">
								<input :placeholder="greenpeace_petition_ajax.translations['Leave a comment']" type="text" v-model="details.own_protest">
							</div>
							<div class="input-wrapper input-wrapper--wide legal" v-html="legal_text"></div>
							<!--
							<div class="bm-20 small-bm-10">
								<label class="checkbox" v-if="!loading">I accept <a :href="terms_url" target="_blank">{{greenpeace_petition_ajax.translations['the terms']}}</a>
									<input type="checkbox" class="checkbox__input" v-model="details.terms" />
									<div class="checkbox__box"></div>
								</label>
								<label class="checkbox" v-if="!loading">{{greenpeace_petition_ajax.translations['Keep me posted']}}
									<input type="checkbox" class="checkbox__input" v-model="details.newsletter" />
									<div class="checkbox__box"></div>
								</label>
							</div>
							-->
						</div>
						<div class="social-sharing bp-40" v-if="!loading && articles_title !== '' && projections_title !== ''">
							<div class="social-sharing__action">
								<div class="social-sharing__action-text">
									<h5>{{projections_title}}</h5>
									<p v-text="projections_text"></p>
									<div class="switch" :class="{'switch--active' : details.projections}" @click="details.projections = !details.projections">
										<span :class="{'active' : details.projections}">{{greenpeace_petition_ajax.translations['Yes']}}</span>
										<span :class="{'active' : !details.projections}">{{greenpeace_petition_ajax.translations['No']}}</span>
									</div>
								</div>
								<div class="social-sharing__action-image">
								<span></span>
								</div>
							</div>
							<div class="social-sharing__action">
								<div class="social-sharing__action-text">
									<h5>{{articles_title}}</h5>
									<p v-text="articles_text"></p>
									<div class="switch" :class="{'switch--active' : details.articles}" @click="details.articles = !details.articles">
										<span :class="{'active' : details.articles}">{{greenpeace_petition_ajax.translations['Yes']}}</span>
										<span :class="{'active' : !details.articles}">{{greenpeace_petition_ajax.translations['No']}}</span>
									</div>
								</div>
								<div class="social-sharing__action-image">
								<span class="articles"></span>
								</div>
							</div>
						</div>
						<div v-show="error" class="callout error" v-html="error_message"></div>
						<div class="button-wrapper" v-if="!loading">
							<a class="button button--back button--secondary" @click="step = 2" v-html="greenpeace_petition_ajax.translations['Back']"></a>
							<a class="button button--send" @click="submit()" v-html="greenpeace_petition_ajax.translations['Send']"></a>
						</div>
					</div>
					<div class="bullets" v-if="step < 4 && step > 0">
						<div class="bullet" v-for="i in 3" @click="i < 3 && setStep(i)" :class="{ 'bullet--active' : step == i }"></div>
					</div>
					<div class="tp-60 small-tp-40" v-show="step == 4">
						<img :src="composition" />
						<div class="caption tp-30 bp-50">
							<div v-html="thank_you_text"></div>
							<div class="tm-30" v-show="greenpeace_petition_ajax.translations['Download image'] !== ''">
								<a @click="downloadImage()" :href="thank_you_image" target="_blank" class="button" v-html="greenpeace_petition_ajax.translations['Download image']"></a>
							</div>
							<div class="tm-30">
								<div class="">
									<a @click="share('Facebook')" :href="'https://www.facebook.com/sharer/sharer.php?u=' + greenpeace_petition_ajax.petition.url" target="_blank" class="button button--small button--facebook">Del på Facebook</a>
									<a @click="share('Twitter')" :href="'https://twitter.com/home?status=' + greenpeace_petition_ajax.petition.url" target="_blank" class="button button--small button--twitter">Del på Twitter</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>`,
			data: {
				step: 0,
				video_width: 640,
				video_height: 640,
				canvas: {},
				image: '',
				composition: '',
				composition_no_text: '',
				show_category_description: false,
				details: {
					firstname: '',
					lastname: '',
					email: '',
					phone: '',
					own_protest: '',
					terms: true,
					newsletter: true,
					projections: true,
					articles: true,
				},
				categories: greenpeace_petition_ajax.petition.categories,
				cta: greenpeace_petition_ajax.petition.cta,
				thank_you_image: greenpeace_petition_ajax.petition.thank_you_image,
				thank_you_text: greenpeace_petition_ajax.petition.thank_you_text,
				terms_url: greenpeace_petition_ajax.petition.terms_url,
				join_protest_text: greenpeace_petition_ajax.petition.join_protest_text,
				projections_title: greenpeace_petition_ajax.petition.projections_title,
				projections_text: greenpeace_petition_ajax.petition.projections_text,
				articles_title: greenpeace_petition_ajax.petition.articles_title,
				articles_text: greenpeace_petition_ajax.petition.articles_text,
				encouragement: greenpeace_petition_ajax.petition.encouragement,
				legal_text: greenpeace_petition_ajax.petition.legal_text,
				active_category_index: 0,
				error: false,
				error_message: '',
				loading: false,
				colors: [
					{
						foreground: '#FFFFFF',
						background: '#26AFDC'
					},
					{
						foreground: '#FFFFB9',
						background: '#00334B'
					},
					{
						foreground: '#00334B',
						background: '#FFFFB9'
					},
				],
				active_color_index: 0,
			},
			mounted: function () {
				if (this.getQueryVariable('join')) {
					this.setStep(5)
					jQuery('body').addClass('join')
				}
				jQuery('body').css({ 'background-color': '#093944' })
				Vue.nextTick(() => {

				})
			},
			computed: {
				activeCategory: function () {
					return this.categories[this.active_category_index]
				}
			},
			methods: {
				share: function (some) {
					if (typeof dataLayer !== 'undefined') {
						dataLayer.push({
							'event': 'uaevent',
							'eventCategory': 'Social Share',
							'eventAction': some
						})
					}
				},
				downloadImage: function () {
					if (typeof dataLayer !== 'undefined') {
						dataLayer.push({
							'event': 'engagementPluginOptions',
							'eventAction': 'download image'
						})
					}
				},
				showCategoryDescription: function () {
					this.show_category_description = true
					if (typeof dataLayer !== 'undefined') {
						dataLayer.push({
							'event': 'engagementPluginOptions',
							'eventAction': 'read more about the requirement'
						})
					}
				},
				getQueryVariable: function (variable) {
					let query = window.location.search.substring(1);
					let vars = query.split("&");
					if (vars[0] == variable) {
						return vars[0]
					}
					return (false);
				},
				getDownloadable: function () {
					if (!this.composition)
						return ''
					return URL.createObjectURL(this.composition)
				},
				captureImage: function (image) {
					this.image = image
					this.setStep(2)
				},
				clearPhoto: function () {
					this.setStep(1)
				},
				savePhoto: function (images) {
					this.composition = images.image
					this.composition_no_text = images.image_no_text
					this.setStep(3)
				},
				submit: function () {
					let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
					this.error = !this.details.terms || this.details.firstname === '' || this.details.lastname === '' || this.details.email === '' || !re.test(String(this.details.email).toLowerCase())
					this.error_message = greenpeace_petition_ajax.translations['Make sure you have entered your name and provided a working e-mail address.']
					if (!this.error) {
						this.loading = true
						this.scrollFormIntoView()
						jQuery.ajax({
							type: 'POST',
							url: `${greenpeace_petition_ajax.site_url}/wp-json/gppt/v1/answers`,
							data: {
								petition_id: greenpeace_petition_ajax.petition.id,
								utm: greenpeace_petition_ajax.utm,
								image: this.composition,
								image_no_text: this.composition_no_text,
								firstname: this.details.firstname,
								lastname: this.details.lastname,
								email: this.details.email,
								phone: this.details.phone,
								own_protest: this.details.own_protest,
								terms: this.details.terms,
								newsletter: this.details.newsletter,
								projections: this.details.projections,
								articles: this.details.articles,
								// nonce: greenpeace_petition_ajax.nonce
							},
							dataType: 'json',
							headers: {
								'X-WP-Nonce': greenpeace_petition_ajax.nonce
							},
							success: response => {
								this.loading = false
								this.setStep(4)
								this.thank_you_image = response
								if (typeof dataLayer !== 'undefined') {
									dataLayer.push({
										'event': 'engagementPlugin',
										'eventAction': 'Final submission',
										'eventLabel': 'step 4'
									})
								}
							},
							error: error => {
								console.log('error', error)
								this.loading = false
								this.error = true
								this.error_message = error.responseJSON.message
							}
						})
					}
				},
				setStep: function (step) {
					this.step = step
					this.show_category_description = false
					Vue.nextTick(() => {
						if (this.step == 0) {
							if (typeof dataLayer !== 'undefined') {
								dataLayer.push({
									'event': 'engagementPlugin',
									'eventAction': 'be part of the demonstration',
									'eventLabel': 'step 1'
								})
							}
						}
						if (this.step == 1) {
							let video_wrapper = jQuery('.video-wrapper')
							this.video_width = video_wrapper[0].offsetWidth
							this.video_height = video_wrapper[0].offsetWidth
						}
						jQuery('body').attr('data-step', step)
						if (this.step !== 0 && this.step !== 5) {
							this.scrollFormIntoView()
						}
					})
				},
				scrollFormIntoView() {
					let position = jQuery('.form-wrapper').offset()
					jQuery('html, body').stop().animate({ scrollTop: position.top - 80 }, 500, 'swing', () => { })
				},
				changeCategory: function (direction) {
					if (typeof dataLayer !== 'undefined') {
						dataLayer.push({
							'event': 'engagementPluginOptions',
							'eventAction': 'requirements arrows'
						})
					}
					if (direction == '+')
						return this.active_category_index = this.active_category_index < this.categories.length - 1 ? this.active_category_index + 1 : 0
					return this.active_category_index = this.active_category_index > 0 ? this.active_category_index - 1 : this.categories.length - 1
				},
			}
		})

	if (document.getElementById('petition-grid')) {
		let lazyLoadInstance = new LazyLoad({
			elements_selector: ".gp-petition--grid__background img",
			// container: document.getElementById('')
		})
	}
})
