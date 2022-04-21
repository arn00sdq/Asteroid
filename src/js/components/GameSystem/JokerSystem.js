import * as THREE from 'three';

import { Object3D } from "../../three/three.module.js";

class JokerSystem{

    constructor(parent,models){

        this.parent = parent;
        this.edgeLimit = this.parent.limit;
        
        this.nextJoker = null;
        this.joker = [models.heart, models.firepower, models.coin,models.shield,models.firerate];
        this.jokerAv = [];
        this.jokerUnv = [];

        this.shield_clone;

        this.levelSystem = this.parent.GetComponent("LevelSystem");
        this.displaySystem = this.parent.GetComponent("DisplaySystem");

    }

    PlayerAddLife(player,number){

        let playerHealth = player.GetComponent("PlayerHealthSystem");

        playerHealth.Heal(number);
        this.displaySystem.PrintLife(playerHealth.life);

    }

    PlayerAddCoin(score, number){

        this.parent.score += number;
        this.displaySystem.printScore(this.parent.score, 1,1);

    }

    PlayerProtection(player,shield, seconds){
          
        this.addShield(player,shield);

        setTimeout(() => {

            this.removeShield(player);

        }, seconds);
        

    }

    addShield(player,shield){

        player.hasJoker.immune = true;
        this.shield_clone = shield.clone();
        this.shield_clone.scene = shield.scene;

        let mesh = this.shield_clone.children.find(e => e.constructor.name == "Mesh");
        let shaderMat = Object.values(this.parent.shaders).find( val => val.parentName === shield.constructor.name);
        mesh.material = shaderMat

        this.shield_clone.RemoveRigidBody(this.shield_clone);
        player.add(this.shield_clone)

    }

    removeShield(player){

        player.hasJoker.immune = false;
        player.remove(this.shield_clone)

    }
    

    IncreaseFireRate(player,seconds){

        player.hasJoker.firerate = true;
        let playerShoot = player.GetComponent("PlayerShootProjectiles");
        playerShoot.fireRate = 200;

        setTimeout(() => {

            player.hasJoker.firerate = false;
            playerShoot.fireRate = 500;

        }, seconds);

    }

    JokerSpawnSystem(timeElapsed,timeInSecond){

        if(this.nextJoker !== Math.round(timeInSecond)){
    
            this.joker.forEach( (e,index) => {        
                if (e.nb >= e.limit) {
                    if (this.jokerAv.includes(e) == true) this.jokerAv.splice(this.jokerAv.indexOf(e),1)
                    if (this.jokerUnv.includes(e) == false) this.jokerUnv.push(e)
            
                }else if(e.nb < e.limit) {
                    if (this.jokerUnv.includes(e,index) == true) this.jokerUnv.splice(this.jokerUnv.indexOf(e),1)
                    if (this.jokerAv.includes(e) == false) this.jokerAv.push(e);

                }

            });

            this.nextJoker =  Math.round(timeInSecond);

            if(this.nextJoker % 1 == 0 && this.jokerAv.length > 0){

                let position = new THREE.Vector3( ( Math.random() *  (this.edgeLimit - 3  ))  * ( Math.round( Math.random() ) ? 1 : -1 ) , 
                                                  0 ,
                                                  ( Math.random() * (this.edgeLimit - 3  ))  * ( Math.round( Math.random() ) ? 1 : -1 ) 
                                            )
                let rotation = new THREE.Euler(0,0,0);      
                let random = Math.round( Math.random() *  (this.jokerAv.length - 1) )
                let scale = 1;
                let currentJoker = this.jokerAv[random];
                switch(currentJoker.constructor.name){ 
                    
                    case "Coin":
                        scale = 0.08;
                        break;
                    case "Heart":
                        position.y = -0.05
                        scale = 0.002;
                        break;
                }
                        

                if (currentJoker.constructor.name == "Shield"){
                    this.levelSystem.InstantiateShader(currentJoker,position,rotation,scale,"joker");
                }  else{
                    this.levelSystem.InstantiateGameObject(currentJoker,position,rotation,scale,"joker");
                }
               
                
            } 
        }

        if(this.nextJoker < Math.round(timeInSecond))  this.nextJoker = null


    }

    Update(timeElapsed,timeInSecond){

        this.JokerSpawnSystem(timeElapsed,timeInSecond  * 1000);
        

    }

}

export default JokerSystem