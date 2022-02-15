class AsteroidHealthSystem{

    constructor(parent) {

        this.parent = parent;
        this.life = 15;

    }

    Update() {}

    Damage(lifeAmount){

        

        if(lifeAmount == "max"){

            this.life = 0;

        }else{

            this.life -= lifeAmount
        }
        
        if (this.life < 0) this.life = 0;

        if (this.life > 0) this.DamageMarker();
        ; 
    }

    Heal(healAmount){

        this.life += healAmount;
        if (this.life > 0) this.life = this.life

    }

    DamageMarker(){

        let asteroidColor = this.parent.children[0].material.color;
        let asteroidHex = asteroidColor.getHex();
        asteroidColor.set('red');

        setTimeout(() => {

            asteroidColor.set(asteroidHex);

        }, 100);

    }
}

export default AsteroidHealthSystem;