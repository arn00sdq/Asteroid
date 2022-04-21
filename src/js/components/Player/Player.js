import * as THREE from 'three';

import PlayerShootProjectiles from './PlayerShootProjectiles.js';
import CharacterControllerInput from './playerInput.js';
import CharacterMouvement  from './playerMouvement.js';
import PlayerHealthSystem from "./PlayerHealthSystem.js";

import GameObject from '../GameObject.js';
import PlayerCameraSystem from './PlayerCameraSystem.js';

class Player extends GameObject{ 

    constructor(model, audio, params) {

        super(model,audio);

        this.components = {};
        this.name = "Player";
        this.params = params;
        
       

        this.hasJoker = {

            immune: false,
            fireRate: false,

        };
        
        this.audioSystem = null;
        this.stageSystem = null;

        this.InitComponent();
        this.InitValue();


    }

    InitComponent(){

        this.AddComponent(new CharacterMouvement(this));
        this.AddComponent(new PlayerHealthSystem(this));
        this.AddComponent(new PlayerShootProjectiles(this,this.audio));
        this.AddComponent(new PlayerCameraSystem(this, this.params));
        this.AddComponent(new CharacterControllerInput(this, this.params));
        
    }

    ResetPlayer(){

        this.shootComponent = this.GetComponent("PlayerShootProjectiles");
        this.shootComponent.nbCannon = 1;
        this.shootComponent.indexMissile = 1;
        this.shootComponent.ultimate = 0;
        this.shootComponent.cannon.splice(1);

        this.healthComponent = this.GetComponent("PlayerHealthSystem");
        this.healthComponent.life = 3;

        this.controllerComponent = this.GetComponent("CharacterMouvement");
        this.healthComponent.stamina = 100;

        if(this.children.find(e => e.constructor.name == "Shield") !== undefined){

            this.hasJoker.immune = false;
            let shieldToRemove = this.children.find(e => e.constructor.name == "Shield")
            this.remove( shieldToRemove );
            shieldToRemove.matrixWorld.decompose( shieldToRemove.position, shieldToRemove.quaternion, shieldToRemove.scale );
       
        }
        


    }

    InitValue(){

        if (this.constructor.name =="Player") this.GetComponent("PlayerShootProjectiles").AddProjectile( 1 );

    }

}

export default Player
