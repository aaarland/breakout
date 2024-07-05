import { Drawable, Game } from "./Game";

export class Brick implements Drawable {
    height = 20;
    constructor(
        public game: Game,
        public x: number,
        public y: number,
        public color: string,
        public width: number,
    ) { }
    draw(): void {
        const ctx = this.game.ctx;
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.x * this.width + 2,
            this.y * this.height,
            this.width - 4,
            this.height - 4,
        );
    }
}
