class JokerSystem{

    constructor(parent){

        this.parent = parent;

        this.nextCoin = null;
        this.nextHeart = null;

        this.level_sys_comp = this.parent.GetComponent("LevelSystem");

    }

    JokerSystem(timeElapsed){

        if(this.nextCoin !== Math.round(timeElapsed)){

            this.nextCoin =  Math.round(timeElapsed);

            if(this.nextCoin % 5 == 0){

                let position = new THREE.Vector3( ( ( Math.random() *  ( 9.5 - 1.5 ) ) + 1.5 ) * ( Math.round( Math.random() ) ? 1 : -1 ) ,  0 ,( ( Math.random() *  ( 9.5 - 2 ) ) + 2  ) * ( Math.round( Math.random() ) ? 1 : -1 ))
                let rotation = new THREE.Euler(0,0,0);
                
                let scale = 0.1;
                this.level_sys_comp.InstantiateJoker(this.parent.coin,position,rotation,scale);

         
            } 
          
        }

        if(this.nextHeart !== Math.round(timeElapsed)){

            this.nextHeart =  Math.round(timeElapsed);

            if(this.nextHeart % 6 == 0){

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
        
        if(this.nextCoin < Math.round(timeElapsed))  this.nextCoin = null 
        if(this.nextHeart < Math.round(timeElapsed))  this.nextHeart = null 

    }

    Update(timeElapsed){

        this.JokerSystem(timeElapsed);

    }

}

export default JokerSystem