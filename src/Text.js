
import * as THREE from "three";

export class Text {
    constructor(text = "Simbirsoft") {
        this.welcomeMessage = text;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.initTexture();
      }

      initTexture() {
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d", {alpha: false});
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx.font = "Bold 120px Arial";
        this.ctx.fillStyle = "#fff"; //<======= here
        

        const textWidth = this.ctx.measureText(this.welcomeMessage ).width;

        this.ctx.fillText(this.welcomeMessage, this.width/2 - textWidth/2, this.height/2);
        this.texture = new THREE.Texture(this.canvas);


      }
      changeText(text){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#fff';
        this.ctx.font = "Bold 120px Arial";
        const textWidth = this.ctx.measureText(text ).width;

        this.ctx.fillText(text, this.width/2 - textWidth/2, this.height/2);
        this.ctx.restore();
      

      }
      update() {
        this.texture.needsUpdate = true;
      }
}