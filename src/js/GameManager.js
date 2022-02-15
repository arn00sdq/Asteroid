class GameManager {

    constructor(scene){

        this.scene = scene;
        this.score = 0;
        this.ennemy = 0;

    }

    OnPlayerEnd() {

        console.log("playerDead")

    }

    printScore(){
        
        document.getElementById("score").appendChild = this.score;

    }

    CountEnnemy(nbEnnemyFrame){

        this.ennemy = nbEnnemyFrame;

        document.getElementById("remaining_asteroid").innerHTML = this.ennemy;

    }

}

export default GameManager