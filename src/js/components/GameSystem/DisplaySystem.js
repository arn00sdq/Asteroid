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

    printKeyboardShortcut(){
        let keyShortcuts = `
        <div class="container">
            <div class="keyboard_wrapp">
                <div class="keyboard_keys">
                    <div class="row">
                        <div class="keys">Echap</div>
                        <div class="keys">1</div>
                        <div class="keys">2</div>
                        <div class="keys">3</div>
                        <div class="keys">4</div>
                        <div class="keys">5</div>
                        <div class="keys">6</div>
                        <div class="keys">7</div>
                        <div class="keys">8</div>
                        <div class="keys">9</div>
                        <div class="keys">0</div>
                        <div class="keys">-</div>
                        <div class="keys">=</div>
                        <div class="keys backspace_key">Backspace</div>
                    </div>
                    <div class="row">
                        <div class="keys tab_key">TAB</div>
                        <div class="keys">A</div>
                        <div class="keys">Z</div>
                        <div class="keys">E</div>
                        <div class="keys">R</div>
                        <div class="keys">T</div>
                        <div class="keys">Y</div>
                        <div class="keys">U</div>
                        <div class="keys">I</div>
                        <div class="keys">O</div>
                        <div class="keys">P</div>
                        <div class="keys">^</div>
                        <div class="keys">$</div>
                        <div class="keys slash_key">*</div>
                    </div>
                    <div class="row">
                        <div class="keys caps_lock_key">CapsLock</div>
                        <div class="keys">Q</div>
                        <div class="keys">S</div>
                        <div class="keys">D</div>
                        <div class="keys">F</div>
                        <div class="keys">G</div>
                        <div class="keys">H</div>
                        <div class="keys">J</div>
                        <div class="keys">K</div>
                        <div class="keys">L</div>
                        <div class="keys">M</div>
                        <div class="keys">"</div>
                        <div class="keys">;</div>
                        <div class="keys enter_key">Enter</div>
                    </div>
                    <div class="row">
                        <div class="keys Shift">Shift</div>
                        <div class="keys">W</div>
                        <div class="keys">X</div>
                        <div class="keys">C</div>
                        <div class="keys">V</div>
                        <div class="keys">B</div>
                        <div class="keys">N</div>
                        <div class="keys">J</div>
                        <div class="keys">K</div>
                        <div class="keys">?</div>
                        <div class="keys">.</div>
                        <div class="keys">/</div>
                        <div class="keys">!</div>
                        <div class="keys shift_right">Shift</div>
                    </div>
                    <div class="row">
                        <div class="keys crtl_key ctrl_left">Ctrl</div>
                        <div class="keys">Fn</div>
                        <div class="keys alt_key alt_left">Alt</div>
                        <div class="keys space_key"></div>
                        <div class="keys"><</div>
                        <div class="keys alt_key alt_right">Alt</div>
                        <div class="keys win_key">Win</div>
                        <div class="keys ctrl_key ctrl_right">Ctrl</div>
                    </div>
                </div>
            </div>

            <div class="line lineEchap"><div class="text textEchap">Menu</div></div>

            <div class="line lineZ"><div class="text textZ">Avancer</div></div>
            <div class="line lineQ"><div class="text textQ">Virage à </br> gauche</div></div>
            <div class="line lineD"><div class="text textD">Virage à </br> droite</div></div>
            <div class="line lineS"><div class="text textS">Reculer</div></div>
            
            <div class="line lineP"><div class="text textP">Photo</div></div>
            
            <div class="line lineSpace"><div class="text textSpace">Tirer</div></div>

            <div class="line lineH"><div class="text textH">Afficher </br>touches</div></div>
            <div class="line lineJ"><div class="text textJ">Joker</div></div>
            <div class="line lineK"><div class="text textK">Tuer les </br> tous</div></div>

        </div>
       
        
        `
        this.printAPP(keyShortcuts)

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