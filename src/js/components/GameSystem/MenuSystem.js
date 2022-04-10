class MenuSystem{

    constructor(parent){

        this.parent = parent;
        this.listLevel = ["StartMenu","Stage1","Stage2","Stage3"]
        
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
                this.parent.state.pause = false;
                this.uiDisplay.printUIHeader(this.parent.player.life, this.parent.score);
                break;
            case "restart":
                this.levelSystem.scenePicker(this.levelSystem.currentLevel, false);
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
                this.parent.ambientSound.setVolume(  soundSystem.musicVolume > soundSystem.masterVolume  ? soundSystem.masterVolume : soundSystem.musicVolume );
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

        let parent = this.parent;
        switch (event.keyCode) {

            case 27:

                if(parent.GetComponent("LevelSystem").currentLevel == "StartMenu") break;

                if (!this.parent.state.pause) {

                    parent.state.pause = true;
                    this.uiDisplay.printPause();

                } else {

                    parent.state.pause = false;
                    this.uiDisplay.printUIHeader(parent.player.life, parent.score);

                }

                break;
            case 72:
                
                if (!this.parent.state.keyboard) {

                    parent.state.keyboard = true;
                    parent.state.pause = true;
                    this.uiDisplay.printKeyboardShortcut();

                } else {

                    parent.state.keyboard = false;
                    parent.state.pause = false;

                    parent.GetComponent("LevelSystem").currentLevel == "StartMenu" ? this.uiDisplay.printUIStartMenu() : this.uiDisplay.printUIHeader(parent.player.life, parent.score);

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