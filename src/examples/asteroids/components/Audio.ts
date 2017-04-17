import { Sounds } from "../Sounds";

export class Audio {
    public toPlay:Sounds[] = [];

    public play( sound:Sounds ):void {
        this.toPlay.push( sound );
    }
}

