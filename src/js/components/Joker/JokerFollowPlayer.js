class JokerFollowPlayer { 

    constructor(parent, target,x,z) {

        this.parent = parent
        this.target = target;

        this.temp = new THREE.Vector3;
        this.dir = new THREE.Vector3;
        this.a = new THREE.Vector3;
        this.b = new THREE.Vector3;
        this.x = x;
        this.z = z;
        this.offset = 0.3;

    }
        
    InitComponent() {}

    FollowPlayer(){

        this.a.copy(this.parent.position).add(new THREE.Vector3(0,0,this.z.z)).add(new THREE.Vector3(0,0,this.x.x));
        this.b.copy(this.target.position);

        if (this.a > this.b){
            this.dir.copy( this.a ).sub( this.b );// Calcul de la pos du bouclier

        }else{
            this.dir.copy( this.b ).sub( this.a );// Calcul de la pos du bouclier
        }
        
        let dis = this.a.distanceTo( this.b );  // pos vaisseau - pos cam

        this.parent.position.addScaledVector( this.dir, dis ); // multiplié par la distance en float


    }

    Update(timeElapsed) {

        this.FollowPlayer();

    }

  };

export default JokerFollowPlayer