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
        <div class="tb">
            <div id="death_section">

                <div id="header_death">
                    <div id="player_death_msg">Vous etes mort</div>
                    <div id="score_final">Score final : ${score}</div>
                </div>
        
                <div id="button_section_menu">
                    <button name="restart">Restart</button>
                    <button name="quit">Quit</button>
                </div>

            </div> 
        </div>
		
        `
        this.printAPP(ui_death)

    }

    printUIHeader(life,score){

        let ui_header = `
        <div id="header_ui">
            <div id="life_section">  
                <span id="life_title">Vie</span> 
                <span id="life">${life}</span>
            </div>
            <div id="ennemy_r_section">  
                <span id="remaining_title">Restant</span> 
                <span id="remaining_asteroid"></span> 
            </div>
            <div id="score_section"> 
                <span id="score_title">Score</span>
                <span id="sp_score">00000</span> 
                
            </div>
        </div>

        <div class="endurance_bar">
            <div class="endurance_stat" id="endurance">
            </div>
        </div>
        `

        this.printAPP(ui_header)

    }

    printScore(score,increment, points){
        
        let length_score = score.toString().length;
        let score_to_print = ``;
        
        for(let k =0; k <5 - length_score; k++) score_to_print += `0`

        score_to_print += `${score}`
        let append_sp_points = `
            <span id="score_title">Score</span>
            <span id="sp_score">${score_to_print}</span> 
        `
        
        for(let i =0 ; i < increment; i++){
            let posW = Math.random() * 30;
            append_sp_points += `<span id="sp_points" style="right:${posW}px" class="active">+${points}</span>`
        }
         if (document.getElementById("score_section") !== null ) document.getElementById("score_section").innerHTML = append_sp_points;
        

    }

    PrintLife(life) {

        if(life !== undefined) document.getElementById("life").innerHTML = life;

    }

    PrintEnnemy(nbEnnemyFrame){

        this.ennemy = nbEnnemyFrame;
        if (document.getElementById("remaining_asteroid") !== null)
            document.getElementById("remaining_asteroid").innerHTML = this.ennemy;

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
            <div class="line lineShift"><div class="text textShift">Turbo</div></div>
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
                        <div class="option_com_soon">
                            Prochainement !
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
                        <button class="startMenuSPAN" name="play">PLAY GAME</button>
                    </div>
                    <div class="startMenuBtn" id="startMenuB2">
                        <button class="startMenuSPAN" name="video">VIDEO</button>
                    </div>
                    <div class="startMenuBtn" id="startMenuB2">
                        <button class="startMenuSPAN" name="audio">AUDIO</button>
                    </div>
                    <div class="startMenuBtn" id="startMenuB3">
                        <button class="startMenuSPAN" name="credit">CREDITS</button>
                    </div>
                    <div class="startMenuBtn" id="startMenuB4">
                        <button class="startMenuSPAN" name="quit">EXIT</button>
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