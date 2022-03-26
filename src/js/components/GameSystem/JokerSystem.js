import JokerFollowPlayer from "../Joker/JokerFollowPlayer.js";

class JokerSystem{

    constructor(parent,models){

        this.parent = parent;

        this.edgeLimit = this.parent.limit;
        
        this.nextJoker = null;

        this.joker = [models.heart, models.arrow, models.coin,models.shield];
        this.jokerAv = []
        this.jokerUnv = []

        this.hasShield = false;

        this.level_sys_comp = this.parent.GetComponent("LevelSystem");

    }

    PlayerAddLife(player,number){

        player.GetComponent("PlayerHealthSystem").Heal(number);
        this.parent.GetComponent("DisplaySystem").PrintLife(player.life);

    }

    PlayerAddCoin(score, number){

        this.parent.score += number;
        this.parent.GetComponent("DisplaySystem").printScore(this.parent.score, 1,1);

    }

    PlayerProtection(player,shield, seconds){
        
        player.immune = true;
        this.hasShield = true;
        
        let shieldClone = shield.clone();
        shieldClone.scene = shield.scene;

        shieldClone.RemoveRigidBody(shieldClone);
        console.log(shieldClone)
        player.add(shieldClone)


        setTimeout(() => {

            player.immune = false;
            this.hasShield = false;
            shieldClone.removeFromParent()

        }, seconds);
        

    }

    JokerSpawnSystem(timeElapsed ){

        if(this.nextJoker !== Math.round(timeElapsed)){
    
            this.joker.forEach( (e,index) => {        
                
                if (e.nb >= e.limit) {
                    if (this.jokerAv.includes(e) == true) this.jokerAv.splice(this.jokerAv.indexOf(e),1)
                    if (this.jokerUnv.includes(e) == false) this.jokerUnv.push(e)
            
                }else if(e.nb < e.limit) {
                    if (this.jokerUnv.includes(e,index) == true) this.jokerUnv.splice(this.jokerUnv.indexOf(e),1)
                    if (this.jokerAv.includes(e) == false) this.jokerAv.push(e);

                }

            });

            this.nextJoker =  Math.round(timeElapsed);

            if(this.nextJoker % 1 == 0 && this.jokerAv.length > 0){

                let position = new THREE.Vector3( ( Math.random() * ( this.edgeLimit - (this.edgeLimit / 1.5 ) ) )  * ( Math.round( Math.random() ) ? 1 : -1 ) , 
                                                  0 ,
                                                  ( Math.random() * ( this.edgeLimit - (this.edgeLimit / 2 ) ) )  * ( Math.round( Math.random() ) ? 1 : -1 ) 
                                            )
                let rotation = new THREE.Euler(0,0,0);      
                let random = Math.round( Math.random() *  (this.jokerAv.length - 1) )
                let scale = 1;
                let currentJoker = this.jokerAv[random];
                switch(currentJoker.constructor.name){ 
                    
                    case "Arrow":
                        scale = 1;
                        break;
                    case "Coin":
                        scale = 0.08;
                        break;
                    case "Heart":
                        position.y = -0.05
                        scale = 0.002;
                        break;
                }
                
                this.level_sys_comp.InstantiateGameObject(currentJoker,position,rotation,scale);
                
            } 
        }

        if(this.nextJoker < Math.round(timeElapsed))  this.nextJoker = null


    }

    Update(timeElapsed){

        this.JokerSpawnSystem(timeElapsed * 1000);
        

    }

}

export default JokerSystem