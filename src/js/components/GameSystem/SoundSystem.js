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

    playSfxPlayerDamge(buffer){

        let playerDamageSound = this.parent.playerDamageSound;
        if (playerDamageSound.isPlaying)  playerDamageSound.stop()
        playerDamageSound.setBuffer( buffer );
        playerDamageSound.setLoop( false );
        playerDamageSound.setVolume( this.sfxVolume > this.masterVolume ? this.masterVolume : this.sfxVolume );
        playerDamageSound.play();

    }

    playSfxInstantPlayer(buffer){

        let playerInstSound = this.parent.playerInstSound;
        if (playerInstSound.isPlaying)  playerInstSound.stop()
        playerInstSound.setBuffer( buffer );
        playerInstSound.setLoop( false );
        playerInstSound.setVolume( this.sfxVolume > this.masterVolume ? this.masterVolume : this.sfxVolume );
        playerInstSound.play();

    }

    playSfxBullet(buffer){

         let playerBulletSound = this.parent.bulletSound;
         if (playerBulletSound.isPlaying)  playerBulletSound.stop()
         playerBulletSound.setBuffer( buffer );
         playerBulletSound.setLoop( false );
         playerBulletSound.setVolume( 0.05 ); //too loud
         playerBulletSound.play();
 
     }

     playSfxPlasma(buffer){

        let plasmaSound = this.parent.plasmaSound;
        if (plasmaSound.isPlaying)  plasmaSound.stop()
        plasmaSound.setBuffer( buffer );
        plasmaSound.setLoop( false );
        plasmaSound.setVolume( this.sfxVolume > this.masterVolume ? this.masterVolume : this.sfxVolume );
        plasmaSound.play();

    }

     playSfxJoker(buffer){

         let jokerSound = this.parent.jokerSound;
         if (jokerSound.isPlaying)  jokerSound.stop()
         jokerSound.setBuffer( buffer );
         jokerSound.setLoop( false );
         jokerSound.setVolume( this.sfxVolume > this.masterVolume ? this.masterVolume : this.sfxVolume );
         jokerSound.play();
 
     }

     playSfxShield(buffer){

         let shieldSound = this.parent.shieldSound;
         if (shieldSound.isPlaying)  shieldSound.stop()
         shieldSound.setBuffer( buffer );
         shieldSound.setLoop( false );
         shieldSound.setVolume( this.sfxVolume > this.masterVolume ? this.masterVolume : this.sfxVolume );
         shieldSound.play();
 
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