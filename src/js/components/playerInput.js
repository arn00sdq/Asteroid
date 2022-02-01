import Component  from "./component.js";

    class CharacterControllerInput extends Component {
        constructor(params) {
          super();
          this._params = params;
          this._Init();
        }
      
        _Init() {
          this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            space: false,
            shift: false,
            shoot:false,
          };
          this._raycaster = new THREE.Raycaster();
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
              case 32: // SPACE
                this.keys.space = true;
                break;
              case 84: // t
                this.keys.shoot = false;
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
              case 32: // SPACE
                this.keys.space = false;
                break;
              case 84: // t
                this.keys.shoot = true;
                break;
              case 16: // SHIFT
                this.keys.shift = false;
                break;
            }
          }

    }

export default {CharacterControllerInput, Component}

