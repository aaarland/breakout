import { Drawable, Game } from "./Game";

export class Ball implements Drawable {
    game: Game;
    x: number;
    y: number;
    radius = 5;
    vx = 5;
    vy = 5;
    constructor(game: Game) {
        this.game = game;
        this.x = game.canvas.width / 2;
        this.y = game.canvas.height / 2;
    }
    reset() {
        this.x = this.game.canvas.width / 2;
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
}
