import { SVGView } from "./SVGView";

export class SpaceshipView extends SVGView {
    constructor() {
        super( 20, 20 );
        this.setContent('<path d="M10 0 L-7 7 L-4 0 L-7 -7 L10 0" fill="#fff"/>');
    }
}
