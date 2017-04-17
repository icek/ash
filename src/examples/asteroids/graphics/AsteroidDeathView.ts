import { Animatable } from "./Animatable";
import { SVGView } from "./SVGView";

export class AsteroidDeathView extends SVGView implements Animatable {

    private static numDots:number = 8;

    private dots:Dot[] = [];

    constructor( private radius:number ) {
        super( 1, 1 );

        for( let i:number = 0, len = AsteroidDeathView.numDots; i < len; ++i ) {
            let dot:Dot = new Dot( radius );
            this.addChild( dot );
            this.dots.push( dot );
        }
    }

    public animate( time:number ):void {
        for( let dot of this.dots ) {
            dot.setTransform(
                dot.x + dot.velocityX * time,
                dot.y + dot.velocityY * time
            );
        }
    }
}


class Dot extends SVGView {
    public velocityX:number;
    public velocityY:number;

    constructor( private maxDistance:number ) {
        super( 2, 2 );

        let angle:number = Math.random() * 2 * Math.PI;
        let distance:number = Math.random() * maxDistance;
        let speed:number = Math.random() * 10 + 10;
        this.velocityX = Math.cos( angle ) * speed;
        this.velocityY = Math.sin( angle ) * speed;

        this.setContent( '<circle fill="#fff" cx="1" cy="1" r="1"/>' )
            .setTransform(
                Math.cos( angle ) * distance,
                Math.sin( angle ) * distance
            );
    }
}
