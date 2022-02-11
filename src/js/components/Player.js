import {GLTFLoader} from "../Loader/GLTFLoader.js";
import ThirdPersonCamera from './thirdPersonCamera.js';
import PlayerShootProjectiles from './PlayerShootProjectiles.js';
import CharacterControllerInput from './playerInput.js';
import CharacterMouvement  from './playerMouvement.js';
import * as THREE from '../three/three.module.js'

class Player extends THREE.Group{ 
    constructor(params) {
        super();
        this.components = {};
        this.name = "Player";
        this.params = params;
        this.InitComponent();
    }

    InitComponent(){
        this.AddComponent(new ThirdPersonCamera(this));
        this.AddComponent(new CharacterControllerInput(this));
        this.AddComponent(new CharacterMouvement(this));
        this.AddComponent(new PlayerShootProjectiles(this,this.params.weapon));
       
    }

    InitMesh(model,scale){
        this.add(model)
        
        this.children[0].scale.copy(scale)
        this.SetRigidBoby(this.children[0])
    }

    SetRigidBoby(object){
        object.geometry.computeBoundingBox();
        object.geometry.computeBoundingSphere();
        object.BB = new THREE.Box3().copy( object.geometry.boundingBox );
        object.BS = new THREE.Sphere().copy( object.geometry.boundingSphere );
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
        //console.log(this.position.distanceTo(new THREE.Vector3(0,0,0) ), this.position)
    }

}

export default Player
