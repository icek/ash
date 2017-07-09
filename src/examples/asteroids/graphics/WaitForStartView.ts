import { SVGView } from './SVGView';
import { Signal0 } from '../ash';

export class WaitForStartView extends SVGView
{
    private gameOver:SVGView;
    private clickToStart:SVGView;

    public click:Signal0 = new Signal0();

    constructor()
    {
        super( 400, 300 );

        // GAME OVER
        this.gameOver = new SVGView( 400, 150 )
            .setContent( '<text class="h1">ASTEROIDS</text>' )
            .setTransform( 0, -50, 0 );

        this.addChild( this.gameOver );

        this.clickToStart = new SVGView( 400, 150 )
            .setContent( '<text class="h2">Click to start</text>' )
            .setTransform( 0, 50, 0 );

        this.addChild( this.clickToStart );

        // EVENTS
        this.element.addEventListener( 'DOMNodeInsertedIntoDocument', this.addClickListener );
        this.element.addEventListener( 'DOMNodeRemovedFromDocument', this.removeClickListener );
    }

    private dispatchClick = () => {
        this.click.dispatch();
    };

    private addClickListener = () => {
        window.addEventListener( 'click', this.dispatchClick );
    };

    private removeClickListener = () => {
        window.removeEventListener( 'click', this.dispatchClick );
        this.gameOver.setContent( '<text class="h1">GAME OVER</text>' );
    };

}
