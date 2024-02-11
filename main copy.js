import './style.css'
import * as THREE from 'three';
import { WaterTexture } from "./src/waterTexture";




console.clear();
class App {
  constructor() {
    this.waterTexture = new WaterTexture({ debug: true });

    this.tick = this.tick.bind(this);
  

    console.log(this.waterTexture)

/////////////////////////////////
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  
    
    this.geometry = new THREE.PlaneGeometry( 15, 6, 3 );
    this.material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

    // this.material2 = new THREE.MeshBasicMaterial({ map: this.waterTexture, side: THREE.DoubleSide })

    
    const imageTexture = new THREE.TextureLoader().load('./src/assets/image.jpg');

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uMap: new THREE.Uniform(this.waterTexture.texture),
        uTexture: { value: imageTexture },
        uLines: new THREE.Uniform(5),
        uLineWidth: new THREE.Uniform(0.01),
        uLineColor: new THREE.Uniform(new THREE.Color(0x202030))
      },
      transparent: true,
      fragmentShader: `
        uniform sampler2D uMap;
        uniform sampler2D uTexture;
        uniform float uLines;
        uniform float uLineWidth;
        uniform vec3 uLineColor;
        varying vec2 vUv;

        #define koef 0.6

        void main(){
          vec3 color = vec3(1.);
          color = vec3(0.);
          float line = step(0.5-uLineWidth/2.,fract(vUv.x * uLines)) - step(0.50 +uLineWidth/2.,fract(vUv.x * uLines));
          color += line * uLineColor;
          gl_FragColor = vec4(uLineColor,line);

          vec4 paint = texture2D(uMap, vec2(vUv.x, vUv.y));

          gl_FragColor = texture2D(uTexture, vec2(vUv.x + paint.x * koef, vUv.y + paint.y * koef));
        }
      `,
      vertexShader: `
        varying vec2 vUv;
        void main(){
          vec3 pos = position.xyz;
          vec4 modelViewPosition = modelViewMatrix * vec4(pos, 1.0 );
          vec4 projectedPosition = projectionMatrix * modelViewPosition;
           gl_Position = projectedPosition;
          vUv = uv;
        }
      `
    });





    this.cube = new THREE.Mesh( this.geometry, material );
    this.scene.add( this.cube );
    
    this.camera.position.z = 5;

    this.init();
  }
  init() {
    window.addEventListener("mousemove", this.onMouseMove.bind(this));
    document.body.appendChild( this.renderer.domElement );
    this.tick();
  }
  onMouseMove(ev) {
    const point = {
      x: ev.clientX / window.innerWidth,
      y: ev.clientY / window.innerHeight
    };

    this.waterTexture.addPoint(point);
  }
  tick() {
    this.waterTexture.update();
    requestAnimationFrame(this.tick);

    // this.cube.rotation.x += 0.01;
    // this.cube.rotation.y += 0.01;

    this.renderer.render( this.scene, this.camera );
  }
}
const myApp = new App();



