export class SVGView {

    public element:SVGElement;

    public x:number = 0;
    public y:number = 0;
    public r:number = 0;

    constructor( width:number = 100, height:number = 100 ) {
        this.element = document.createElementNS( 'http://www.w3.org/2000/svg', 'g' );
        let { style } = this.element;
        // style.position = 'absolute';
        // this.setAttribute( 'width', `${width}` )
        //     .setAttribute( 'height', `${height}` )
        //     .setAttribute( 'padding-left', `${-width/2}` )
        //     .setAttribute( 'y', `${-height/2}` )
            // .setAttribute('transform-origin', `${width / 2} ${height / 2}`);
        // style.position = 'absolute';
        // style.left = `-${width / 2}px`;
        // style.top = `-${height / 2}px`;
        // style.width = `${width}px`;
        // style.height = `${height}px`;
        // style.transformOrigin = `${width / 2}px ${height / 2}px`;
    }

    public setTransform( x:number = 0, y:number = 0, r:number = 0 ):this {
        this.x = x;
        this.y = y;
        this.r = r;
        return this.setAttribute( 'transform', `translate(${x}, ${y}) rotate(${r * 180 / Math.PI})` );
        // return this;
    }

    public setContent( content:string ):this {
        // let doc = new DOMParser().parseFromString( content, 'text/xml' );

        // this.element.appendChild( this.element.ownerDocument.importNode( doc.documentElement, true ) );

        this.element.innerHTML = content;
        return this;
    }

    public setAttribute( key:string, value:string ):this {
        this.element.setAttribute( key, value );
        return this;
    }

    public addChild( child:SVGView ) {
        this.element.appendChild( child.element );
    }

    public removeChild( child:SVGView ) {
        this.element.removeChild( child.element );
    }
}
