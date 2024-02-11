import './style.css'
import * as THREE from 'three';
import { WaterTexture } from "./src/waterTexture";
// import { EffectComposer, RenderPass } from 'postprocessing'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';


console.clear();
class App {
  constructor() {
    this.waterTexture = new WaterTexture({ debug: false });

    this.tick = this.tick.bind(this);
  

    console.log(this.waterTexture)

/////////////////////////////////
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    this.composer = new EffectComposer(this.renderer);
    this.clock = new THREE.Clock();


  
    
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

  initComposer(){
    const renderPass = new RenderPass(this.scene, this.camera);

    this.waterEffect = new WaterEffect(  this.touchTexture.texture);

    const waterPass = new EffectPass(this.camera, this.waterEffect);

    renderPass.renderToScreen = false;
    waterPass.renderToScreen = true;
    this.composer.addPass(renderPass);
    this.composer.addPass(waterPass);
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
    this.composer.render(this.clock.getDelta());
  }
}
const myApp = new App();



