class CharacterControllerInput {
  constructor(parent) {
    this.parent = parent;
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

      cam1: false,
      cam2: true,
      cam3: false,

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

      case 80: // SHIFT
        this.keys.screenshot = true;
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

      case 16: // SHIFT
        this.keys.shift = false;
        break;
    }

  }

  Update() {}

  StatiCameraInit() {

    let goal_setting = this.parent.params.goal;
    let camera_setting = this.parent.params.camera;

    goal_setting.position.set(0, 5, 0);
    camera_setting.position.set(0, 5, 0);

    camera_setting.lookAt(0, 0, 0)

  }

  ThirdCameraInit() {

    let goal_setting = this.parent.params.goal;
    let camera_setting = this.parent.params.camera;

    goal_setting.position.set(0, 0, 0);
    camera_setting.position.set(0, 0.3, 0);

  }

  CameraTrackingInit() {

    let camera_setting = this.parent.params.camera;

    camera_setting.position.set(0, 5, 0);

  }

}

export default CharacterControllerInput

