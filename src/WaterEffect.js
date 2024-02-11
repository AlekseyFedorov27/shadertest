import * as THREE from "three";
import { EffectComposer  } from 'three/addons/postprocessing/EffectComposer.js';

export class WaterEffect extends EffectComposer  {
  constructor(texture) {
    super("WaterEffect", fragment, {
      uniforms: new Map([["uTexture", new THREE.Uniform(texture)]])
    });
  }
}
export default WaterEffect;

const fragment = `
uniform sampler2D uTexture;
#define PI 3.14159265359

void mainUv(inout vec2 uv) {
        vec4 tex = texture2D(uTexture, uv);
		// Convert normalized values into regular unit vector
        float vx = -(tex.r *2. - 1.);
        float vy = -(tex.g *2. - 1.);
		// Normalized intensity works just fine for intensity
        float intensity = tex.b;
        float maxAmplitude = 0.2;
        uv.x += vx * intensity * maxAmplitude;
        uv.y += vy * intensity * maxAmplitude;
    }
`;