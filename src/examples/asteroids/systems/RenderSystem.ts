import { Engine, NodeList, System } from 'ash';
import { RenderNode } from '../nodes';
import { Display, Position } from '../components';
import { SVGView } from '../graphics';

export class RenderSystem extends System
{
    private nodes!:NodeList<RenderNode> | null;

    constructor( public container:HTMLElement )
    {
        super();
        this.container = container;
    }

    public addToEngine( engine:Engine ):void
    {
        this.nodes = engine.getNodeList( RenderNode );
        for( let node:RenderNode | null = this.nodes.head; node; node = node.next )
        {
            this.addToDisplay( node );
        }
        this.nodes.nodeAdded.add( this.addToDisplay );
        this.nodes.nodeRemoved.add( this.removeFromDisplay );
    }

    private addToDisplay = ( node:RenderNode ) => {
        this.container.appendChild( node.display.displayObject.element );
    };

    private removeFromDisplay = ( node:RenderNode ) => {
        this.container.removeChild( node.display.displayObject.element );
    };

    public update( time:number ):void
    {
        let node:RenderNode | null;
        let position:Position;
        let display:Display;
        let displayObject:SVGView;

        if(!this.nodes) {
            return;
        }
        for( node = this.nodes.head; node; node = node.next )
        {
            display = node.display;
            displayObject = display.displayObject;
            position = node.position;
            displayObject.setTransform( position.x, position.y, position.rotation );
        }
    }

    public removeFromEngine( engine:Engine ):void
    {
        this.nodes = null;
    }

}
