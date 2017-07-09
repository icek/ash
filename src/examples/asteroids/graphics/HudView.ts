import { SVGView } from './SVGView';

export class HudView extends SVGView
{
    private score:SVGView;
    private lives:SVGView;

    constructor()
    {
        super( 800, 50 );
        this.setTransform( 400, 50 );


        this.score = new SVGView( 200, 50 )
            .setTransform( -200, 0 );

        this.addChild( this.score );

        this.lives = new SVGView( 200, 50 )
            .setTransform( 200, 0 );
        this.addChild( this.lives );

        this.setScore( 0 );
        this.setLives( 3 );
    }

    public setScore( value:number ):void
    {
        this.score.setContent( `<text>SCORE: ${value}</text>` );
    }

    public setLives( value:number ):void
    {
        this.lives.setContent( `<text>LIVES: ${value}</text>` );
    }
}
