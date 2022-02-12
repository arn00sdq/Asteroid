import Component  from "./component.js";

    class CharacterControllerInput{
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

            shift: false,

            shoot:false,

            cam1:false,
            cam2:true,
            cam3:false,

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
                this.keys.shoot = false;
                break;

              case 49: // 1
                this.keys.cam1 = true; 
                this.keys.cam2 = false; 
                this.keys.cam3 = false; 
                this.StatiCameraInit();
                break;

              case 50: // 2 -- default camera
                if(this.keys.cam2 !== true){
                  this.keys.cam2 = true; 
                  this.keys.cam1 = false; 
                  this.keys.cam3 = false; 
                  this.ThirdCameraInit();
                }
                break;

              case 51: // 3
                this.keys.cam3 = true;
                this.keys.cam2 = false; 
                this.keys.cam1 = false;
                break;
                
              case 16: // SHIFT
                this.keys.shift = true;
                break;
            }
          }
        
          OnKeyUp(event) {
            switch(event.keyCode) {
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
                this.keys.shoot = true;
                break;

              case 16: // SHIFT
                this.keys.shift = false;
                break;
            }
          }

          Update() {}

          StatiCameraInit(){

            let goal_setting = this.parent.params.goal;
            let camera_setting = this.parent.params.camera;

            goal_setting.position.x = 0
            goal_setting.position.y = 5
            goal_setting.position.z = 0

            camera_setting.position.x = 0
            camera_setting.position.y = 5
            camera_setting.position.z = 0

            camera_setting.lookAt(0,0,0)

          }

          ThirdCameraInit(){

            let goal_setting = this.parent.params.goal;
            let camera_setting = this.parent.params.camera;

            goal_setting.position.x = 0
            goal_setting.position.y = 0
            goal_setting.position.z = 0

            camera_setting.position.x = 0
            camera_setting.position.y = 0.3
            camera_setting.position.z = 0

          }

    }

export default CharacterControllerInput

