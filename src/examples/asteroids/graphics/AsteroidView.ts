import { SVGView } from './SVGView';

export class AsteroidView extends SVGView
{
    constructor( radius:number )
    {
        super( radius * 2, radius * 2 );

        let p = '';
        let angle:number = 0;

        p += `M${radius} 0`;
        while( angle < Math.PI * 2 )
        {
            let length:number = ( 0.75 + Math.random() * 0.25 ) * radius;
            let posX:number = Math.cos( angle ) * length;
            let posY:number = Math.sin( angle ) * length;
            p += `L${posX} ${posY} `;
            angle += Math.random() * 0.5;
        }
        p += `L${radius} 0`;

        this.setContent( `<path d="${p}" fill="#fff"/>` );
    }
}
