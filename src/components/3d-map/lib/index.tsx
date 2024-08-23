import * as THREE from "three";

export class CameraArray {
  camera: THREE.ArrayCamera;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  mesh: THREE.Mesh<THREE.CylinderGeometry, THREE.MeshPhongMaterial, THREE.Object3DEventMap>;

  constructor() {
    this.initScene();
    window.addEventListener("resize", this.onWindowResize);
  }

  onWindowResize = () => {
    const AMOUNT = 6;
    const ASPECT_RATIO = window.innerWidth / window.innerHeight;
    const WIDTH = (window.innerWidth / AMOUNT) * window.devicePixelRatio;
    const HEIGHT = (window.innerHeight / AMOUNT) * window.devicePixelRatio;

    this.camera.aspect = ASPECT_RATIO;
    this.camera.updateProjectionMatrix();

    for (let y = 0; y < AMOUNT; y++) {
      for (let x = 0; x < AMOUNT; x++) {
        const subcamera = this.camera.cameras[AMOUNT * y + x];

        subcamera.viewport.set(
          Math.floor(x * WIDTH),
          Math.floor(y * HEIGHT),
          Math.ceil(WIDTH),
          Math.ceil(HEIGHT)
        );

        subcamera.aspect = ASPECT_RATIO;
        subcamera.updateProjectionMatrix();
      }
    }

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  initScene() {
    this.scene = new THREE.Scene();
    this.initCameras(); // 先初始化相机
    this.scene.add(...this.initLight());
    this.scene.add(this.initBackgroundMesh());
    this.scene.add(this.initCylinderMesh());
    this.initRenderer();
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setAnimationLoop(this.animate.bind(this)); // 确保 this 指向 CameraArray
    this.renderer.shadowMap.enabled = true;
    document.body.appendChild(this.renderer.domElement);
  }

  animate = () => {
    if (this.mesh) {
      this.mesh.rotation.x += 0.005;
      this.mesh.rotation.z += 0.01;
      this.renderer.render(this.scene, this.camera);
    }
  };

  initCameras() {
    const AMOUNT = 6;
    const ASPECT_RATIO = window.innerWidth / window.innerHeight;
    const WIDTH = (window.innerWidth / AMOUNT) * window.devicePixelRatio;
    const HEIGHT = (window.innerHeight / AMOUNT) * window.devicePixelRatio;
    const cameras = [];
    for (let y = 0; y < AMOUNT; y++) {
      for (let x = 0; x < AMOUNT; x++) {
        const subcamera = new THREE.PerspectiveCamera(40, ASPECT_RATIO, 0.1, 10);
        subcamera.viewport = new THREE.Vector4(
          Math.floor(x * WIDTH),
          Math.floor(y * HEIGHT),
          Math.ceil(WIDTH),
          Math.ceil(HEIGHT)
        );
        subcamera.position.x = x / AMOUNT - 0.5;
        subcamera.position.y = 0.5 - y / AMOUNT;
        subcamera.position.z = 1.5;
        subcamera.position.multiplyScalar(2);
        subcamera.lookAt(0, 0, 0);
        subcamera.updateMatrixWorld();
        cameras.push(subcamera);
      }
    }
    this.camera = new THREE.ArrayCamera(cameras);
    this.camera.position.z = 3;
  }

  initLight() {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(0.5, 0.5, 1);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.zoom = 4;
    const ambientLight = new THREE.AmbientLight(0x999999);
    const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 10);
    return [ambientLight, directionalLight, lightHelper];
  }

  initBackgroundMesh() {
    const geometryBackground = new THREE.PlaneGeometry(100, 100);
    const materialBackground = new THREE.MeshPhongMaterial({ color: 0x000066 });
    const background = new THREE.Mesh(geometryBackground, materialBackground);
    background.receiveShadow = true;
    background.position.set(0, 0, -1);
    return background;
  }

  initCylinderMesh() {
    const geometryCylinder = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
    const materialCylinder = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    this.mesh = new THREE.Mesh(geometryCylinder, materialCylinder);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    return this.mesh;
  }
}
