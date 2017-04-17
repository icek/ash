import { Asteroids } from "./Asteroids";

window.addEventListener( 'load', () => {
    let canvas = document.getElementById('game');
    let asteroids = new Asteroids( canvas, canvas.clientWidth, canvas.clientHeight );
    asteroids.start();
} );
