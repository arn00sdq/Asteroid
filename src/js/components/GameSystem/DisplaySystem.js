class DisplaySystem{

    constructor(parent){

        this.parent = parent;
        this.container = document.body;

    }

    printAPP(element){

        this.container.innerHTML = element;
        this.container.appendChild(this.parent.renderer.domElement)

    }

    printDeath(score){

        let ui_death = `
		<div id="death_section">

            <div id="header_death">
                <div id="player_death_msg">Vous etes mort</div>
                <div id="score_final">Score final : ${score}</div>
            </div>
    
            <div id="button_section_menu">
                <button id="restart">Restart</button>
                <button id="quit">Quit</button>
            </div>

        </div> 
        `
        this.printAPP(ui_death)

    }

    printUIHeader(life,score){

        let ui_header = `
        <div id="header_ui">

            <div> Vie :  <span id="life">${life}</span> </div>
            <div> Restant : <span id="remaining_asteroid"></span> </div>
            <div> Score : <span id="score">${score}</span> </div>

        </div>
        `

        this.printAPP(ui_header)

    }

    printStageCompleted(score){

        let ui_header = `
        <div id="stage_comp_section">

            <div id="header_stage_comp">
                <div id="stage_comp_msg">Stage completed</div>
                <div id="score_stage_comp">Score : ${score} </div>
            </div>
    
            <div id="button_section_menu">
                <button id="next">Next</button>
                <button id="quit">Quit</button>
            </div>

        </div> 
        `

        this.printAPP(ui_header)

    }

    printPause(){

        let ui_pause = `
        <div id="pause_menu_section">
            <div id="header_menu">
                <div id="title_game_menu">Asteroid</div>
                <div id="title_menu">Pause Menu</div>
            </div>
            <div id="button_section_menu">
                <button id="resume">Resume</button>
                <button id="restart">Restart</button>
                <button id="video">Video</button>
                <button id="audio">Audio</button>
                <button id="quit">Quit</button>
            </div>
        </div>
    `

    this.printAPP(ui_pause)

    }
    
    printScore(score){
        
        if(score !== undefined) document.getElementById("score").innerHTML = score;

    }

    PrintLife(life) {

        if(life !== undefined) document.getElementById("life").innerHTML = life;

    }

    PrintEnnemy(nbEnnemyFrame){

        this.ennemy = nbEnnemyFrame;
        if (document.getElementById("remaining_asteroid") !== null)
            document.getElementById("remaining_asteroid").innerHTML = this.ennemy;

    }


    Update(){}

}

export default DisplaySystem