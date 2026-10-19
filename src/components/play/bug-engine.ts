import { pentatonic, playBell, playThud, playTick } from "@/lib/sound";

/** The playing field, in its own units; it's scaled to fit the canvas. */
const W = 800;
const H = 560;
const PADDLE_W = 112;
const PADDLE_H = 14;
const PADDLE_Y = H - 46;
const BALL_R = 7;
const COLS = 10;
const ROWS = 5;
const GAP = 6;
const SIDE = 28;
const TOP = 64;
const BRICK_H = 26;
const LIVES = 3;
// Kept short so they fit a brick at any size.
const LABELS = ["NaN", "404", "null", "500", "CORS", "undefined", "TypeError", "timeout", "leak", "stale", "race", "403", "typo", "flaky"];

type Brick = { x: number; y: number; w: number; h: number; hp: number; tough: boolean; row: number; label: string; hitAt: number };
type Spark = { x: number; y: number; vx: number; vy: number; life: number; color: string };
export type BugState = "ready" | "serve" | "play" | "paused" | "clear" | "over";

export type BugEvents = {
  onStats: (score: number, lives: number, level: number) => void;
  onState: (state: BugState) => void;
  onOver: (score: number, level: number) => void;
};

export type BugTheme = { colors: string[]; ink: string; line: string; textOnBrick: string };

/**
 * Bug Smash: a breakout game on a canvas. The loop runs only while there's
 * something to move, and the ball is stepped in small slices so it can't
 * tunnel through a brick at speed.
 */
export function createBugEngine(canvas: HTMLCanvasElement, events: BugEvents, reduced: boolean) {
  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let dpr = 1;
  let theme: BugTheme = { colors: ["#2f62f0", "#0a907f", "#c47a0f", "#d63c72", "#7a4ce6"], ink: "#0b1324", line: "rgb(0 0 0 / 0.1)", textOnBrick: "#ffffff" };

  let state: BugState = "ready";
  let score = 0;
  let lives = LIVES;
  let level = 1;
  let paddleX = W / 2;
  let target: number | null = null;
  let keyDir = 0;
  const ball = { x: W / 2, y: PADDLE_Y - BALL_R - 1, vx: 0, vy: 0, speed: 0 };
  let trail: { x: number; y: number }[] = [];
  let bricks: Brick[] = [];
  let sparks: Spark[] = [];
  let clearTimer = 0;
  let raf = 0;
  let last = 0;

  function build() {
    bricks = [];
    const w = (W - SIDE * 2 - GAP * (COLS - 1)) / COLS;
    const toughChance = Math.min(0.45, 0.06 + level * 0.07);
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const tough = Math.random() < toughChance;
        bricks.push({
          x: SIDE + col * (w + GAP),
          y: TOP + row * (BRICK_H + GAP),
          w,
          h: BRICK_H,
          hp: tough ? 2 : 1,
          tough,
          row,
          label: LABELS[Math.floor(Math.random() * LABELS.length)],
          hitAt: -1e9,
        });
      }
    }
  }

  function serve() {
    ball.x = paddleX;
    ball.y = PADDLE_Y - BALL_R - 1;
    ball.vx = 0;
    ball.vy = 0;
    trail = [];
    setState("serve");
  }

  function launch() {
    ball.speed = Math.min(380 + (level - 1) * 45, 640);
    const angle = (Math.random() * 0.7 - 0.35) * (Math.PI / 4);
    ball.vx = Math.sin(angle) * ball.speed;
    ball.vy = -Math.cos(angle) * ball.speed;
    setState("play");
  }

  function setState(next: BugState) {
    state = next;
    events.onState(next);
    wake();
  }

  function stats() {
    events.onStats(score, lives, level);
  }

  function spark(x: number, y: number, color: string) {
    if (reduced) return;
    for (let i = 0; i < 8; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = 60 + Math.random() * 140;
      sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1, color });
    }
  }

  function hitBrick(brick: Brick) {
    brick.hp -= 1;
    brick.hitAt = performance.now();
    const color = theme.colors[brick.row % theme.colors.length];
    if (brick.hp <= 0) {
      score += brick.tough ? 25 : 10;
      spark(brick.x + brick.w / 2, brick.y + brick.h / 2, color);
      playBell(pentatonic(ROWS - brick.row + 3), 0.07, 0.5);
    } else {
      score += 5;
      playTick();
    }
    stats();
  }

  function moveBall(h: number) {
    ball.x += ball.vx * h;
    ball.y += ball.vy * h;

    if (ball.x < BALL_R) {
      ball.x = BALL_R;
      ball.vx = Math.abs(ball.vx);
    } else if (ball.x > W - BALL_R) {
      ball.x = W - BALL_R;
      ball.vx = -Math.abs(ball.vx);
    }
    if (ball.y < BALL_R) {
      ball.y = BALL_R;
      ball.vy = Math.abs(ball.vy);
    }

    // The paddle: where it's hit decides the angle, up to 62° either side.
    if (ball.vy > 0 && ball.y + BALL_R >= PADDLE_Y && ball.y - BALL_R <= PADDLE_Y + PADDLE_H && Math.abs(ball.x - paddleX) <= PADDLE_W / 2 + BALL_R) {
      const hit = Math.max(-1, Math.min(1, (ball.x - paddleX) / (PADDLE_W / 2)));
      const angle = hit * (62 * Math.PI) / 180;
      ball.vx = Math.sin(angle) * ball.speed;
      ball.vy = -Math.cos(angle) * ball.speed;
      ball.y = PADDLE_Y - BALL_R;
      playTick();
      return;
    }

    for (const brick of bricks) {
      if (brick.hp <= 0) continue;
      const cx = Math.max(brick.x, Math.min(ball.x, brick.x + brick.w));
      const cy = Math.max(brick.y, Math.min(ball.y, brick.y + brick.h));
      const dx = ball.x - cx;
      const dy = ball.y - cy;
      if (dx * dx + dy * dy > BALL_R * BALL_R) continue;
      // Bounce off the side that was hit, and step back out of the brick.
      if (Math.abs(dx) > Math.abs(dy)) {
        ball.vx = Math.sign(dx || -ball.vx) * Math.abs(ball.vx);
        ball.x = cx + Math.sign(dx || -ball.vx) * BALL_R;
      } else {
        ball.vy = Math.sign(dy || -ball.vy) * Math.abs(ball.vy);
        ball.y = cy + Math.sign(dy || -ball.vy) * BALL_R;
      }
      hitBrick(brick);
      break;
    }
  }

  function frame(now: number) {
    const dt = last ? Math.min(1 / 30, (now - last) / 1000) : 1 / 60;
    last = now;

    if (state !== "paused" && state !== "over" && state !== "ready") {
      if (keyDir) paddleX += keyDir * 760 * dt;
      else if (target !== null) paddleX += (target - paddleX) * Math.min(1, dt * 24);
      paddleX = Math.max(PADDLE_W / 2, Math.min(W - PADDLE_W / 2, paddleX));
    }

    if (state === "serve") {
      ball.x = paddleX;
      ball.y = PADDLE_Y - BALL_R - 1;
    } else if (state === "play") {
      const slices = Math.max(1, Math.ceil((ball.speed * dt) / 4));
      for (let i = 0; i < slices && state === "play"; i++) {
        moveBall(dt / slices);
        if (ball.y - BALL_R > H) {
          lives -= 1;
          playThud();
          stats();
          if (lives <= 0) {
            setState("over");
            events.onOver(score, level);
          } else {
            serve();
          }
        }
      }
      trail = [{ x: ball.x, y: ball.y }, ...trail].slice(0, reduced ? 0 : 6);
      if (state === "play" && bricks.every((brick) => brick.hp <= 0)) {
        score += 100 * level;
        stats();
        [0, 2, 4].forEach((step, i) => window.setTimeout(() => playBell(pentatonic(5 + step), 0.16, 1.2), i * 110));
        clearTimer = 1.3;
        setState("clear");
      }
    } else if (state === "clear") {
      clearTimer -= dt;
      if (clearTimer <= 0) {
        level += 1;
        build();
        stats();
        serve();
      }
    }

    sparks = sparks
      .map((s) => ({ ...s, x: s.x + s.vx * dt, y: s.y + s.vy * dt, vy: s.vy + 420 * dt, life: s.life - dt * 1.6 }))
      .filter((s) => s.life > 0);

    draw(now);

    const moving = state === "serve" || state === "play" || state === "clear" || sparks.length > 0;
    if (!moving) {
      raf = 0;
      last = 0;
      return;
    }
    raf = requestAnimationFrame(frame);
  }

  function wake() {
    if (!raf) raf = requestAnimationFrame(frame);
  }

  function roundRect(x: number, y: number, w: number, h: number, r: number) {
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function draw(now = performance.now()) {
    if (!ctx || !width) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    const s = Math.min(width / W, height / H);
    const ox = (width - W * s) / 2;
    const oy = (height - H * s) / 2;
    ctx.setTransform(dpr * s, 0, 0, dpr * s, dpr * ox, dpr * oy);

    // The field.
    ctx.strokeStyle = theme.line;
    ctx.lineWidth = 1 / s;
    roundRect(0.5, 0.5, W - 1, H - 1, 14);
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `500 11px ui-monospace, "Fragment Mono", monospace`;
    for (const brick of bricks) {
      if (brick.hp <= 0) continue;
      const color = theme.colors[brick.row % theme.colors.length];
      const flash = now - brick.hitAt < 110;
      ctx.globalAlpha = flash ? 0.55 : 1;
      roundRect(brick.x, brick.y, brick.w, brick.h, 6);
      ctx.fillStyle = color;
      ctx.fill();
      if (brick.hp > 1) {
        // Tough bugs wear an inner frame until their first hit.
        ctx.strokeStyle = theme.textOnBrick;
        ctx.globalAlpha = 0.7;
        ctx.lineWidth = 1.5;
        roundRect(brick.x + 3, brick.y + 3, brick.w - 6, brick.h - 6, 4);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = theme.textOnBrick;
      ctx.fillText(brick.label, brick.x + brick.w / 2, brick.y + brick.h / 2 + 0.5, brick.w - 8);
    }

    for (const s2 of sparks) {
      ctx.globalAlpha = Math.max(0, s2.life);
      ctx.fillStyle = s2.color;
      ctx.fillRect(s2.x - 2, s2.y - 2, 4, 4);
    }
    ctx.globalAlpha = 1;

    // Paddle and ball.
    ctx.fillStyle = theme.ink;
    roundRect(paddleX - PADDLE_W / 2, PADDLE_Y, PADDLE_W, PADDLE_H, PADDLE_H / 2);
    ctx.fill();
    trail.forEach((point, i) => {
      ctx.globalAlpha = 0.18 * (1 - i / trail.length);
      ctx.beginPath();
      ctx.arc(point.x, point.y, BALL_R * (1 - i * 0.08), 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    if (state !== "over") {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function toField(clientX: number) {
    const rect = canvas.getBoundingClientRect();
    const s = Math.min(rect.width / W, rect.height / H);
    const ox = (rect.width - W * s) / 2;
    return (clientX - rect.left - ox) / s;
  }

  return {
    /** Start, launch, pause or resume, depending on where the game is. */
    action() {
      if (state === "ready" || state === "over") {
        score = 0;
        lives = LIVES;
        level = 1;
        build();
        stats();
        serve();
      } else if (state === "serve") launch();
      else if (state === "play") setState("paused");
      else if (state === "paused") {
        last = 0;
        setState("play");
      }
    },
    pause() {
      if (state === "play") setState("paused");
    },
    pointer(clientX: number) {
      target = toField(clientX);
      wake();
    },
    key(direction: number) {
      keyDir = direction;
      if (direction) wake();
    },
    resize(nextWidth: number, nextHeight: number, nextDpr: number) {
      width = nextWidth;
      height = nextHeight;
      dpr = nextDpr;
      canvas.width = Math.round(nextWidth * nextDpr);
      canvas.height = Math.round(nextHeight * nextDpr);
      if (!bricks.length) build();
      draw();
    },
    setTheme(next: BugTheme) {
      theme = next;
      draw();
    },
    destroy() {
      cancelAnimationFrame(raf);
      raf = 0;
    },
  };
}

export type BugEngine = ReturnType<typeof createBugEngine>;
