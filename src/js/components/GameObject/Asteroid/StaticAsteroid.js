import * as THREE from 'three';

class StaticAsteroid{

    constructor(parent) {

        this.parent = parent;
        this.parent.children[0].material.color.set(new THREE.Color("rgb(84, 83, 83)"));
        this.stepY = 0.00016 * Math.random() * 5;
        this.stepX = 0.00016 * Math.random() * 5;

    }

    Update(step) {

        this.parent.children[0].rotateY(Math.PI * 2 * this.stepY );
        this.parent.children[0].rotateX(Math.PI * 2 * this.stepX );

    }

}

export default StaticAsteroid;