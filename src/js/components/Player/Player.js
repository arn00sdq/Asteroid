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
        this.AddComponent(new CharacterControllerInput(this));
        
    }

    ResetPlayer(){

        this.life = 1;

        this.comp_projectile = this.GetComponent("PlayerShootProjectiles");
        this.comp_projectile.nbCannon = 1;
        this.comp_projectile.indexMissile = 1;
        this.comp_projectile.cannon.splice(1);

        this.comp_cam = this.GetComponent("PlayerCameraSystem");
        this.comp_cam.goal.position.set(0,0,0)


    }

    InitValue(){

        if (this.constructor.name =="Player") this.GetComponent("PlayerShootProjectiles").AddProjectile( 1 );

    }

}

export default Player
