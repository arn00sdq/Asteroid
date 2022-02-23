class SoundSystem{

    constructor(parent,audio){

        this.parent = parent;

        this.audioManager = audio.audioManager
        this.sound = audio.sound;

    }

    PlayCoinPickUp(){

        if (this.sound.isPlaying)  this.sound.stop()
        this.sound.setBuffer( this.audioManager[0] );
        this.sound.setLoop( false );
        this.sound.setVolume( 1 );
        this.sound.play();

    }

    PlayHeartPickUp(){

        if (this.sound.isPlaying)  this.sound.stop()
        this.sound.setBuffer( this.audioManager[1] );
        this.sound.setLoop( false );
        this.sound.setVolume( 1 );
        this.sound.play();

    }




    Update(timeElapsed){}

}

export default SoundSystem