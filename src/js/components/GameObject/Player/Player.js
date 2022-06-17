import * as THREE from 'three';

import PlayerShootProjectiles from './PlayerShootProjectiles.js';
import CharacterControllerInput from './playerInput.js';
import CharacterMouvement  from './playerMouvement.js';
import PlayerHealthSystem from "./PlayerHealthSystem.js";

import GameObject from "../GameObject.js";
import PlayerCameraSystem from './PlayerCameraSystem.js';

class Player extends GameObject{ 

    constructor(gameObject) {

        super(gameObject);

        this.sceneManager = null;
        if (!gameObject) gameObject = {name :"player", audio : null, utils : null};
        this.name = gameObject.name;
        this.audio = gameObject.audio;
        this.utils = gameObject.utils,
        
        this.hasJoker = {

            immune: false,
            fireRate: false,

        };
        
        this.audioSystem = null;
        this.stageSystem = null;

        this.InitComponent();

    }

    InitComponent(){

        this.AddComponent(new CharacterMouvement(this));
        this.AddComponent(new PlayerHealthSystem(this));
        this.AddComponent(new PlayerShootProjectiles(this,this.audio));
        this.AddComponent(new PlayerCameraSystem(this, this.utils));
        this.AddComponent(new CharacterControllerInput(this, this.utils));
        
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

        if (this.constructor.name =="Player"){

            this.GetComponent("PlayerShootProjectiles").AddProjectile( 1 );
            
            this.GetComponent("PlayerShootProjectiles").normalBullet = this.sceneManager.gameModels.basicBullet;
            this.GetComponent("PlayerShootProjectiles").specialBullet = this.sceneManager.gameModels.specialBullet;
            this.GetComponent("PlayerShootProjectiles").currentWeapon = this.sceneManager.gameModels.basicBullet;

            this.GetComponent("PlayerCameraSystem").limit = this.sceneManager.limit;
            this.GetComponent("CharacterControllerInput").ThirdCameraInit();

            this.stageSystem = this.sceneManager.GetComponent("LevelSystem");
            this.audioSystem = this.sceneManager.GetComponent("SoundSystem");
            

        } 

    }

}

export default Player
