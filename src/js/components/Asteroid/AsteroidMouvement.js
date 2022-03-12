class AsteroidMovement { 

    constructor(parent) {

      this.parent = parent;

      this.shift = new THREE.Vector3();
      this.velocity = new THREE.Vector3();
      this.forward = new THREE.Vector3();

      this.gravity = 0;

      this.gravityZone = false;
      
      this.directionToTurn = new THREE.Vector3();
      this.directionLerp= new THREE.Vector3();

      this.dir = new THREE.Vector3
      this.dis = 0

    }
        

    Update(timeElapsed) {

      this.customvitesse = (1 + (1/ (this.parent.scale.x))/100);
      this.palier = 1 + ((Math.floor(timeElapsed / 3) + 1) * 0.01 );

      if(this.parent.children[0] !== null){

        this.parent.children[0].rotation.x = (this.parent.children[0].rotation.x + (Math.PI / 180) * 0.016 * 10 );
        this.parent.children[0].rotation.y = (this.parent.children[0].rotation.y + (Math.PI / 180) * 0.016 * 10 );
        this.parent.children[0].rotation.z = (this.parent.children[0].rotation.z + (Math.PI / 180) * 0.016 * 10);
  
      }

      this.Subsomption(timeElapsed);


    }

    Subsomption(timeElapsed) {
  
      let condition = this.PerceptObstacle();
      if (condition){

        this.Turn(timeElapsed);

      } else{

        this.Move(timeElapsed)
      }
      

  }

  //---- Percept

  ForceGravitationnelle(m1,m2,d){

    return ((6.67*Math.pow(10,-11)*m1*Math.pow(10,9)*m2*Math.pow(10,9))/ ( (d*Math.pow(10,5) * 2 )));

  }

  PerceptObstacle(){

    this.gravityZone = false; 
    this.parent.scene.children.forEach((e) => {

        if(e.name == "Asteroid" && (e.uuid != this.parent.uuid) ){
            if (this.parent.position.distanceTo(e.position) < /*(e.scale.x * 100 * 1.5 )*/ 2 ){

                this.gravityZone = true;  
                
                this.dir.copy(e.position ).sub(this.parent.position).normalize(); // a CHECK
                this.dis = this.parent.position.distanceTo(e.position); 
                
               // this.dis = (1/this.dis)*0.5 //proche =  + rapide
                this.directionToTurn.addScaledVector(this.dir,this.dis).multiplyScalar(this.ForceGravitationnelle(e.scale.x,this.parent.scale.x,this.dis) * e.scale.x * 10);// ou 0.005
                
                
            } 
        }

    });

    
    return this.gravityZone;

}

  //---- Action

  Move(timeElapsed){

    this.shift.set(this.velocity.x,0,this.velocity.z).multiplyScalar( 0.003);
    //this.shift.set(0,0,0).multiplyScalar( 0.003);
    this.parent.position.add(this.shift)

  }
  Turn(timeElapsed){

    //this.shift.set(this.velocity.z,0,this.velocity.z).add(this.directionLerp).multiplyScalar( 0.002);
    this.directionLerp.lerp(this.directionToTurn,0.1)
    this.velocity.add(this.directionLerp)
    this.shift.set(this.velocity.x,0,this.velocity.z).multiplyScalar( 0.003);
    this.parent.position.add(this.shift)
    
  }

  };

export default AsteroidMovement