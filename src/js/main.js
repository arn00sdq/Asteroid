import CharacterMouvement  from './components/playerMouvement.js'
import GameObject from "./GameObject.js";
import CharacterControllerInput from './components/playerInput.js';
import GameObjectManager from './gameObjectManager.js'
import ShipMesh from './components/mesh.js'
import ThirdPersonCamera from './components/thirdPersonCamera.js';
import PlayerShootProjectiles from './components/PlayerShootProjectiles.js';


import { PointerLockControls } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/controls/PointerLockControls.js';
import { Vector3 } from './three.module.js';



class Asteroid {
    constructor() {
        
        this.Initialize();
        this.LoadPlayer();
    }

    Initialize(){

        this.camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.001, 10000 );
        this.camera.position.set(0,0.3,0);
        this.scene = new THREE.Scene();
        this.camera.lookAt( this.scene.position );

        var gridHelper = new THREE.GridHelper( 40, 40 );
        this.scene.add( gridHelper );
    
        this.scene.add( new THREE.AxesHelper() );
        let light = new THREE.AmbientLight(0xFFFFFF, 1.0);
        this.scene.add(light);
        this.GameObjectManager = new GameObjectManager()
        

        window.addEventListener('resize', () => {
            this.OnWindowResize();
          }, false);
        
    }

    LoadPlayer() {

        this.goal = new THREE.Object3D;
        this.follow = new THREE.Object3D;
        this.follow.position.z = - 0.3;
        this.goal.add(this.camera)
        
        const params = {
            goal: this.goal,
            camera:this.camera,
            follow: this.follow,
            scene: this.scene,
        }
        this.meshProjectileCylinder = new GameObject("BasicBullet", params);

        const weaponParams = {
            basicBullet :  this.meshProjectileCylinder, // new GameObject("basicBullet")
        }

        this.player = new GameObject("Player", params);
        this.player.AddComponent(new ShipMesh.ShipMesh('../medias/models/Soldier.glb',params));
        this.player.AddComponent(new CharacterControllerInput.CharacterControllerInput(params));
        this.player.AddComponent(new CharacterMouvement.CharacterMouvement(params));
        this.player.AddComponent(new ThirdPersonCamera.ThirdPersonCamera(params));
        this.player.AddComponent(new PlayerShootProjectiles.PlayerShootProjectiles(weaponParams, params));
        this.scene.add(this.player)

        this.GameObjectManager.Add(this.player,'player');
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this.renderer.domElement );
          this.previousRAF = null;
          this.RAF();

    }

    RAF() {
        requestAnimationFrame((t) => {
            if (this.previousRAF === null) {
                this.previousRAF = t;
            }
            this.RAF();
            this.Step(t - this.previousRAF) /1000;
            this.previousRAF = t;
            this.renderer.render(this.scene, this.camera);
   
         });    
      }
    
    Step(timeElapsed) {
        
        const timeElapsedS = Math.min(1.0 / 30.0, timeElapsed * 0.001);    
        this.GameObjectManager.Update(timeElapsedS);
        
      }

      OnWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      }
      

}

let _APP = null

window.addEventListener('DOMContentLoaded', () => {
    _APP = new Asteroid();
    
  });
