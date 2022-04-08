class MenuSystem{

    constructor(parent){

        this.parent = parent;

        
        this.video = {//rename en video 

            brightness:0.2,
            bloom:true,
            outline:true,
            fxaa:false,

        }

        this.uiDisplay = this.parent.GetComponent("DisplaySystem");
        this.levelSystem = this.parent.GetComponent("LevelSystem");
        this.soundSystem = this.parent.GetComponent("SoundSystem");

        document.addEventListener('click', (e) => this.OnClick(e), false);
        document.addEventListener("change", (e) => this.OnChange(e), false);
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
                this.parent.state.pause = false;
                this.uiDisplay.printUIHeader(this.parent.player.life, this.parent.score);
                break;
            case "restart":
                this.levelSystem.resetLevel(this.levelSystem.currentLevel);
                this.levelSystem.scenePicker(this.levelSystem.currentLevel, false);
                break;
            case "next":
                this.levelSystem.resetLevel();
                let currentLevel = this.levelSystem.currentLevel + 1;
                this.levelSystem.startLevel(currentLevel, false);
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
            case "quit":
                document.location.href = "index.html";
                break;
            default:
                break;

        }




    }

    OnChange(event) {

        switch (event.target.id) {

            case "range_master_volume":
                this.soundSystem.masterVolume = event.target.value / 100;
                document.getElementById("sp_master_volume").innerHTML = soundSystem.masterVolume;
                break;
            case "range_sfx_volume":
                this.soundSystem.sfxVolume = event.target.value / 100;
                document.getElementById("sp_sfx_volume").innerHTML = soundSystem.sfxVolume;
                break;
            case "range_music_volume":
                this.soundSystem.musicVolume = event.target.value / 100;
                document.getElementById("sp_music_volume").innerHTML = soundSystem.musicVolume;
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

    checkPostProcess(){

        this.parent.postProActive = false;
        Object.keys(this.video).forEach( e => {

            if (this.video[e] == true) this.parent.postProActive = true;

        });

    }

    Update(){}

}

export default MenuSystem