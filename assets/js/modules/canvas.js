Vue.component('canvas-editor', {
  props: [
    'width',
    'height',
		'image',
    'category',
  ],
  data: function() {
    return {
      canvas: {},
			activeColorIndex: 0,
      activeMessageIndex: 0,
			text: {},
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
    }
  },
  template: `
    <div>
      <div class="canvas-wrapper">
        <canvas id="canvas" v-bind:width="width" v-bind:height="height"></canvas>
        <div class="canvas-colors">
          <div class="color" v-bind:class="{ 'color--active' : activeColorIndex == index }" @click="setColor( index )" v-bind:style="{ 'background-color': color.background }" v-for="(color, index) in colors">
            <svg width="144px" height="144px" viewBox="0 0 144 144" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="color">
                  <path d="M85.4939759,92 L85.4939759,100 L40,100 L40,92 L85.4939759,92 Z M104,76 L104,84 L40,84 L40,76 L104,76 Z M104,60 L104,68 L40,68 L40,60 L104,60 Z M104,44 L104,52 L40,52 L40,44 L104,44 Z" id="fg" v-bind:fill="color.foreground"></path>
                </g>
              </g>
            </svg>
          </div>
        </div>
        <div class="canvas-controls" v-if="category.messages.length > 1">
          <a @click="changeMessage('-')"></a>
          <a class="next" @click="changeMessage('+')"></a>
        </div>
      </div>
      <p class="canvas-instructions">Ta en bild genom att godkänn användning av kameran på din dator/mobil och delta i protesten. Du kan även fortsätta utan bild.</p>
      <div class="button-wrapper">
			   <a class="button button--back button--secondary" @click="clear()">Tillbaka</a>
			   <a class="button button--brush" @click="save()">Gå vidare</a>
      </div>
    </div>
  `,
  mounted: function() {
    Vue.nextTick(() => {
			this.canvas = new fabric.Canvas('canvas')
			this.canvas.backgroundColor = this.activeColor.background
			let fonts = [ 'bureau-grot-condensed' ]
			Promise.all(
				fonts.map(f => new FontFaceObserver(f).load())
			).then(() => {
				if( this.image ) {
					this.canvas.add( this.image )
				}
				this.text = new fabric.IText(this.activeMessage.message, {
					fontFamily: 'bureau-grot-condensed',
					fontSize: this.width < 640 ? this.activeMessage.font_size / 2 : this.activeMessage.font_size,
					fill: this.activeColor.foreground,
					left: 100,
					top: 100,
				})
				this.canvas.add( this.text )
				this.text.center()
			})
    })
  },
  computed: {
    activeMessage: function() {
      return this.category.messages[ this.activeMessageIndex < this.category.messages.length ? this.activeMessageIndex : 0 ]
    },
    activeColor: function() {
      return this.colors[ this.activeColorIndex ]
    },
  },
  watch: {
    // whenever category changes, this function will run
    category: function (c) {
      this.updateMessage()
    }
  },
  destroyed: function() {
  },
  methods: {
    save: function() {
      let scale = 2
			this.canvas.width = this.canvas.width * scale
			this.canvas.height = this.canvas.height * scale
      this.text.set({
        scaleX: this.text.scaleX * scale,
        scaleY: this.text.scaleY * scale,
        left: this.text.left * scale,
        top: this.text.top * scale
      })
      this.image && this.image.set({
        scaleX: scale,
        scaleY: scale,
      })
      let images = {
        image: this.canvas.toDataURL('image/jpg', 0.9),
        image_no_text: null
      }
      this.text.set({
        opacity: 0
      })
      images.image_no_text = this.canvas.toDataURL('image/jpg', 0.9)
      this.$emit('save', images)
      this.text.set({
        scaleX: this.text.scaleX * 0.5,
        scaleY: this.text.scaleY * 0.5,
        left: this.text.left * 0.5,
        top: this.text.top * 0.5,
        opacity: 1
      })
      this.image && this.image.set({
        scaleX: 1,
        scaleY: 1,
      })
    },
		clear: function() {
			this.$emit('clear')
		},
		setColor: function( index ) {
			this.activeColorIndex = index
			this.text.set('fill', this.activeColor.foreground)
			this.canvas.backgroundColor = this.activeColor.background
			this.updateCanvas()
		},
    changeMessage: function( direction ) {
      if( direction == '+' ) {
        this.activeMessageIndex = this.activeMessageIndex < this.category.messages.length - 1 ? this.activeMessageIndex + 1 : 0
      } else {
        this.activeMessageIndex = this.activeMessageIndex > 0 ? this.activeMessageIndex - 1 : this.category.messages.length - 1
      }
      this.updateMessage()
    },
    updateMessage: function() {
      this.text.set({
        text: this.activeMessage.message,
        fontSize: this.width < 640 ? this.activeMessage.font_size / 2 : this.activeMessage.font_size,
      })
      this.text.center()
      this.updateCanvas()
    },
		updateCanvas: function() {
			this.canvas.renderAll()
		}
  }
})
