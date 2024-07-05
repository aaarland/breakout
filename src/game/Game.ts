import { Ball } from "./Ball";
import { Brick } from "./Brick";
import { Player } from "./Player";

const colors = [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "purple",
    "turquoise",
];
const BRICK_COUNT = 10;

class Score implements Drawable {
    score: number;
    multiplier: number;
    constructor(public game: Game) {
        this.score = 0;
        this.multiplier = 1;
    }
    draw(): void {
        this.game.ctx.font = "32px sans-serif";
        this.game.ctx.fillStyle = "white";
        this.game.ctx.fillText(
            `Score: ${this.score}`,
            20,
            this.game.canvas.height - 80,
        );
    }
    incrementScore(brick: Brick) {
        this.score += brick.score;
    }
    resetMultiplier() {
        this.multiplier = 1;
    }
    addMultiplier() {
        this.multiplier *= 2;
    }
}
export interface Drawable {
    game: Game;
    draw(): void;
}
export class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    player: Player;
    ball: Ball;
    bricks: (Brick | null)[][];
    score: Score;
    constructor() {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        canvas.width = document.body.clientWidth;
        canvas.height = document.body.clientHeight;
        const ctx = canvas.getContext("2d");
        if (ctx === null || canvas === null) throw Error();
        this.canvas = canvas;
        this.ctx = ctx;
        this.player = new Player(this);
        this.ball = new Ball(this);
        this.bricks = [];
        this.fillBricks();
        this.score = new Score(this);
    }

    fillBricks() {
        for (let y = 0; y < colors.length; y++) {
            const color = colors[y];
            this.bricks[y] = [];
            for (let x = 0; x < BRICK_COUNT; x++) {
                this.bricks[y][x] = new Brick(
                    this,
                    x,
                    y,
                    color,
                    this.canvas.width / BRICK_COUNT,
                    100 * (colors.length - y),
                );
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.draw();
        this.ball.draw();
        for (const row of this.bricks) {
            for (const brick of row) {
                brick?.draw();
            }
        }
        this.score.draw();
        this.moveBall();
        this.start();
    }

    moveBall() {
        const ball = this.ball;
        ball.x += ball.vx;
        ball.y += ball.vy;
        if (
            ball.x + ball.vx > this.canvas.width - ball.radius ||
            ball.x + ball.vx < ball.radius
        ) {
            ball.flipX();
        }
        if (ball.y + ball.vy < ball.radius) {
            ball.flipY();
        }
        if (
            ball.y + ball.radius >= this.player.y &&
            ball.x <= this.player.x &&
            ball.x >= this.player.x - this.player.width &&
            ball.vy > 0
        ) {
            const half = this.player.width / 2;
            if (ball.x < this.player.x - half) {
                ball.updateXVelocity("left");
            } else {
                ball.updateXVelocity("right");
            }
            ball.flipY();
            this.score.resetMultiplier();
        } else if (ball.y + ball.vy > this.player.y + 10) {
            ball.reset();
            this.score.resetMultiplier();
        }
        const {cords, nullCount} = this.updateBricks();
        if (nullCount === this.bricks.flat().length) {
                this.fillBricks();
                ball.reset();
                this.score.resetMultiplier();
                return;
        }
        if (cords !== null) {
            const brick = this.bricks[cords.y][cords.x];
            if (brick === null) return;
            ball.flipY();
            const half = brick.width / 2;
            if (ball.x < brick.x * brick.width + half) {
                ball.updateXVelocity("left");
            } else {
                ball.updateXVelocity("right");
            }
            this.score.incrementScore(brick);
            this.score.addMultiplier();
            this.bricks[cords.y][cords.x] = null;
        }
    }
    updateBricks() {
        let nullCount = 0;
        let cords = null;
        for (let y = this.bricks.length - 1; y >= 0; y--) {
            for (let x = this.bricks[y].length - 1; x >= 0; x--) {
                const brick = this.bricks[y][x];
                if (brick === null) {
                    nullCount++;
                    continue;
                }
                if (
                    this.ball.x < brick.x * brick.width + brick.width &&
                    this.ball.x >= brick.x * brick.width &&
                    this.ball.y <= brick.y * brick.height + brick.height
                )
                    cords = { y, x };
            }
        }
        return {cords, nullCount};
    }

    start() {
        window.requestAnimationFrame(this.draw.bind(this));
    }
}
