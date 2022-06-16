class AsteroidHealthSystem{

    constructor(parent,originalColor) {

        this.parent = parent;

        this.life = 15;
        this.color = originalColor;

    }

    Update(  ) {}

    Damage(lifeAmount){


        if(lifeAmount == "max"){

            this.life = 0;

        }else{

            this.life -= lifeAmount
        }
        
        if (this.life < 0) this.life = 0;

        if (this.life > 0) this.DamageMarker();

        if(this.life == 0) {}

    }

    Heal(healAmount){

        this.life += healAmount;
        if (this.life > 0) this.life = this.life

    }

    DamageMarker(){

        let asteroidColor = this.parent.children[0].material.color;
        
        if(asteroidColor.getHexString() !== 'ffffff'){

            asteroidColor.set(0xffffff);

        }
        let asteroidHex = asteroidColor.getHex();
        asteroidColor.set('red');

        setTimeout(() => {

            asteroidColor.set(asteroidHex);

        }, 100);

    }
}

export default AsteroidHealthSystem;