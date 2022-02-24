class JokerSystem{

    constructor(parent,models){

        this.parent = parent;

        this.nextJoker = null;

        this.nbHeart = 0;
        this.heartAvailable = true;
        this.limitHeart = 1;

        this.nbCoin = 0;
        this.coinAvailable = true;
        this.limitCoin = 5;

        this.nbArrow = 0;
        this.arrowAvailable = true;
        this.limitArrow = 1;

        this.nbShield= 0;
        this.shieldAvailable = true;
        this.limitShield = 1;

        this.joker = [models.heart, models.arrow, models.coin,models.shield];
        this.jokerAv = []
        this.jokerUnv = []


        this.level_sys_comp = this.parent.GetComponent("LevelSystem");

    }

    PlayerAddLife(player,number){

        console.log(player)
        player.GetComponent("PlayerHealthSystem").Heal(number);
        this.parent.GetComponent("DisplaySystem").PrintLife(player.life);

    }

    PlayerAddCoin(score, number){

        score += number;
        this.parent.GetComponent("DisplaySystem").printScore(score);

    }

    /*PlayerProtection(player,shield, seconds){

        player.immune = true;

        this.nbShield  = 4;

        let zPos = new THREE.Vector3(0,0,0.1);
        let r = zPos.distanceTo(new THREE.Vector3(0,0,-0.5));

        let shieldClone = shield;
        
        for(let i = 0; i < this.nbShield ; i++){

            let x = r * Math.cos( 360 / ( i + 2 ) );
            let z = r * Math.sin( 360 / ( i + 2 ) );

            let posShield = new THREE.Vector3( x, 0, z )
            shieldClone.position.copy( posShield );
            shieldClone.Instantiate(shieldClone,posShield, new THREE.Euler(0,0,0),1)

        }

        setTimeout(() => {

            player.immune = false;

        }, seconds);

    }*/

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

                this.level_sys_comp.InstantiateJoker(currentJoker,position,rotation,currentJoker.vscale);
                
            } 
        }

        if(this.nextJoker < Math.round(timeElapsed))  this.nextJoker = null


    }

    Update(timeElapsed){

        this.JokerSpawnSystem(timeElapsed);

    }

}

export default JokerSystem