import Stat from "https://cdn.jsdelivr.net/npm/three@0.139.2/examples/jsm/libs/stats.module.js"
import Timer  from "../Timer/timer.js"

class DisplaySystem{

    constructor(parent){

        this.parent = parent;
        this.container = document.body;
        
        this.displayStat = false;

        this.timer = this.parent.GetComponent("LevelSystem").timer;

    }

    printAPP(element){

        this.container.innerHTML = element;
        this.container.appendChild(this.parent.utils.renderer.domElement)

        if(this.displayStat) document.body.appendChild( this.parent.targetStat.dom) 

    }

    printDeath(score){

        let ui_death = `
        <div class="tb">
            <div class="end-section">

                <div id="header_death">
                    <div id="player-death-msg">Vous etes mort</div>
                    <div class="score-final">Score final : ${score}</div>
                </div>
        
                <div class="button-section-menu">
                    <button name="restart">Restart</button>
                    <button name="quit">Quit</button>
                </div>

            </div> 
        </div>
		
        `
        this.printAPP(ui_death)

    }

    printVictory(score){

        let ui_victory = `

        <div class="tb">
            <div class="end-section">

                <div id="header-victory">
                    <div id="player-victory-msg">Victoire</div>
                    <div class="score-final">Score final : ${score}</div>
                </div>
        
                <div class="button-section-menu">
                    <button name="quit">Quit</button>
                </div>

            </div> 
        </div>
		
        `
        this.printAPP(ui_victory)

    }

    printUIHeader(life,stamina,ultimate,score){

        let ui_header = `
        
        <div id="header-hud"> 
            <div id="score-section">
                <span class="score-title">Score</span>
                <span id="sp-score">00000</span>  
            </div>
            <div id="timer">
            </div>
            <div id="stat-section">
            </div>
        </div>
        <div id="footer-hud">
            <div class="game-infos-icon">
                <div class="game-infos-section">
                    <img class="infos-icon" src="../../../src/medias/images/hud/meteor-solid.svg"/>
                    <div id="remaining-asteroid">${life}</div>
                </div>
                <div class="game-infos-section">
                    <img class="infos-icon" src="../../../src/medias/images/hud/skull-solid.svg"/>
                    <div id="asteroid-killed">0</div>
                </div>
                <div class="game-infos-section">
                    <img class="infos-icon" src="../../../src/medias/images/hud/infinity-solid.svg"/>
                    <div id="joker-cheat"></div>
                </div>

            </div>
            <div class="player-bar">  
                <div class="player-section">
                    <img class="hud-icon" src="../../../src/medias/images/hud/heart-solid.svg"/>
                    <div class="player-health-bar">
                        <div id="health-bar"></div>
                    </div>
                    <div id="life">${life}</div>
                </div>
                
                <div class="player-section">
                    <img class="hud-icon" src="../../../src/medias/images/hud/bolt-lightning-solid.svg"/>
                    <div class="player-stamina-bar">
                        <div class="stamina-bar" id="endurance"></div>
                    </div>
                    <div id="stamina">${stamina}</div>
                </div>

                <div class="player-section">
                    <img class="hud-icon" src="../../../src/medias/images/hud/wand-magic-solid.svg"/>
                    <div class="player-abilities-bar">
                        <div class="power-bar" id="power"></div>
                    </div>
                    <div id="powerp">${ultimate}</div>
                </div> 

            </div> 
        </div>

        `

        this.printAPP(ui_header)

    }

    printScore(score,increment, points){
        
        
        let length_score = score.toString().length;
        let scoreToPrint = ``;
        
        for(let k =0; k <5 - length_score; k++) scoreToPrint += `0`
        scoreToPrint += `${score}`
        let appendScore = `
            <span class="score-title">Score</span>
            <span id="sp-score">${scoreToPrint}</span> 
        `
        
        for(let i =0 ; i < increment; i++){
            let posW = Math.random() * 5;
            appendScore += `<span id="sp-points" style="right:${posW}vw" class="active">+${points}</span>`
        }
        
        document.getElementById("score-section").innerHTML = appendScore;
        

    }

    printTimer(){

       document.getElementById("timer").innerHTML = `
        <div class="base-timer">
        <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <g class="base-timer__circle">
            <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
            <path
                id="base-timer-path-remaining"
                stroke-dasharray="283"
                class="base-timer__path-remaining ${this.timer.remainingPathColor}"
                d="
                M 50, 50
                m -45, 0
                a 45,45 0 1,0 90,0
                a 45,45 0 1,0 -90,0
                "
            ></path>
            </g>
        </svg>
        <span id="base-timer-label" class="base-timer__label">${this.timer.formatTime(
            this.timer.timeLeft
        )}</span>
        </div>
        `;

    }

    PrintLife(life) {

        document.getElementById("life").innerHTML = life;

        if(life !== 0) document.getElementById('health-bar').style.width = (100/3)*life+"%";
        if(life == 0) document.getElementById('health-bar').style.width = "0%";

    }

    PrintEnnemyRemaining(nbEnnemyFrame){

        this.ennemy = nbEnnemyFrame;
        if (document.getElementById("remaining-asteroid") !== null) document.getElementById("remaining-asteroid").innerHTML = this.ennemy;

    }

    PrintEnnemyKilled(nbEnnemyFrame){

        this.ennemy = nbEnnemyFrame;
        if (document.getElementById("asteroid-killed") !== null) document.getElementById("asteroid-killed").innerHTML = this.ennemy;

    }

    printStageCompleted(score){

        let ui_header = `
        <div class="tb">
            <div id="stage_comp_section">

                <div id="header_stage_comp">
                    <div id="stage_comp_msg">Stage completed</div>
                    <div id="score_stage_comp">Score : ${score} </div>
                </div>
        
                <div id="button_section_menu">
                    <button name="next">Next</button>
                    <button name="quit">Quit</button>
                </div>

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
                        <div class="keys crtl_key ctrl_left">Echap</div>
                        <div class="keys">F1</div>
                        <div class="keys">F2</div>
                        <div class="keys">F4</div>
                        <div class="keys">F5</div>
                        <div class="keys">F6</div>
                        <div class="keys">F7</div>
                        <div class="keys">F8</div>
                        <div class="keys">F9</div>
                        <div class="keys">F10</div>
                        <div class="keys">F11</div>
                        <div class="keys">F12</div>
                        <div class="keys">Impr syst</div>
                    </div>
                    <div class="row">
                        <div class="keys">²</div>
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
            <button class="button-53" role="button" name="retour">Retour</button>

           
            <img src="../medias/images/key/mouse.jpg" class="mouse-pict "/>

            <div class="line lineEchap"><div class="text textEchap">Menu</div></div>

            <div class="line lineZ"><div class="text textZ">Avancer</div></div>
            <div class="line lineShift"><div class="text textShift">Turbo</div></div>
            <div class="line lineQ"><div class="text textQ">Virage à </br> gauche</div></div>
            <div class="line lineD"><div class="text textD">Virage à </br> droite</div></div>
            <div class="line lineS"><div class="text textS">Reculer</div></div>
            
            <div class="line lineP"><div class="text textP">Photo</div></div>
            <div class="line lineF11"><div class="text textF11">Plein écran</div></div>
            
            <div class="line lineSpace"><div class="text textSpace">Tirer</div></div>
            <div class="line linePower"><div class="text textPower">Compétance spécial</div></div>

            <div class="line lineH"><div class="text textH">Afficher </br>touches</div></div>
            <div class="line lineJ"><div class="text textJ">Joker</div></div>
            <div class="line lineK"><div class="text textK">Tuer les </br> tous</div></div>

            <div class="line lineMouse"><div class="text textMouse">FOV</div></div>

        </div>
       
        
        `
        this.printAPP(keyShortcuts)

    }

    printAudioUIMenu(){
        
        let sound_sys = this.parent.GetComponent("SoundSystem");

        let audioUI = `
        <div class="tb">
            <div class="option_menu">
                <div class="name_menu_section">
                    <span class="#">Audio</span>
                </div>
                <div class="option_hr"></div>    
                <div class="option_input_section">
                    <div class="slider_input_field">
                        <span class="option_input_name">Master Volume</span>
                        <input class="range" id="range_master_volume" type="range" name="" min="0"  max="100" value="${sound_sys.masterVolume * 100}">
                        <div class="box_input_val">
                            <span name="sp_master_volume">${sound_sys.masterVolume}</span>
                        </div>
                    </div>
                    <div class="option_hr"></div>    
                    <div class="slider_input_field">
                        <span class="option_input_name">Sfx volume</span>
                        <input class="range" id="range_sfx_volume" type="range" name="" min="0"  max="100" value="${sound_sys.sfxVolume  * 100}">
                        <div class="box_input_val">
                            <span name="sp_sfx_volume">${sound_sys.sfxVolume}</span>
                        </div> 
                    </div>
                    <div class="option_hr"></div>    
                    <div class="slider_input_field">
                        <span class="option_input_name">Music Volume</span>
                        <input class="range" id="range_music_volume" type="range" name="" min="0"  max="100" value="${sound_sys.musicVolume  * 100}" >
                        <div class="box_input_val">
                            <span name="sp_music_volume">${sound_sys.musicVolume}</span>
                        </div>                   
                    </div>
                </div>
                <div class="footer_menu">
                    <div class="redirection_menu">
                        <button class="retour" name="retour">Retour</span>
                    </div>              
                </div>
            </div>
        </div>           
        ` 
        this.printAPP(audioUI)

    }

    printVideoUIMenu(){

        let videoParam = this.parent.GetComponent("MenuSystem").video;

        let videoUI = `
        <div class="tb">
            <div class="option_menu">
                <div class="name_menu_section">
                    <span class="#">Video</span>
                </div>
                <div class="option_input_section">
                    <div class="slider_input_field">
                        <span class="option_input_name">Brightness</span>
                        <input class="range" id="range_brightness" type="range" name="" min="0"  max="100" value="${videoParam.brightness * 100}">
                        <div class="box_input_val">
                            <span id="sp_brighteness">${videoParam.brightness}</span>
                        </div>
                    </div>
                    <div class="arrow_option_field">
                        <span class="option_input_name">FXAA</span>
                        <div class="arrow_picker">
                            <button name="fxaa_post_process"  class="arrow left"></button>
                            <div class="value_arrow" >${videoParam.fxaa == true ? "On" : "Off"}</div>
                            <button name="fxaa_post_process" class="arrow right"></button>                
                        </div>
                    </div>
                    <div class="arrow_option_field">
                        <span class="option_input_name">Outline</span>
                        <div class="arrow_picker">
                            <button name="outline_post_process" class="arrow left"></button>
                            <div class="value_arrow" >${videoParam.outline == true ? "On" : "Off"}</div>
                            <button name="outline_post_process" class="arrow right"></button>                
                        </div>
                    </div>
                    <div class="arrow_option_field">
                        <span class="option_input_name">Bloom</span>
                        <div class="arrow_picker">
                            <button  name="bloom_post_process" class="arrow left"></button>
                            <div class="value_arrow" >${videoParam.bloom == true ? "On" : "Off"}</div>
                            <button name="bloom_post_process" class="arrow right"></button>                
                        </div>
                    </div>
                    <div class="arrow_option_field">
                        <span class="option_input_name">Target FPS</span>
                        <div class="arrow_picker">
                            <button  name="stat" class="arrow left"></button>
                            <div class="value_arrow" >${videoParam.stat == true ? "On" : "Off"}</div>
                            <button name="stat" class="arrow right"></button>                
                        </div>
                    </div>
                </div>
                <div class="footer_menu">
                    <div class="redirection_menu">
                        <button class="retour" name="retour">Retour</span>
                    </div>              
                </div>
            </div>
        </div>
        ` 
        this.printAPP(videoUI)

    }

    printUIStartMenu(){
        let startMenuUI = `
        <div id="startMenuLayout">
            <div id="startMenuHeader">
                <span id="titleGame">ASTEROID</span>
            </div>
            <div id="startMenuBody">
                <div id="startMenuSelection">
                    <div class="startMenuBtn" id="startMenuB1">
                        <button class="startMenuSPAN" name="play">Play game</button>
                    </div>
                    <div class="startMenuBtn" id="startMenuB2">
                        <button class="startMenuSPAN" name="video">Video</button>
                    </div>
                    <div class="startMenuBtn" id="startMenuB2">
                        <button class="startMenuSPAN" name="audio">Audio</button>
                    </div>
                    <div class="startMenuBtn" id="startMenuB3">
                        <button class="startMenuSPAN" name="commande">Commande</button>
                    </div>
                    <div class="startMenuBtn" id="startMenuB4">
                        <button class="startMenuSPAN" name="credit">Credits</button>
                    </div>
                    <div class="startMenuBtn" id="startMenuB5">
                        <button class="startMenuSPAN" name="quit">Exit</button>
                    </div>
                </div>
            </div>
        </div>
        ` 
        this.printAPP(startMenuUI)

    }

    printPause(){

        let ui_pause = `
        <div id="pause_menu_section">
            <div id="header_menu">
                <div id="title_game_menu">Asteroid</div>
                <div id="title_menu">Pause Menu</div>
            </div>
            <div id="button_section_menu">
                <button name="resume">Resume</button>
                <button name="restart">Restart</button>
                <button name="video">Video</button>
                <button name="audio">Audio</button>
                <button name="quit">Quit</button>
            </div>
        </div>
    `

    this.printAPP(ui_pause)

    }
    



    Update(){}

}


export default DisplaySystem