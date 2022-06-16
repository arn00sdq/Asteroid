import * as THREE from 'three';

class SoundSystem{

    constructor(parent){

        this.parent = parent;

        this.audioManager = this.parent.gameAudio.audioManager;

        this.masterVolume = 0.7;
        this.sfxVolume = 0.5;
        this.musicVolume = 0.05;

    }

    playAmbientMusic(buffer){

        let ambientSound = this.parent.gameAudio.sound.ambientSound;
        if(ambientSound.isPlaying) ambientSound.stop();
        ambientSound.setBuffer(buffer);
        ambientSound.setVolume(  this.musicVolume > this.masterVolume  ? this.masterVolume : this.musicVolume );
        ambientSound.play();

    }

    playSfxPlayerDamge(buffer){

        let playerDamageSound = this.parent.gameAudio.sound.playerDamageSound;
        if (playerDamageSound.isPlaying)  playerDamageSound.stop()
        playerDamageSound.setBuffer( buffer );
        playerDamageSound.setLoop( false );
        playerDamageSound.setVolume( this.sfxVolume > this.masterVolume ? this.masterVolume : this.sfxVolume );
        playerDamageSound.play();

    }

    playSfxInstantPlayer(buffer){

        let playerInstSound = this.parent.gameAudio.sound.playerInstSound;
        if (playerInstSound.isPlaying)  playerInstSound.stop()
        playerInstSound.setBuffer( buffer );
        playerInstSound.setLoop( false );
        playerInstSound.setVolume( this.sfxVolume > this.masterVolume ? this.masterVolume : this.sfxVolume );
        playerInstSound.play();

    }

    playSfxBullet(buffer){

         let playerBulletSound = this.parent.gameAudio.sound.bulletSound;
         if (playerBulletSound.isPlaying)  playerBulletSound.stop()
         playerBulletSound.setBuffer( buffer );
         playerBulletSound.setLoop( false );
         playerBulletSound.setVolume( 0.05 ); //too loud
         playerBulletSound.play();
 
     }

     playSfxPlasma(buffer){

        let plasmaSound = this.parent.gameAudio.sound.plasmaSound;
        if (plasmaSound.isPlaying)  plasmaSound.stop()
        plasmaSound.setBuffer( buffer );
        plasmaSound.setLoop( false );
        plasmaSound.setVolume( this.sfxVolume > this.masterVolume ? this.masterVolume : this.sfxVolume );
        plasmaSound.play();

    }

     playSfxJoker(buffer){

         let jokerSound = this.parent.gameAudio.sound.jokerSound;
         if (jokerSound.isPlaying)  jokerSound.stop()
         jokerSound.setBuffer( buffer );
         jokerSound.setLoop( false );
         jokerSound.setVolume( this.sfxVolume > this.masterVolume ? this.masterVolume : this.sfxVolume );
         jokerSound.play();
 
     }

     playSfxShield(buffer){

         let shieldSound = this.parent.gameAudio.sound.shieldSound;
         if (shieldSound.isPlaying)  shieldSound.stop()
         shieldSound.setBuffer( buffer );
         shieldSound.setLoop( false );
         shieldSound.setVolume( this.sfxVolume > this.masterVolume ? this.masterVolume : this.sfxVolume );
         shieldSound.play();
 
     }


    PlayEnnemyShoot(buffer){
      
        let ennemyBulletSound = this.parent.gameAudio.sound.ennemyLaserSound;
        if (ennemyBulletSound.isPlaying)  ennemyBulletSound.stop()
        ennemyBulletSound.setBuffer( buffer );
        ennemyBulletSound.setLoop( false );
        ennemyBulletSound.setVolume( this.sfxVolume > this.masterVolume ? this.masterVolume : this.sfxVolume );
        ennemyBulletSound.play(0);

    }

    PlayHitBullet(buffer){

        let bulletAudio =   this.parent.gameAudio.sound.asteroidSound;
        bulletAudio.setBuffer( buffer );
        bulletAudio.setLoop( false );
        bulletAudio.setVolume( this.sfxVolume > this.masterVolume ? this.masterVolume : this.sfxVolume );
        bulletAudio.play(0);

    }

    PlayAsteroidDestruction(buffer){
       
        let exploAudio =  this.parent.gameAudio.sound.asteroidSound;
        if (exploAudio.isPlaying)  exploAudio.stop()
        exploAudio.setBuffer( buffer );
        exploAudio.setLoop( false );
        exploAudio.setVolume( this.sfxVolume > this.masterVolume ? this.masterVolume : this.sfxVolume );
        exploAudio.play(0);

    }

    Update(timeElapsed){}

}

export default SoundSystem