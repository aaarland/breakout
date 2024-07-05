import { Drawable, Game } from "./Game";

export class Ball implements Drawable {
    game: Game;
    x: number;
    y: number;
    radius = 5;
    vx: number;
    vy: number;
    constructor(game: Game) {
        this.game = game;
        this.x = game.canvas.width / 2;
        this.y = game.canvas.height / 2;
        this.vx = 0;
        this.vy = 5;
    }
    reset() {
        this.x = this.game.canvas.width / 2;
        this.vx = 0;
        this.y = this.game.canvas.height / 2;
    }
    draw(): void {
        const ctx = this.game.ctx;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fillStyle = "white";
        ctx.fill();
    }

    flipY() {
        this.vy = -this.vy;
    }

    flipX() {
        this.vx = -this.vx;
    }
    updateXVelocity(barSide: 'left' | 'right') {
        const amount = Math.random() * 5;
        let direction = this.vx > 0 ? 1 : -1;
        if(this.vx === 0) {
            direction = barSide === 'left' ? -1 : 1;
        }
        this.vx = amount * direction;
    }
}
