import Component from "./component.js";

class PlayerShootProjectiles extends Component{
    constructor(weaponParams){
        super();
        this.weaponParams = weaponParams;
        this.bulletTab = [];
        this.cloneSps = null;
        this.speed = 0.4;
    }

    Update(timeElapsed){
        const input = this.GetComponent('CharacterControllerInput');
        const SpaceShip = this.GetComponent('ShipMesh');   
          if ( input.keys.shoot ){ // plusieurs if donc chagez le param weaponParams
            input.keys.shoot = false;
            this.parent.Instantiate(this.weaponParams.basicBullet, SpaceShip.soldier.position, SpaceShip.soldier.rotation); 
          }
          this.bulletTab.forEach(b => {
            b.translateZ(this.speed)
        });
    }
}

export default {PlayerShootProjectiles}