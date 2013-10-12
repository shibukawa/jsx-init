 /**
  * {{& OriginalName }}
  *
  * {{& description }}
  *
  * [sample] This comment is document for class. You can use some HTML tags.
  *
  * @author {{& author }}
  *
  * @see {{& homepage }}
  *
  * License: {{& licensename }}
  */


// This JSX code is written by __gfx__ http://jsdo.it/__gfx__/bullet
// Original JS code is written by  baroque_55 http://jsdo.it/baroque_55/xaOH
import "js.jsx";
import "js/web.jsx";
import "timer.jsx";

class Config {
    static const INVINCIBLE = false;

    static const SIZE     = 5;
    static const MOVE     = 24;
    static const STEP     = 100;
    static const SPEED    = 2;

    static const WIDTH  = 465;
    static const HEIGHT = 465;
}

class _Main {
    static function main(args : string[]) : void {
        var canvas = dom.id("world") as HTMLCanvasElement;
        var cx     = canvas.getContext("2d") as CanvasRenderingContext2D;

        canvas.width  = Config.WIDTH;
        canvas.height = Config.HEIGHT;

        var stage = new Stage(cx);

        canvas.addEventListener("mousemove", (event) -> {
            var e = event as MouseEvent;
            var rect = canvas.getBoundingClientRect();
            stage.mouseX = e.clientX - rect.left;
            stage.mouseY = e.clientY - rect.top;
        });

        dom.id("tweet").addEventListener("click", (e) -> {
            _Main.tweet(stage.score);
        });
        dom.id("retry").addEventListener("click", (e) -> {
            _Main.start(stage);
        });

        _Main.start(stage);
    }

    static function start(stage : Stage) : void {
        dom.id("tweet").style.visibility = "hidden";
        dom.id("retry").style.visibility = "hidden";

        stage.initialize();

        (function tick(elapsed : number) : void {
             if (stage.tick()) {
                 Timer.requestAnimationFrame(tick);
             }
             else {
                 dom.window.setTimeout(() -> {
                     stage.gameOver();
                 }, 100);
             }
        }(9));
    }

    static function tweet(score : number) : void {
        var status = "Score:" + score as string + "pt"
            + " 【" + dom.window.document.title  +  "】 #BulletTornado #jsdoit"
            + " " + dom.window.location.href.replace(/\bjsrun\b/, "jsdo");

        var url = 'http://twitter.com/home?status=' + String.encodeURIComponent(status);
        dom.window.open(url, '_blank');
    }
}

class Util {
    static function toRadian(deg : number) : number {
        return 2 * (deg * (Math.PI / 180));
    }

    static function distance(x : number, y : number, o : number, p : number) : number {
        return Math.sqrt((x-o)*(x-o)+(y-p)*(y-p));
    }

    static function getPattern() : number[] {
        var a = (Math.random() * 4) as int;
        var b = (Math.random() * 4) as int;
        return [a, b];
    }
}

class Stage {
    var x : number;
    var y : number;
    var r : number;

    var bullets : Bullet[];
    var pattern : number[];
    var score : number;
    var num : number;
    var rad : number;
    var mouseX : number;
    var mouseY : number;

    var shownGameOver : boolean;

    var cx : CanvasRenderingContext2D;

    function constructor(cx : CanvasRenderingContext2D) {
        this.initialize();

        this.cx = cx;

        // background
        this.cx.beginPath();
        this.cx.fillStyle = "rgb(0, 0, 0)";
        this.cx.fillRect(0, 0, Config.WIDTH, Config.HEIGHT);
        this.cx.fill();
    }

    function initialize() : void {
        this.x = 0;
        this.x = 0;
        this.r = 0;

        this.bullets = [] : Bullet[];
        this.pattern = [2, 2];
        this.score = 0;
        this.num = 100;
        this.rad = 3;
        this.mouseX = Config.WIDTH / 2;
        this.mouseY = Config.HEIGHT / 4 * 3;

        this.shownGameOver = false;
    }

    function tick() : boolean {
        var living = true;

        // background
        this.cx.fillStyle = "rgba(0, 0, 0, 0.3)";
        this.cx.fillRect(0, 0, Config.WIDTH, Config.HEIGHT);

        // move
        var dx = 2 * Math.cos(Util.toRadian(this.r) * this.pattern[0]);
        var dy = 2 * Math.sin(Util.toRadian(this.r) * this.pattern[1]);
        this.x = Config.WIDTH  / 2 + (dx * Config.MOVE);
        this.y = Config.HEIGHT / 4 + (dy * Config.MOVE);

        // bullet
        for (var j = 0; j < (this.num * 2); j += this.num) {
           this.bullets.push(new Bullet(this.x, this.y, j + this.r, Config.SPEED));
        }
        this.cx.fillStyle   = "rgb(255, 255, 255)";
        this.cx.strokeStyle = "rgb(255, 150, 150)";

        this.bullets.forEach( (b, i) -> {
            b.update();
            this.cx.beginPath();
            this.cx.arc(b.x, b.y, Config.SIZE, 0, Math.PI*2, false);
            this.cx.fill();
            this.cx.stroke();
            if (Config.SIZE > Util.distance(this.mouseX, this.mouseY, b.x, b.y)) {
                living = false;
            } else if (b.x <= 0 || b.y <= 0 || b.x > Config.WIDTH || b.y > Config.HEIGHT) {
                this.bullets.splice(i, 1);
            }
        });

        // player's ship
        this.cx.beginPath();
        this.cx.fillStyle = "rgb(255, 255, 255)";
        this.cx.fillRect(this.mouseX - Config.SIZE/2, this.mouseY - Config.SIZE/2, Config.SIZE, Config.SIZE);
        this.cx.fill();

        // score
        this.cx.beginPath();
        this.cx.fillStyle = "rgb(255, 255, 255)";
        this.cx.font = "12px Tahoma,sans-serif";
        this.cx.fillText("Score : " + this.score as string + " pt", 2, 12);
        this.cx.fill();

        // update
        this.r += this.rad;
        this.score++;

        // change the pattern
        if (this.score % Config.STEP == 0) {
            this.pattern = Util.getPattern();
            this.num -= (this.num <= 80)  ? 0 : Math.random() * 10;
            this.rad -= (this.rad <= 1.8) ? 0 : Math.random() * 0.3;
        }

        if (Config.INVINCIBLE) {
            return true;
        }

        return living;
    }

    function gameOver() : void {
        if (this.shownGameOver) {
            return;
        }
        this.shownGameOver = false;

        // background
        this.cx.beginPath();
        this.cx.clearRect(0, 0, Config.WIDTH, Config.HEIGHT);
        this.cx.fillStyle = "rgb(0, 0, 0)";
        this.cx.fillRect(0, 0, Config.WIDTH, Config.HEIGHT);
        this.cx.fill();

        // score
        this.cx.beginPath();
        this.cx.fillStyle = "rgb(255, 255, 255)";
        this.cx.font = "18px Tahoma,sans-serif";
        this.cx.textAlign = "center";
        this.cx.fillText("Score : " + this.score as string + " pt", Config.WIDTH/2, Config.HEIGHT/4);
        this.cx.fill();

        // buttons
        var btn_t = dom.id("tweet");
        var btn_c = dom.id("retry");
        btn_c.style.visibility = btn_t.style.visibility = "visible";
        btn_c.style.width = btn_t.style.width = "200px";
        btn_c.style.left = btn_t.style.left = (((Config.WIDTH - 200) / 2) as int) as string + "px";
        btn_t.style.top = ((Config.HEIGHT/4 + 100) as int) as string + "px";
        btn_c.style.top = ((Config.HEIGHT/4 + 160) as int) as string + "px";
    }
}

class Bullet {
    var x : number;
    var y : number;
    var r : number;
    var s : number;

    function constructor(x : number, y : number, r : number, s : number) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.s = s;
    }

    function update() : void {
        this.x += Math.cos(Util.toRadian(this.r)) * this.s;
        this.y += Math.sin(Util.toRadian(this.r)) * this.s;
    }
}

