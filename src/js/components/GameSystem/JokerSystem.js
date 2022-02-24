import JokerFollowPlayer from "../Joker/JokerFollowPlayer.js";

class JokerSystem{

    constructor(parent,models){

        this.parent = parent;
        
        this.nextJoker = null;

        this.joker = [models.heart, models.arrow, models.coin,models.shield];
        this.jokerAv = []
        this.jokerUnv = []

        this.level_sys_comp = this.parent.GetComponent("LevelSystem");

    }

    PlayerAddLife(player,number){

        player.GetComponent("PlayerHealthSystem").Heal(number);
        this.parent.GetComponent("DisplaySystem").PrintLife(player.life);

    }

    PlayerAddCoin(score, number){

        this.parent.score += number;
        this.parent.GetComponent("DisplaySystem").printScore(this.parent.score);

    }

    PlayerProtection(player,shield, seconds){
        
        player.immune = true;
        
        this.nbShield  = 4;

        let parentVector  = new THREE.Vector3;
        parentVector.setFromMatrixPosition(player.matrixWorld)

        let zPos = new THREE.Vector3(0,0,0.1).add(parentVector);
        let r = zPos.distanceTo(new THREE.Vector3(0,0,-0.5).add(parentVector));
        
        for(let i = 0; i <2 ; i++){

            let shieldClone = shield.clone();
            shieldClone.scene = shield.scene;

            let x = new THREE.Vector3( r * Math.cos(THREE.MathUtils.degToRad(360.0) / ( i +1  ) ),0,0);
            let z =  new THREE.Vector3(0,0, r * Math.sin( THREE.MathUtils.degToRad(360.0) / ( i + 1  ) ));
            let posShield = x.add(z).add(zPos)

 
            shieldClone.AddComponent(new JokerFollowPlayer(shieldClone,player,x,z));
            shieldClone.RemoveRigidBody(shieldClone);
            shieldClone.InstantiateAndDestroy(shieldClone,posShield, new THREE.Euler(0,0,0),1,3000)


        }

       
        setTimeout(() => {

            player.immune = false;

        }, seconds);

    }

    JokerSpawnSystem(timeElapsed){

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

                let position = new THREE.Vector3( ( ( Math.random() *  ( 9.5 - 1.5 ) ) + 1.5 ) * ( Math.round( Math.random() ) ? 1 : -1 ) ,  0  , ( ( Math.random() *  ( 9.5 - 2 ) ) + 2  ) * ( Math.round( Math.random() ) ? 1 : -1 ))
                let rotation = new THREE.Euler(0,0,0);      

                let random = Math.round( Math.random() *  (this.jokerAv.length - 1) )

                let currentJoker = this.jokerAv[random];

                this.level_sys_comp.InstantiateJoker(currentJoker,position,rotation,1);
                
            } 
        }

        if(this.nextJoker < Math.round(timeElapsed))  this.nextJoker = null


    }

    Update(timeElapsed){

        this.JokerSpawnSystem(timeElapsed);
        

    }

}

export default JokerSystem