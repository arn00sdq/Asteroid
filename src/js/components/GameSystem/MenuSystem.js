class MenuSystem{

    constructor(parent){

        this.parent = parent;
        this.listLevel = ["StartMenu","Stage1","Stage2","Stage3"]
        
        this.video = {//rename en video 

            brightness:0.2,
            bloom:true,
            outline:true,
            fxaa:false,
            stat:false,

        }

        this.uiDisplay = this.parent.GetComponent("DisplaySystem");
        this.levelSystem = this.parent.GetComponent("LevelSystem");
        this.soundSystem = this.parent.GetComponent("SoundSystem");

        this.playerHealth = this.parent.player.GetComponent("PlayerHealthSystem");
        this.gameState = this.parent.state;
        this.ambientSound = this.parent.ambientSound;

        document.addEventListener('click', (e) => this.OnClick(e), false);
        document.addEventListener("change", (e) => this.OnChange(e), false);
        document.addEventListener('keydown', (e) => this.OnKeyDown(e), false);
    }

    OnClick(event) {

        switch (event.target.name) {
           
            case "play":
                this.levelSystem.scenePicker("Stage1",false,true);
                break;
            case "retour":         
                this.levelSystem.currentLevel == "StartMenu" ? this.uiDisplay.printUIStartMenu() : this.uiDisplay.printPause();
                break;
            case "resume":
                this.gameState.pause = false;
                this.uiDisplay.printUIHeader(this.playerHealth.life, this.parent.score);
                break;
            case "restart":
                console.log(this.ambientSound.isPlaying)
                this.levelSystem.scenePicker(this.levelSystem.currentLevel , false, false);
                break;
            case "next":

                let index = this.listLevel.indexOf(this.levelSystem.currentLevel);

                if(index == this.listLevel.length){
                    //print truc
                }else{

                    index += 1;//can't do ++ in list level
                    this.levelSystem.currentLevel = this.listLevel[index];
                    this.levelSystem.scenePicker(this.levelSystem.currentLevel , false, true);
                    
                }
                
                break;
            case "audio":
                this.uiDisplay.printAudioUIMenu();
                break;
            case "video":
                this.uiDisplay.printVideoUIMenu();
                break;
            case "fxaa_post_process":
                this.video.fxaa == false ? this.video.fxaa = true: this.video.fxaa=false;
                this.checkPostProcess();
                this.uiDisplay.printVideoUIMenu();
                this.parent.PostProcessRender();
                break;
            case "outline_post_process":
                this.video.outline == false ? this.video.outline = true: this.video.outline=false;
                this.checkPostProcess();
                this.uiDisplay.printVideoUIMenu();
                this.parent.PostProcessRender();
                break;
            case "bloom_post_process":
                this.video.bloom == false ? this.video.bloom = true: this.video.bloom=false;
                this.checkPostProcess();
                this.uiDisplay.printVideoUIMenu();
                this.parent.PostProcessRender();
            break;
            case "stat":

                if (this.video.stat ==false) {

                    this.video.stat=true;
                    this.parent.stat = true;
                    this.uiDisplay.displayStat = true;

                }else{

                    this.video.stat = false; 
                    this.parent.stat = false;
                    this.uiDisplay.displayStat = false;


                }
                this.uiDisplay.printVideoUIMenu();

                
            break;
            case "quit":
                this.levelSystem.currentLevel == "StartMenu" ? document.location.href = "index.html" : this.levelSystem.scenePicker("StartMenu",false,true);
                break;
            default:
                break;

        }

    }

    OnChange(event) {

        let soundSystem = this.parent.GetComponent("SoundSystem");

        switch (event.target.id) {

            case "range_master_volume":
                soundSystem.masterVolume = event.target.value / 100;
                document.getElementById("range_master_volume").innerHTML = soundSystem.masterVolume;
                break;
            case "range_sfx_volume":
                soundSystem.sfxVolume = event.target.value / 100;
                document.getElementById("range_sfx_volume").innerHTML = soundSystem.sfxVolume;
                break;
            case "range_music_volume":
                console.log()
                soundSystem.musicVolume = event.target.value / 100;
                document.getElementById("range_music_volume").innerHTML = soundSystem.musicVolume;
                this.ambientSound.setVolume(  soundSystem.musicVolume > soundSystem.masterVolume  ? soundSystem.masterVolume : soundSystem.musicVolume );
                break;
            case "range_brightness":
                this.video.brightness = event.target.value/100;
                document.getElementById("sp_brighteness").innerHTML = this.video.brightness;
                let ambientLight = this.parent.currentScene.children.find(e => e.constructor.name == "AmbientLight")
                ambientLight.intensity =  this.video.brightness;
            default:
                break;

        }

    }

    OnKeyDown(event) {

        switch (event.keyCode) {

            case 27:

                if(this.levelSystem.currentLevel == "StartMenu") break;

                if (!this.gameState.pause) {

                    if(this.ambientSound.isPlaying) this.ambientSound.pause();

                    if(this.levelSystem.currentLevel == "Stage3") this.levelSystem.timer.paused = true;

                    this.gameState.pause = true;
                    this.uiDisplay.printPause();

                } else {

                    if(!this.ambientSound.isPlaying) this.ambientSound.play();

                    this.gameState.pause = false;
                    this.uiDisplay.printUIHeader(this.playerHealth.life, parent.score);
                    
                    if(this.levelSystem.currentLevel == "Stage3"){

                        this.uiDisplay.printTimer();
                        this.levelSystem.timer.paused = false;

                    } 

                }

                break;
            case 72:
                
                if (!this.gameState.keyboard) {

                    this.gameState.keyboard = true;
                    this.gameState.pause = true;
                    this.uiDisplay.printKeyboardShortcut();
                   

                } else {

                    parent.state.keyboard = false;
                    parent.state.pause = false;
                    this.levelSystem.currentLevel == "StartMenu" ? this.uiDisplay.printUIStartMenu() : this.uiDisplay.printUIHeader(this.playerHealth.life, parent.score);

                }
                break;
        }

    }

    checkPostProcess(){

        this.parent.postProActive = false;
        Object.keys(this.video).forEach( e => {

            if (this.video[e] == true) this.parent.postProActive = true;

        });

    }

    Update(){}

}

export default MenuSystem