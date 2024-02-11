import './style.css'
import * as THREE from 'three';
import { WaterTexture } from "./waterTexture";
import { Text } from "./Text";



console.clear();
class App {
  constructor() {
    this.waterTexture = new WaterTexture({ debug: false });

    this.text = new Text('Привет мир');

    var input = document.getElementById('input')

    input.oninput = ()=> {
      console.log(input.value)
      this.text.changeText(input.value)
      this.text.update();
    };

    this.tick = this.tick.bind(this);
    console.log( 'text', this.text)

/////////////////////////////////
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    this.clock = new THREE.Clock();


  
    
    this.geometry = new THREE.PlaneGeometry( 13, 8, 50, 50 );
    this.material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

    // this.material2 = new THREE.MeshBasicMaterial({ map: this.waterTexture, side: THREE.DoubleSide })

    
    const imageTexture = new THREE.TextureLoader().load('/src/assets/image.png');

    const material2 = new THREE.MeshBasicMaterial({map: this.text})

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uMap: new THREE.Uniform(this.waterTexture.texture),
        uText: new THREE.Uniform(this.text.texture),
        uTexture: { value: imageTexture },
      },
      transparent: true,
      fragmentShader: `
        uniform sampler2D uMap;
        uniform sampler2D uText;
        uniform sampler2D uTexture;

        varying vec2 vUv;

        #define koef 0.04

        highp float rand(vec2 co) {
            highp float a = 12.9898;
            highp float b = 78.233;
            highp float c = 43758.5453;
            highp float dt= dot(co.xy ,vec2(a,b));
            highp float sn= mod(dt,3.14);
            return fract(sin(sn) * c);
        }

        void main(){
          vec4 paint = texture2D(uMap, vec2(vUv.x, vUv.y));
          vec4 text = texture2D(uText, vec2(vUv.x + rand(vUv)* paint.x *0.2, vUv.y + rand(vUv)* paint.y *0.15));
          text.g = texture2D(uText, vec2(vUv.x + rand(vUv)* paint.x *0.22, vUv.y + rand(vUv)* paint.y *0.17)).g;
          text.b = texture2D(uText, vec2(vUv.x + rand(vUv)* paint.x *0.15, vUv.y + rand(vUv)* paint.y *0.12)).b;
          
          vec4 image = texture2D(uTexture, vec2(vUv.x, vUv.y));
          vec4 image2 = texture2D(uTexture, vec2(vUv.x, vUv.y)).rgba;
          image2.r = texture2D(uTexture, vec2(vUv.x + paint.x * 0.02, vUv.y + paint.y *0.02)).r;
          gl_FragColor = image2 + text*text;
          
        }
      `,
      vertexShader: `
        varying vec2 vUv;
        uniform sampler2D uMap;
        #define PI 3.14159265359

        void main(){
          vec4 paint = texture2D(uMap, vec2(vUv.x, vUv.y));
          vec4 tex = texture2D(uMap, uv);
          float angle = -((tex.r) * (PI * 2.) - PI) ;
          float vx = -(tex.r *2. - 1.);
          float vy = -(tex.g *2. - 1.);
          float intensity = tex.b;
          float maxAmplitude = 0.6;

          vec3 pos = vec3(position.x + vx* intensity * maxAmplitude, position.y + vy* intensity * maxAmplitude, position.z);
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

    // this.initComposer();
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
    this.text.update();
    requestAnimationFrame(this.tick);

    // this.cube.rotation.x += 0.01;
    // this.cube.rotation.y += 0.01;

    this.renderer.render( this.scene, this.camera );

  }
}
const myApp = new App();



