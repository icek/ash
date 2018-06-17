import { Asteroids } from './Asteroids';

window.addEventListener( 'load', () => {
    let canvas = document.getElementById( 'game' );
    if(!canvas) {
        return;
    }
    let asteroids = new Asteroids( canvas, canvas.clientWidth, canvas.clientHeight );
    asteroids.start();
} );
