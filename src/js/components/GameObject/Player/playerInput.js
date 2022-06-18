class CharacterControllerInput {
  constructor(parent,utils) {

    this.parent = parent; 
    
    this.camSystem = this.parent.GetComponent("PlayerCameraSystem");
    this.camera = utils.camera;

    this.Init();

  }

  Init() {

    this.keys = {

      forward: false,
      backward: false,
      left: false,
      right: false,
      space: false,

      kta: false,
      nj: false,

      shift: false,

      shoot: false,
      enter:false,

      cam1: false,
      cam2: true,
      cam3: false,

      pause: false,

      screenshot : false,

    };

    document.addEventListener('keydown', (e) => this.OnKeyDown(e), false);
    document.addEventListener('keyup', (e) => this.OnKeyUp(e), false);

  }

  OnKeyDown(event) {

    switch (event.keyCode) {

      case 90: // w
        this.keys.forward = true;
        break;
      case 81: // a
        this.keys.left = true;
        break;
      case 83: // s
        this.keys.backward = true;
        break;
      case 68: // d
        this.keys.right = true;
        break;
      case 32: // space
        this.keys.shoot = true;
        break;
      case 13: // enter
        this.keys.enter = true;
        break;
      case 73: // i
        this.keys.invincible = true;
        break;
      case 74: // j
        this.keys.nj = true;
        break;
      case 75: // k
        this.keys.kta = true;
        break;
      case 49: // 1 -- fixe
        this.keys.cam1 = true;
        this.keys.cam2 = false;
        this.keys.cam3 = false;
        this.StatiCameraInit();
        break;
      case 50: // 2 -- default camera
        if (this.keys.cam2 !== true) {
          this.keys.cam2 = true;
          this.keys.cam1 = false;
          this.keys.cam3 = false;
          this.ThirdCameraInit();
        }
        break;
      case 51: // 3 mode poursuite
        this.keys.cam3 = true;
        this.keys.cam2 = false;
        this.keys.cam1 = false;
        this.CameraTrackingInit();
        break;
      case 16: // SHIFT
        this.keys.shift = true;
        break;
      case 80:
        this.keys.screenshot = true;
        break;
      case 27:

        if(!this.keys.pause){

          this.keys.pause = true;

        }else{

          this.keys.pause = false;

        }
        
        break;
    }
  }

  OnKeyUp(event) {

    switch (event.keyCode) {
      case 90: // z
        this.keys.forward = false;
        break;
      case 81: // q
        this.keys.left = false;
        break;
      case 83: // s
        this.keys.backward = false;
        break;
      case 68: // d
        this.keys.right = false;
        break;
      case 32: // space
        this.keys.shoot = false;
        break;
      case 16: // SHIFT
        this.keys.shift = false;
        break;
    }

  }

  Update() {}

  StatiCameraInit() {

    let goalSetting = this.camSystem.goal;
    let cameraSetting =  this.camSystem.camera;

    goalSetting.position.set(0, 5, 0);
    cameraSetting.position.set(0, 5, 0);

    cameraSetting.lookAt(0, 0, 0);
    this.camera.fov = 90;

  }

  ThirdCameraInit() {
    let goalSetting =  this.camSystem.goal;
    let cameraSetting = this.camSystem.camera;

    goalSetting.position.set(this.parent.position.x, 0, this.parent.position.z -0.3);
    cameraSetting.position.set(0, 0.3, 0);
    this.parent.sceneManager.currentCamera.fov = 140;
    this.parent.sceneManager.currentCamera.updateProjectionMatrix();

  }

  CameraTrackingInit() {

    let cameraSetting =  this.camSystem.camera;
    cameraSetting.position.set(0, 5, 0);

  }

}

export default CharacterControllerInput
