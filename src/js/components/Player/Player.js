import PlayerShootProjectiles from './PlayerShootProjectiles.js';
import CharacterControllerInput from './playerInput.js';
import CharacterMouvement  from './playerMouvement.js';
import PlayerHealthSystem from "./PlayerHealthSystem.js";

import ThirdPersonCamera from '../Camera/thirdPersonCamera.js';
import StaticCamera from "../Camera/StaticCamera.js";
import CameraTracking from "../Camera/CameraTracking.js";

import * as THREE from '../../three/three.module.js'

class Player extends THREE.Group{ 

    constructor(params, model) {

        super();

        this.name = "Player";
        this.components = {};
        this.params = params;
        this.model = model;
        this.life = 1;

        this.cannon = [];
        
       // this.InitComponent();

    }

    InitComponent(){

        this.AddComponent(new CameraTracking(this));
        this.AddComponent(new StaticCamera(this));
        this.AddComponent(new ThirdPersonCamera(this));
        
        this.AddComponent(new CharacterControllerInput(this));
        this.AddComponent(new CharacterMouvement(this));
        this.AddComponent(new PlayerHealthSystem(this));
        this.AddComponent(new PlayerShootProjectiles(this,this.params.weapon));
       
    }

    InitMesh(scale){

        this.add(this.model)
        
        this.cannon.push(new THREE.Object3D);
        this.cannon.push(new THREE.Object3D);

        this.cannon[0].position.copy( new THREE.Vector3(-0.1,0,0.1) );
        this.cannon[1].position.copy( new THREE.Vector3(0.1,0,0.1) );

        this.add(this.cannon[0]);
        this.add(this.cannon[1]);

        this.children[0].scale.copy(scale)
        this.SetRigidBoby(this.children[0])

    }

    SetRigidBoby(object){

        object.geometry.computeBoundingBox();
        object.geometry.computeBoundingSphere();

        object.BB = new THREE.Box3().copy( object.geometry.boundingBox );
        object.BS = new THREE.Sphere().copy( object.geometry.boundingSphere );

        this.BB = new THREE.Box3().copy( this.children[0].geometry.boundingBox );
        this.BS = new THREE.Sphere().copy( this.children[0].geometry.boundingSphere );

    }

    RemoveRigidBody(object) {

        object.BB = null;
        object.BS = null;

    }

    SetInvulnerability(seconds){

        this.BB = null;
        this.BS = null;
       if(this.children[0]){

            setTimeout(() => {

                this.BB = new THREE.Box3().copy( this.children[0].geometry.boundingBox );
                this.BS = new THREE.Sphere().copy( this.children[0].geometry.boundingSphere );

            }, seconds);

       } 

    }

    Instantiate(o,p,r,s){

        this.position.copy(p);
        this.rotation.copy(r);

        this.SetInvulnerability(500);

        s.add(o)
        
    }
    
    Destroy(object){

        this.params.scene.remove(object);
        object.mesh = null;

    }

    GetComponent(n) {

        return this.components[n];

    }

    AddComponent(c) {
        
        this.components[c.constructor.name] = c;   

    }

    Update(timeElapsed){

        if(this.children[0] !== null){

            for (let k in this.components) {

                this.components[k].Update(timeElapsed);

            }
            
        }

    }

}

export default Player
