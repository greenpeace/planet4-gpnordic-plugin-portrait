jQuery(function() {
	new Vue({
		el: '#background',
		template: `
			<div class="background" :class="{'background--blurr' : blurr}"><background-image v-for="image in images" :image="image"></background-image></div>
		`,
		data: {
			numBoxes: 100,
			images: [],
			blurr: false,
		},
		mounted: function() {
			jQuery.get( `https://randomuser.me/api/?results=${this.numBoxes}`, (result) => {
				this.images = result.results.map(u => u.picture.large)
			} )

			window.addEventListener('scroll', (e) => {
				let scrollTop = jQuery(window).scrollTop()
				if( scrollTop > 100 ) {
					this.blurr = true
				}
				if( scrollTop < 100 ) {
					this.blurr = false
				}
			});



		},
		methods: {
		}
	})

	new Vue({
		el: '#app',
		template: `<div>
			<div class="category-select">
				<div class="controls">
					<a @click="changeCategory('-')"></a>
					<h2 v-html="'<span>Category:</span> ' + activeCategory.title"></h2>
					<a class="next" @click="changeCategory('+')"></a>
				</div>
				<blockquote><span v-html="activeCategory.messages[0].message"></span></blockquote>
				<h6>About this demand</h6>
				<div v-html="activeCategory.description"></div>
				<div class="text-center">
					<span class="arrow"></span>
				</div>
			</div>
			<div v-if="step == 0">
				<div class="info">
					<p><span v-html="cta"></span></p>
					<a @click="setStep(1)" class="button button--chat button--blue">Delta i protesten</a>
				</div>
			</div>
			<div class="form-wrapper">
			<!--
				<div class="bullets" v-if="step < 4 && step > 0">
					<div class="bullet" v-for="i in 3" @click="i < 3 && setStep(i)" :class="{ 'bullet--active' : step == i }"></div>
				</div>
				-->
				<div v-if="step == 1">
				  <!--<div class="caption">
						<h3>1</h3>
						<p>Ta en bild genom att godkänn användning av kameran på din dator/mobil och delta i protesten. Du kan även fortsätta utan bild.</p>
					</div>
					-->
					<video-capture :width="video_width" :height="video_height" @capture="captureImage"></video-capture>
				</div>
				<div v-if="step == 2">
					<!-- <div class="caption">
						<h3>2</h3>
						<p>Ta en bild genom att godkänn användning av kameran på din dator/mobil och delta i protesten. Du kan även fortsätta utan bild.</p>
					</div> -->
					<canvas-editor :width="video_width" :height="video_height" :image="image" :category="activeCategory" @save="savePhoto" @clear="clearPhoto"></canvas-editor>
				</div>
				<div v-show="step == 3">
					<img :src="composition" class="tm-40 small-tm-20" v-if="!loading" />

					<div class="caption tp-40" v-if="!loading">
						<!--<h3>3</h3>-->
						<h4>Ge finansministern dina lånevillkor genom att signera nedan.</h4>
						<p>Ta en bild genom att godkänn användning av kameran på din dator/mobil och delta i protesten. Du kan även fortsätta utan bild.</p>
					</div>
					<div style="min-height: 700px;" v-if="loading">
						<loader></loader>
					</div>
					<div class="form" v-if="!loading">
						<div class="input-wrapper">
							<input placeholder="First Name" type="text" v-model="details.firstname">
						</div>
						<div class="input-wrapper">
							<input placeholder="Last Name" type="text" v-model="details.lastname">
						</div>
						<div class="input-wrapper">
							<input placeholder="E-mail" type="text" v-model="details.email">
						</div>
						<div class="input-wrapper">
							<input placeholder="Telefonnummer" type="text" v-model="details.phone">
						</div>
						<div class="input-wrapper input-wrapper--wide">
							<input placeholder="Telefonnummer" type="text" v-model="details.own_protest">
						</div>
						<div class="bm-50">
							<label class="checkbox" v-if="!loading">I accept <a href="#">the terms</a>
								<input type="checkbox" class="checkbox__input" v-model="details.terms" />
								<div class="checkbox__box"></div>
							</label>
							<label class="checkbox" v-if="!loading">Keep me posted
								<input type="checkbox" class="checkbox__input" v-model="details.newsletter" />
								<div class="checkbox__box"></div>
							</label>
						</div>
					</div>
					<div v-show="error" class="callout error">Kontrollera att du fyllt i ditt namn och angett en fungerande e-postadress.</div>
					<div class="button-wrapper" v-if="!loading">
						<a class="button button--back button--secondary" @click="step = 2">Tillbaka</a>
						<a class="button button--send" @click="submit()">Skicka</a>
					</div>
				</div>
				<div class="bullets" v-if="step < 4 && step > 0">
					<div class="bullet" v-for="i in 3" @click="i < 3 && setStep(i)" :class="{ 'bullet--active' : step == i }"></div>
				</div>
				<div class="tp-60 small-tp-40" v-show="step == 4">
					<img :src="composition" />
					<div class="caption tp-30">
						<h1>Tack!</h1>
						<p>Ta en bild genom att godkänna användning av kameran på din dator/mobil och delta i protesten. Du kan även fortsätta utan bild.</P>
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
			details: {
				firstname: 'Jens',
				lastname: 'W',
				email: 'jens@simmalugnt.se',
				phone: '+46 702 059300',
				own_protest: 'This is my own protest',
				terms: false,
				newsletter: false,
			},
			categories: greenpeace_petition_ajax.petition.categories,
			cta: greenpeace_petition_ajax.petition.cta,
			active_category_index: 0,
			error: false,
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
		mounted: function() {
			Vue.nextTick(() => {
			})
		},
		computed: {
			activeCategory: function() {
				return this.categories[ this.active_category_index ]
			}
		},
		methods: {
			captureImage: function(image) {
				this.image = image
				this.setStep( 2 )
			},
			clearPhoto: function() {
				this.setStep( 1 )
			},
			savePhoto: function(images) {
				this.composition = images.image
				this.composition_no_text = images.image_no_text
				this.setStep( 3 )
			},
			submit: function() {
				let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				this.error = this.details.firstname === '' || this.details.lastname === '' || this.details.email === '' || !re.test(String(this.details.email).toLowerCase())
				if( !this.error ) {
					this.loading = true
					jQuery.post( `${greenpeace_petition_ajax.site_url}/wp-json/gppt/v1/answers`, { petition_id: greenpeace_petition_ajax.petition.id, utm: greenpeace_petition_ajax.utm, image: this.composition, image_no_text: this.composition_no_text, firstname: this.details.firstname, lastname: this.details.lastname, email: this.details.email, phone: this.details.phone, nonce: greenpeace_petition_ajax.nonce }, response => {
						this.loading = false
						this.setStep( 4 )
					} )
				}
			},
			setStep: function( step ) {
				this.step = step
				if( this.step == 1 ) {
					Vue.nextTick(() => {
						let video_wrapper = jQuery('.video-wrapper')
						this.video_width = video_wrapper[0].offsetWidth
						this.video_height = video_wrapper[0].offsetWidth
					})
				}
				if( this.step == 2 ) {
				}
			},
			changeCategory: function( direction ) {
				console.log( direction, this.active_category_index, this.categories.length )
				if( direction == '+' )
					return this.active_category_index = this.active_category_index < this.categories.length - 1 ? this.active_category_index + 1 : 0
				return this.active_category_index = this.active_category_index > 0 ? this.active_category_index - 1 : this.categories.length - 1
			},
		}
	})
})
