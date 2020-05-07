"use strict";Vue.component("canvas-editor",{props:["width","height","image","category"],data:function(){return{canvas:{},activeColorIndex:0,activeMessageIndex:0,text:{},colors:[{foreground:"#FFFFFF",background:"#26AFDC"},{foreground:"#FFFFB9",background:"#00334B"},{foreground:"#00334B",background:"#FFFFB9"}]}},template:'\n    <div>\n      <div class="canvas-wrapper">\n        <canvas id="canvas" v-bind:width="width" v-bind:height="height"></canvas>\n        <div class="canvas-colors">\n          <div class="color" v-bind:class="{ \'color--active\' : activeColorIndex == index }" @click="setColor( index )" v-bind:style="{ \'background-color\': color.background }" v-for="(color, index) in colors">\n            <svg width="144px" height="144px" viewBox="0 0 144 144" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n              <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n                <g id="color">\n                  <path d="M85.4939759,92 L85.4939759,100 L40,100 L40,92 L85.4939759,92 Z M104,76 L104,84 L40,84 L40,76 L104,76 Z M104,60 L104,68 L40,68 L40,60 L104,60 Z M104,44 L104,52 L40,52 L40,44 L104,44 Z" id="fg" v-bind:fill="color.foreground"></path>\n                </g>\n              </g>\n            </svg>\n          </div>\n        </div>\n        <div class="canvas-controls" v-if="category.messages.length > 1">\n          <a @click="changeMessage(\'-\')"></a>\n          <a class="next" @click="changeMessage(\'+\')"></a>\n        </div>\n      </div>\n      <div class="button-wrapper">\n\t\t\t   <a class="button button--back button--secondary" @click="clear()" v-html="greenpeace_petition_ajax.translations[\'Back\']"></a>\n\t\t\t   <a class="button button--brush" @click="save()" v-html="greenpeace_petition_ajax.translations[\'Next step\']"></a>\n      </div>\n    </div>\n  ',mounted:function(){var e=this;Vue.nextTick(function(){e.canvas=new fabric.Canvas("canvas"),e.canvas.backgroundColor=e.activeColor.background;Promise.all(["bureau-grot-condensed"].map(function(e){return new FontFaceObserver(e).load()})).then(function(){e.image&&e.canvas.add(e.image),e.text=new fabric.IText(e.activeMessage.message,{fontFamily:"bureau-grot-condensed",fontSize:e.width<640?e.activeMessage.font_size/2:e.activeMessage.font_size,fill:e.activeColor.foreground,left:100,top:100}),e.canvas.add(e.text),e.text.center()})})},computed:{activeMessage:function(){return this.category.messages[this.activeMessageIndex<this.category.messages.length?this.activeMessageIndex:0]},activeColor:function(){return this.colors[this.activeColorIndex]}},watch:{category:function(){this.updateMessage()}},destroyed:function(){},methods:{save:function(){this.canvas.width=2*this.canvas.width,this.canvas.height=2*this.canvas.height,this.text.set({scaleX:2*this.text.scaleX,scaleY:2*this.text.scaleY,left:2*this.text.left,top:2*this.text.top}),this.image&&this.image.set({scaleX:2,scaleY:2});var e={image:this.canvas.toDataURL("image/jpg",.9),image_no_text:null};this.text.set({opacity:0}),e.image_no_text=this.canvas.toDataURL("image/jpg",.9),this.$emit("save",e),this.text.set({scaleX:.5*this.text.scaleX,scaleY:.5*this.text.scaleY,left:.5*this.text.left,top:.5*this.text.top,opacity:1}),this.image&&this.image.set({scaleX:1,scaleY:1})},clear:function(){this.$emit("clear")},setColor:function(e){this.activeColorIndex=e,this.text.set("fill",this.activeColor.foreground),this.canvas.backgroundColor=this.activeColor.background,this.updateCanvas()},changeMessage:function(e){this.activeMessageIndex="+"==e?this.activeMessageIndex<this.category.messages.length-1?this.activeMessageIndex+1:0:0<this.activeMessageIndex?this.activeMessageIndex-1:this.category.messages.length-1,this.updateMessage()},updateMessage:function(){this.text.set({text:this.activeMessage.message,fontSize:this.width<640?this.activeMessage.font_size/2:this.activeMessage.font_size}),this.text.center(),this.updateCanvas()},updateCanvas:function(){this.canvas.renderAll()}}});