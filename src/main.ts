import "./style.css";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

const ctx = canvas.getContext("2d");

if (ctx === null) throw Error();

ctx.fillStyle = "red";
ctx.fillRect(10, 10, 50, 2);

interface Drawable {
    game: Game;
    draw(): void;
}

class Brick implements Drawable {
    height = 20;
    constructor(
        public game: Game,
        public x: number,
        public y: number,
        public color: string,
        public width: number,
    ) { }
    draw(): void {
        const ctx = game.ctx;
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.x * this.width + 2,
            this.y * this.height,
            this.width - 4,
            this.height - 4,
        );
    }
}

class Ball implements Drawable {
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

class Player implements Drawable {
    x: number = 50;
    readonly y: number;
    game: Game;
    readonly width = 50;
    constructor(game: Game) {
        game.canvas.addEventListener("touchmove", (e) => {
            const x = e.touches[0].clientX;
            this.move(x);
        });
        window.addEventListener("keydown", (e) => {
            const direction =
                e.code === "ArrowLeft" ? -1 : e.code === "ArrowRight" ? 1 : 0;
            this.move(this.x + 10 * direction);
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
class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    player: Player;
    ball: Ball;
    bricks: (Brick | null)[][];
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
            ball.x >= this.player.x - this.player.width
        ) {
            ball.flipY();
        } else if (ball.y + ball.vy > this.player.y + 10) {
            ball.reset();
        }
        const cords = this.ballHitBrick();
        if (cords !== null) {
            ball.flipY();
            this.bricks[cords.y][cords.x] = null;
        }
    }
    ballHitBrick() {
        for (let y = 0; y < this.bricks.length; y++) {
            for (let x = 0; x < this.bricks[y].length; x++) {
                const brick = this.bricks[y][x];
                if (brick === null) continue;
                if (
                    this.ball.x < brick.x * brick.width + brick.width &&
                    this.ball.x >= brick.x * brick.width &&
                    this.ball.y <= brick.y * brick.height + brick.height
                )
                    return { y, x };
            }
        }
        return null;
    }

    start() {
        window.requestAnimationFrame(this.draw.bind(this));
    }
}

const game = new Game();

game.start();
