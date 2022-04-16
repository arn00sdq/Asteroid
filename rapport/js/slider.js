function slideEarth(){

    let slideValue = document.getElementById("sliderEarth").value;
    document.getElementById("earth").style.clipPath = "polygon(0 0," + slideValue + "% 0," + slideValue + "% 100%, 0 100%)";

}

function slideSun(){

    let slideValue = document.getElementById("sliderSun").value;
    document.getElementById("sun").style.clipPath = "polygon(0 0," + slideValue + "% 0," + slideValue + "% 100%, 0 100%)";

}

function sliderCoin(){

    let slideValue = document.getElementById("sliderCoin").value;
    document.getElementById("coin").style.clipPath = "polygon(0 0," + slideValue + "% 0," + slideValue + "% 100%, 0 100%)";

}

function sliderEarthFX(){

    let slideValue = document.getElementById("sliderEarthFX").value;
    document.getElementById("fx").style.clipPath = "polygon(0 0," + slideValue + "% 0," + slideValue + "% 100%, 0 100%)";

}