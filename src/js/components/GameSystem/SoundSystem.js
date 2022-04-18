import * as THREE from 'three';

class SoundSystem{

    constructor(parent,audio){

        this.parent = parent;

        this.audioManager = audio.audioManager
        this.sound = audio.sound;

        this.masterVolume = 0.7;
        this.sfxVolume = 0.5;
        this.musicVolume = 0.05;

    }

    playAmbientMusic(buffer){

        let ambientSound = this.parent.ambientSound;
        if(ambientSound.isPlaying) ambientSound.stop();
        ambientSound.setBuffer(buffer);
        ambientSound.setVolume(  this.musicVolume > this.masterVolume  ? this.masterVolume : this.musicVolume );
        ambientSound.play();

    }


    playSfx(buffer){

        const playerAudio = this.parent.player.children.find(e => e.constructor.name == "PositionalAudio")

        if (playerAudio.isPlaying)  playerAudio.stop()
        console.log(buffer)
        playerAudio.setBuffer( buffer );
        playerAudio.setLoop( false );
        playerAudio.setVolume( this.sfxVolume > this.masterVolume ? this.masterVolume : this.sfxVolume );
        playerAudio.play();

    }


    PlayEnnemyShoot(ennemy){
      
        const bulletBuffer =  this.audioManager.find(e => e.name == "ennemyLaser");
        const ennemyAudio = ennemy.children.find(e => e.constructor.name == "PositionalAudio")

        if (ennemyAudio.isPlaying)  ennemyAudio.stop()
        ennemyAudio.setBuffer( bulletBuffer );
        ennemyAudio.setLoop( false );
        ennemyAudio.setVolume( this.sfxVolume > this.masterVolume ? this.masterVolume : this.sfxVolume );
        ennemyAudio.play(0);

    }

    PlayHitBullet(bullet, delay){

        const bulletBuffer =  this.audioManager.find(e => e.name == "BulletHit");
        let bulletAudio =  bullet.children.find(e => e.constructor.name == "PositionalAudio");

        bulletAudio.setBuffer( bulletBuffer );
        bulletAudio.setRefDistance( 1);
        bulletAudio.setLoop( false );
        bulletAudio.setVolume( this.sfxVolume > this.masterVolume ? this.masterVolume : this.sfxVolume );

        bulletAudio.play(delay);

    }

    PlayAsteroidDestruction(asteroid, delay){

        const exploBuffer =  this.audioManager.find(e => e.name == "AsteroidExplosion");
       
        let exploAudio =  asteroid.children.find(e => e.constructor.name == "PositionalAudio");
        if (exploAudio.isPlaying)  exploAudio.stop()
        exploAudio.setBuffer( exploBuffer );
        exploAudio.setLoop( false );
        exploAudio.setVolume( this.sfxVolume > this.masterVolume ? this.masterVolume : this.sfxVolume );

        exploAudio.play(0);

    }

    Update(timeElapsed){}

}

export default SoundSystem