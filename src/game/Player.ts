import { Drawable, Game } from "./Game";

export class Player implements Drawable {
    x: number;
    readonly y: number;
    game: Game;
    readonly width = 50;
    constructor(game: Game) {
        this.x = game.canvas.width / 2;
        game.canvas.addEventListener("touchmove", (e) => {
            const x = e.touches[0].clientX;
            this.move(x);
        });
        window.addEventListener("keydown", (e) => {
            const direction =
                e.code === "ArrowLeft" ? -1 : e.code === "ArrowRight" ? 1 : 0;
            this.move(this.x + 40 * direction);
        });
        this.game = game;
        this.y = this.game.canvas.height - this.game.canvas.height / 4;
    }
    move(x: number) {
        this.x = x;
    }

    draw() {
        this.game.ctx.fillStyle = "red";
        this.game.ctx.fillRect(this.x - this.width, this.y, this.width, 5);
    }
}
