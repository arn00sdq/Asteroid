class AsteroidHealthSystem{

    constructor(parent,originalColor) {

        this.parent = parent;
        this.color = originalColor;

    }

    Update(  ) {}

    Damage(lifeAmount){

        if(lifeAmount == "max"){

            this.parent.life = 0;

        }else{

            this.parent.life -= lifeAmount
        }
        
        if (this.parent.life < 0) this.parent.life = 0;

        if (this.parent.life > 0) this.DamageMarker();

    }

    Heal(healAmount){

        this.parent.life += healAmount;
        if (this.life > 0) this.parent.life = this.parent.life

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