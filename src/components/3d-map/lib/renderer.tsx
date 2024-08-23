import * as THREE from "three";
export class WebGLRenderer {
  renderer;
  constructor(currentDom: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(currentDom.clientWidth, currentDom.clientHeight);
  }
}
