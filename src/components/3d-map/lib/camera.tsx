import * as THREE from "three";
export class Camera {
  camera;
  cameraHelper;
  constructor(currentDom: HTMLElement) {
    this.camera = new THREE.PerspectiveCamera(
      30,
      currentDom.clientWidth / currentDom.clientHeight,
      0.1,
      1000
    );

    this.camera.position.set(-10, -90, 130);

    this.cameraHelper = new THREE.CameraHelper(this.camera);
  }
}
