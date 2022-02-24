class JokerSystem{

    constructor(parent){

        this.parent = parent;

        this.nextCoin = null;
        this.nextHeart = null;
        this.nextArrow = null;
        this.nextShield = null;

        this.nbHeart = 0;
        this.nbCoin = 0;
        this.nbArrow = 0;
        this.nbShield= 0;

        this.joker = [this.parent.heart, this.parent.coin, this.parent.arrow, this.parent.shield]

        this.level_sys_comp = this.parent.GetComponent("LevelSystem");

    }

    PlayerAddLife(player,number){

        player.GetComponent("PlayerHealthSystem").Heal(number);
        console.log("life")
        this.parent.GetComponent("DisplaySystem").PrintLife(player.life);

    }

    PlayerAddCoin(score, number){

        this.parent.score += number;
        this.parent.GetComponent("DisplaySystem").printScore(this.parent.score);

    }

    PlayerProtection(player, seconds){

        player.immune = true;

        setTimeout(() => {

            player.immune = false;

        }, 3000);

    }

    JokerSpawnSystem(timeElapsed){

        this.parent.scene.children.forEach((e) => {

            if(e.name == "Heart") this.nbHeart++;

            if(e.name == "Coin") this.nbCoin++;

            if(e.name == "Arrow") this.nbArrow++;

            if(e.name == "Shield") this.nbShield++;

        });

        /*
        * Coin
        */

        if(this.nextCoin !== Math.round(timeElapsed)){

            this.nextCoin =  Math.round(timeElapsed);

            if(this.nextCoin % 5 == 0 && this.nbCoin <= 5){

                let position = new THREE.Vector3( ( ( Math.random() *  ( 9.5 - 1.5 ) ) + 1.5 ) * ( Math.round( Math.random() ) ? 1 : -1 ) ,  0 ,( ( Math.random() *  ( 9.5 - 2 ) ) + 2  ) * ( Math.round( Math.random() ) ? 1 : -1 ))
                let rotation = new THREE.Euler(0,0,0);
                
                let scale = 0.1;
                this.level_sys_comp.InstantiateJoker(this.parent.coin,position,rotation,scale);

         
            } 
          
        }

        /*
        * Heart
        */

        if(this.nextHeart !== Math.round(timeElapsed)){

            this.nextHeart =  Math.round(timeElapsed);

            if(this.nextHeart % 6 == 0 && this.nbHeart == 0){

                let position = new THREE.Vector3( ( ( Math.random() *  ( 9.5 - 1.5 ) ) + 1.5 ) * ( Math.round( Math.random() ) ? 1 : -1 ) ,  0 , ( ( Math.random() *  ( 9.5 - 2 ) ) + 2  ) * ( Math.round( Math.random() ) ? 1 : -1 ))
                let rotation = new THREE.Euler(0,0,0);      

                let random = Math.round(( Math.random() *  ( 2 - 0) ) + 0)
                let scale;

                if(random == 1){

                    scale = 0.03;
                    this.level_sys_comp.InstantiateJoker(this.parent.heart,position,rotation,scale);

                }
                
            } 
        }

        /*
        * AddMissile
        */

        if(this.nextArrow !== Math.round(timeElapsed)){

            this.nextArrow =  Math.round(timeElapsed);

            if(this.nextArrow % 6 == 0 && this.nbArrow == 0){

                let position = new THREE.Vector3( ( ( Math.random() *  ( 9.5 - 1.5 ) ) + 1.5 ) * ( Math.round( Math.random() ) ? 1 : -1 ) ,  -1  , ( ( Math.random() *  ( 9.5 - 2 ) ) + 2  ) * ( Math.round( Math.random() ) ? 1 : -1 ))
                let rotation = new THREE.Euler(0,0,0);      

                let random = Math.round(( Math.random() *  ( 2 - 0) ) + 0)
                let scale;

                if(random == 1){

                    scale = 1;
                    this.level_sys_comp.InstantiateJoker(this.parent.arrow,position,rotation,scale);

                }
                
            } 
        }

        /*
        * Shield
        */

        if(this.nextShield !== Math.round(timeElapsed)){

            this.nextShield =  Math.round(timeElapsed);

            if(this.nextShield % 6 == 0 && this.nbShield == 0){

                let position = new THREE.Vector3( ( ( Math.random() *  ( 9.5 - 1.5 ) ) + 1.5 ) * ( Math.round( Math.random() ) ? 1 : -1 ) ,  0  , ( ( Math.random() *  ( 9.5 - 2 ) ) + 2  ) * ( Math.round( Math.random() ) ? 1 : -1 ))
                let rotation = new THREE.Euler(0,0,0);      

                let random = Math.round(( Math.random() *  ( 2 - 0) ) + 0)
                let scale;

                if(random == 1){

                    scale = 1;
                    this.level_sys_comp.InstantiateJoker(this.parent.shield,position,rotation,scale);

                }
                
            } 
        }
        
        if(this.nextCoin < Math.round(timeElapsed))  this.nextCoin = null 
        if(this.nextHeart < Math.round(timeElapsed))  this.nextHeart = null 
        if(this.nextShield < Math.round(timeElapsed))  this.nextShield = null

        this.nbCoin = 0;
        this.nbHeart = 0;
        this.nbArrow = 0;
        this.nbShield = 0;

    }

    Update(timeElapsed){

        this.JokerSpawnSystem(timeElapsed);

    }

}

export default JokerSystem