import { pentatonic, playBell, playThud, playTick } from "@/lib/sound";

type Box = { x0: number; x1: number; z0: number; z1: number; y: number; color: number };
type Moving = Box & { axis: "x" | "z"; offset: number; dir: 1 | -1; speed: number };
type Piece = Box & { vy: number; drift: number; axis: "x" | "z"; alpha: number; behind: boolean };
export type StackStatus = "ready" | "playing" | "over";

export type StackEvents = {
  onPlace: (layers: number, streak: number) => void;
  onStatus: (status: StackStatus) => void;
  onOver: (layers: number) => void;
};

const SLAB = 0.2; // slab thickness in world units; a slab starts 1 unit wide
const PERFECT = 0.03; // how close counts as a perfect drop
const TRAVEL = 1.45; // how far the moving slab swings out each way
const PEDESTAL = 0.55;
const C30 = Math.cos(Math.PI / 6);
const BASE: Box = { x0: -0.5, x1: 0.5, z0: -0.5, z1: 0.5, y: 0, color: 0 };

function shade(hex: string, amount: number) {
  const value = parseInt(hex.replace("#", ""), 16);
  const f = 1 - amount;
  return `rgb(${Math.round(((value >> 16) & 255) * f)} ${Math.round(((value >> 8) & 255) * f)} ${Math.round((value & 255) * f)})`;
}

function span(box: Box, axis: "x" | "z"): [number, number] {
  return axis === "x" ? [box.x0, box.x1] : [box.z0, box.z1];
}

function withSpan<T extends Box>(box: T, axis: "x" | "z", lo: number, hi: number): T {
  return axis === "x" ? { ...box, x0: lo, x1: hi } : { ...box, z0: lo, z1: hi };
}

/**
 * The stacking game itself, kept outside React: a canvas, a loop that only
 * runs while something moves, and three callbacks for the score display.
 */
export function createStackEngine(canvas: HTMLCanvasElement, events: StackEvents, reduced: boolean) {
  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let colors = ["#2f62f0", "#0a907f", "#c47a0f", "#d63c72", "#7a4ce6"];
  let pedestal = "#8d9097";
  let stack: Box[] = [BASE];
  let current: Moving | null = null;
  let pieces: Piece[] = [];
  let flashes: { box: Box; t: number }[] = [];
  let camY = 0;
  let camTarget = 0;
  let zoom = 1;
  let zoomTarget = 1;
  let status: StackStatus = "ready";
  let combo = 0;
  let raf = 0;
  let last = 0;

  // Slabs grow with the board, up to a size that still leaves room to stack.
  const baseScale = () => Math.min(width * 0.25, height * 0.3, 200);

  function draw() {
    if (!ctx || !width) return;
    ctx.clearRect(0, 0, width, height);
    const scale = baseScale() * zoom;
    const baseY = height * 0.66;
    const project = (x: number, y: number, z: number): [number, number] => [
      width / 2 + (x - z) * C30 * scale,
      baseY + (x + z) * 0.5 * scale - (y - camY) * scale,
    ];
    const poly = (points: [number, number][], fill: string) => {
      ctx.beginPath();
      points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
    };
    const box = (b: Box, top: number, bottom: number, color: string, alpha = 1) => {
      ctx.globalAlpha = alpha;
      poly([project(b.x0, top, b.z1), project(b.x1, top, b.z1), project(b.x1, bottom, b.z1), project(b.x0, bottom, b.z1)], shade(color, 0.2));
      poly([project(b.x1, top, b.z0), project(b.x1, top, b.z1), project(b.x1, bottom, b.z1), project(b.x1, bottom, b.z0)], shade(color, 0.38));
      const face: [number, number][] = [project(b.x0, top, b.z0), project(b.x1, top, b.z0), project(b.x1, top, b.z1), project(b.x0, top, b.z1)];
      poly(face, color);
      // A thin highlight along the two back edges of the top face.
      ctx.strokeStyle = "rgb(255 255 255 / 0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(face[3][0], face[3][1]);
      ctx.lineTo(face[0][0], face[0][1]);
      ctx.lineTo(face[1][0], face[1][1]);
      ctx.stroke();
      ctx.globalAlpha = 1;
    };
    const colorOf = (b: Box) => colors[b.color % colors.length];

    const [sx, sy] = project(0, -PEDESTAL, 0);
    const cy = sy + scale * 0.35;
    const shadow = ctx.createRadialGradient(sx, cy, 0, sx, cy, scale * 1.1);
    shadow.addColorStop(0, "rgb(0 0 0 / 0.16)");
    shadow.addColorStop(1, "rgb(0 0 0 / 0)");
    ctx.fillStyle = shadow;
    ctx.beginPath();
    ctx.ellipse(sx, cy, scale * 1.1, scale * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    for (const piece of pieces) if (piece.behind) box(piece, piece.y + SLAB, piece.y, colorOf(piece), piece.alpha);
    box(BASE, 0, -PEDESTAL, pedestal);
    for (const b of stack) box(b, b.y + SLAB, b.y, colorOf(b));
    if (current && status === "playing") box(current, current.y + SLAB, current.y, colorOf(current));
    for (const piece of pieces) if (!piece.behind) box(piece, piece.y + SLAB, piece.y, colorOf(piece), piece.alpha);

    // A ring that spreads out from a perfect drop.
    for (const flash of flashes) {
      const grow = flash.t * 0.18;
      const b = flash.box;
      const top = b.y + SLAB;
      const ring = [
        project(b.x0 - grow, top, b.z0 - grow),
        project(b.x1 + grow, top, b.z0 - grow),
        project(b.x1 + grow, top, b.z1 + grow),
        project(b.x0 - grow, top, b.z1 + grow),
      ];
      ctx.globalAlpha = 1 - flash.t;
      ctx.strokeStyle = colorOf(b);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ring.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.closePath();
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  function frame(now: number) {
    const dt = last ? Math.min(1 / 30, (now - last) / 1000) : 1 / 60;
    last = now;

    if (status === "playing" && current) {
      current.offset += current.dir * current.speed * dt;
      if (current.offset > TRAVEL) current.dir = -1;
      if (current.offset < -TRAVEL) current.dir = 1;
      const [lo, hi] = span(stack[stack.length - 1], current.axis);
      current = withSpan(current, current.axis, lo + current.offset, hi + current.offset);
    }

    pieces = pieces
      .map((piece) => {
        const vy = piece.vy - 5.5 * dt;
        const [lo, hi] = span(piece, piece.axis);
        const moved = withSpan(piece, piece.axis, lo + piece.drift * dt, hi + piece.drift * dt);
        const y = piece.y + vy * dt;
        const alpha = y < camY - 1.2 ? Math.max(0, piece.alpha - dt * 2.5) : piece.alpha;
        return { ...moved, vy, y, alpha };
      })
      .filter((piece) => piece.alpha > 0);
    flashes = flashes.map((flash) => ({ ...flash, t: flash.t + dt * 1.8 })).filter((flash) => flash.t < 1);

    const ease = 1 - Math.exp(-dt * (reduced ? 30 : 5));
    camY += (camTarget - camY) * ease;
    zoom += (zoomTarget - zoom) * ease;

    draw();

    const settled =
      status !== "playing" && !pieces.length && !flashes.length && Math.abs(camTarget - camY) < 0.001 && Math.abs(zoomTarget - zoom) < 0.001;
    if (settled) {
      raf = 0;
      last = 0;
      return;
    }
    raf = requestAnimationFrame(frame);
  }

  function wake() {
    if (!raf) raf = requestAnimationFrame(frame);
  }

  function spawn() {
    const top = stack[stack.length - 1];
    const level = stack.length;
    current = {
      ...top,
      y: level * SLAB,
      color: level % colors.length,
      axis: level % 2 ? "x" : "z",
      offset: -TRAVEL,
      dir: 1,
      speed: Math.min(1.2 + level * 0.035, 3),
    };
  }

  function start() {
    stack = [BASE];
    pieces = [];
    flashes = [];
    combo = 0;
    camTarget = 0;
    zoomTarget = 1;
    status = "playing";
    spawn();
    events.onStatus(status);
    events.onPlace(0, 0);
    wake();
  }

  function end() {
    status = "over";
    current = null;
    // Pull back until the whole tower is in view.
    const towerHeight = stack.length * SLAB + PEDESTAL;
    zoomTarget = Math.min(1, (height * 0.5) / (towerHeight * baseScale()));
    camTarget = 0;
    playThud();
    events.onStatus(status);
    events.onOver(stack.length - 1);
    wake();
  }

  function drop() {
    if (status !== "playing" || !current) return;
    const c = current;
    const top = stack[stack.length - 1];
    const [a0, a1] = span(c, c.axis);
    const [b0, b1] = span(top, c.axis);
    const delta = (a0 + a1) / 2 - (b0 + b1) / 2;
    let placed: Box;

    if (Math.abs(delta) < PERFECT) {
      combo += 1;
      placed = withSpan(c, c.axis, b0, b1);
      // A run of perfect drops wins a little width back.
      if (combo >= 3) {
        for (const axis of ["x", "z"] as const) {
          const [lo, hi] = span(placed, axis);
          const room = Math.min(0.02, Math.max(0, 1 - (hi - lo)) / 2);
          placed = withSpan(placed, axis, lo - room, hi + room);
        }
      }
      flashes.push({ box: placed, t: 0 });
      playBell(pentatonic(Math.min(combo + 2, 12)), 0.2, 1.8);
    } else {
      const lo = Math.max(a0, b0);
      const hi = Math.min(a1, b1);
      if (hi <= lo) {
        pieces.push({ ...c, vy: 0, drift: Math.sign(delta) * 0.3, alpha: 1, behind: delta < 0 });
        end();
        return;
      }
      combo = 0;
      placed = withSpan(c, c.axis, lo, hi);
      const cut = delta > 0 ? withSpan(c, c.axis, hi, a1) : withSpan(c, c.axis, a0, lo);
      pieces.push({ ...cut, vy: 0, drift: Math.sign(delta) * 0.35, alpha: 1, behind: delta < 0 });
      playTick();
    }

    stack.push({ x0: placed.x0, x1: placed.x1, z0: placed.z0, z1: placed.z1, y: placed.y, color: placed.color });
    camTarget = Math.max(0, stack.length * SLAB - 1.3);
    events.onPlace(stack.length - 1, combo);
    spawn();
    wake();
  }

  return {
    /** Start a game, or drop the moving layer. */
    act() {
      if (status === "playing") drop();
      else start();
    },
    resize(nextWidth: number, nextHeight: number, dpr: number) {
      width = nextWidth;
      height = nextHeight;
      canvas.width = Math.round(nextWidth * dpr);
      canvas.height = Math.round(nextHeight * dpr);
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    },
    setColors(next: string[], neutral: string) {
      colors = next;
      pedestal = neutral;
      draw();
    },
    destroy() {
      cancelAnimationFrame(raf);
      raf = 0;
    },
  };
}

export type StackEngine = ReturnType<typeof createStackEngine>;
