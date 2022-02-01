import Component from './component.js';

    class CharacterMouvement extends Component { // composant script
        constructor(params) {
          super();
          this.params = params;
          this.decceleration = new THREE.Vector3(-0.0005, -0.0001,-0.0001);
          this.acceleration = new THREE.Vector3(30, 30, 30);
          this.velocity = 0;
          this.speed = 0.0
        }
    
        InitComponent() {}
    
        Update(timeInSeconds) {
          const input = this.GetComponent('CharacterControllerInput');
          const target = this.GetComponent('ShipMesh')
          
          if ( input.keys.forward ){
            this.speed = 0.01;
            
          }else if ( input.keys.backward ){
            this.speed = -0.01;
          }
            
            this.velocity += ( this.speed - this.velocity ) * .3;
            this.parent.translateZ( this.velocity );
            
            if (  input.keys.left ){
              this.parent.rotateY(0.05);
            }
            else if (  input.keys.right )
            this.parent.rotateY(-0.05);
            /* note 
              * - La classe gameObject est maj en premie
              * - On copie les valeur pos et rota dans les classe Composant qui ont besoin
              * - On ajoute un gameObject (meshProjectileCylinder) dans un composant script ShootProjectProjectile
              * chaque parametre joue le role d'un public field (ref unity)
              * - On maj donc ici poset rota de MPC
            */
          target.soldier.position.copy(this.parent.position)
          target.soldier.rotation.copy(this.parent.rotation)
        }
      };

      export default {CharacterMouvement,Component}