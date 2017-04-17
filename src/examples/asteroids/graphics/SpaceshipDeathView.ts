import { Animatable } from "./Animatable";
import { SVGView } from "./SVGView";
export class SpaceshipDeathView extends SVGView implements Animatable {
    private shape1:SVGView;
    private shape2:SVGView;
    private vel1x:number;
    private vel1y:number;
    private vel2x:number;
    private vel2y:number;
    private rot1:number;
    private rot2:number;

    constructor() {
        super( 20, 20 );

        this.shape1 = new SVGView( 20, 20 ).setContent( '<path d="M10 0 L-7 7 L-4 0 L10 0" fill="#fff"/>' );
        this.addChild( this.shape1 );

        this.shape2 = new SVGView( 20, 20 ).setContent( '<path d="M10 0 L-7 -7 L-4 0 L10 0" fill="#fff"/>' );
        this.addChild( this.shape2 );

        this.vel1x = Math.random() * 10 - 5;
        this.vel1y = Math.random() * 10 + 10;
        this.vel2x = Math.random() * 10 - 5;
        this.vel2y = Math.random() * -10 - 10;
        this.rot1 = Math.random() * 3 - 1.5;
        this.rot2 = Math.random() * 3 - 1.5;
    }

    public animate( time:number ):void {
        let { shape1, shape2 } = this;
        shape1.setTransform( shape1.x + this.vel1x * time, shape1.y + this.vel1y * time, shape1.r + this.rot1 * time );
        shape2.setTransform( shape2.x + this.vel2x * time, shape2.y + this.vel2y * time, shape2.r + this.rot2 * time );
    }
}
