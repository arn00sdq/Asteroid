class DisplaySystem{

    constructor(parent){

        this.parent = parent

    }
    
    printScore(score){
        
        console.log(score)
        if(score !== undefined) document.getElementById("score").innerHTML = score;

    }

    PrintLife(life) {

        if(life !== undefined) document.getElementById("life").innerHTML = life;

    }

    PrintEnnemy(nbEnnemyFrame){

        this.ennemy = nbEnnemyFrame;

        document.getElementById("remaining_asteroid").innerHTML = this.ennemy;

    }


    Update(){}

}

export default DisplaySystem