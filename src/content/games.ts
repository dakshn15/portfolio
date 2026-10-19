import type { LayerId } from "./layers";

/** A game in the playground: what it is, how to play, and how it's scored. */
export type Game = {
  slug: string;
  name: string;
  /** One line for cards. */
  tagline: string;
  /** A sentence or two for the game page. */
  description: string;
  genre: string;
  /** Roughly how long a round takes. */
  length: string;
  controls: ("Mouse" | "Touch" | "Keyboard")[];
  howTo: string[];
  keys: { keys: string; action: string }[];
  score: {
    /** Where the best score is kept in the browser. */
    key: string;
    label: string;
    unit: string;
    better: "higher" | "lower";
  };
  accent: LayerId;
};

export const games: Game[] = [
  {
    slug: "stack-it",
    name: "Stack it",
    tagline: "Drop each layer on the one below. Build the tallest tower you can.",
    description:
      "The five layers from my home page, as a game. Each new layer slides over the tower, and whatever hangs over the edge gets cut off.",
    genre: "Arcade",
    length: "1–3 min",
    controls: ["Mouse", "Touch", "Keyboard"],
    howTo: [
      "A layer slides back and forth above the tower.",
      "Drop it when it lines up with the layer below.",
      "Anything hanging over the edge is cut off, so the tower gets narrower.",
      "Three perfect drops in a row win a little width back.",
    ],
    keys: [
      { keys: "Space or Enter", action: "Drop the layer" },
      { keys: "Click or tap", action: "Drop the layer" },
    ],
    score: { key: "stack", label: "Layers", unit: "layers", better: "higher" },
    accent: "interface",
  },
  {
    slug: "bug-smash",
    name: "Bug Smash",
    tagline: "Bounce the ball and clear the board of bugs before they win.",
    description:
      "A breakout game where every brick is a bug I’ve met in real projects. Tough bugs take two hits, and each level gets a little faster.",
    genre: "Arcade",
    length: "2–5 min",
    controls: ["Mouse", "Touch", "Keyboard"],
    howTo: [
      "Move the paddle to keep the ball in play.",
      "Every bug you hit scores points. Tough ones need two hits.",
      "Clear the board to move on to a faster level.",
      "You have three lives.",
    ],
    keys: [
      { keys: "Mouse or finger", action: "Move the paddle" },
      { keys: "← → or A D", action: "Move the paddle" },
      { keys: "Space", action: "Launch the ball, or pause" },
    ],
    score: { key: "bugs", label: "Points", unit: "pts", better: "higher" },
    accent: "ai",
  },
  {
    slug: "keystrokes",
    name: "Keystrokes",
    tagline: "Type a real line of code from my projects, fast and clean.",
    description:
      "Every line is copied exactly from WayPoint, PetCare, Rezumely or Techzonix. Speed counts, but so does getting it right.",
    genre: "Typing",
    length: "30 sec a line",
    controls: ["Keyboard"],
    howTo: [
      "Start typing the line shown. The clock starts with your first key.",
      "Mistakes show in red. Fix them with Backspace.",
      "Finish the line to see your speed and accuracy.",
      "Move on to the next line, or try the same one again.",
    ],
    keys: [
      { keys: "Type", action: "Type the line" },
      { keys: "Enter", action: "Next line, once you finish" },
    ],
    score: { key: "keys", label: "Speed", unit: "wpm", better: "higher" },
    accent: "api",
  },
  {
    slug: "echo",
    name: "Echo",
    tagline: "Watch the layers light up, then play the pattern back.",
    description:
      "Each of the five layers has its own colour and note. The pattern gets one step longer every round, until you miss.",
    genre: "Memory",
    length: "1–3 min",
    controls: ["Mouse", "Touch", "Keyboard"],
    howTo: [
      "Watch and listen as the layers light up in order.",
      "Play the same order back by pressing the layers.",
      "Each round adds one more step to the pattern.",
      "One wrong press ends the game.",
    ],
    keys: [
      { keys: "1 to 5", action: "Press a layer" },
      { keys: "Click or tap", action: "Press a layer" },
    ],
    score: { key: "echo", label: "Rounds", unit: "rounds", better: "higher" },
    accent: "data",
  },
  {
    slug: "match",
    name: "Match",
    tagline: "Find the eight pairs of tools I use every day.",
    description: "A memory game with the tools from my stack. Every card is face down. Fewer moves is better.",
    genre: "Memory",
    length: "1–2 min",
    controls: ["Mouse", "Touch", "Keyboard"],
    howTo: [
      "Turn over two cards at a time.",
      "If they match, they stay face up.",
      "If they don’t, they turn back over. Try to remember where they were.",
      "Find all eight pairs in as few moves as you can.",
    ],
    keys: [
      { keys: "Click or tap", action: "Turn a card over" },
      { keys: "Tab, then Enter", action: "Turn a card over" },
    ],
    score: { key: "match", label: "Moves", unit: "moves", better: "lower" },
    accent: "auth",
  },
  {
    slug: "ping",
    name: "Ping",
    tagline: "Wait for the signal, then click as fast as you can.",
    description:
      "A reaction test measured the way I’d measure an API: in milliseconds. Five rounds, and your average is the score.",
    genre: "Reflex",
    length: "30 sec",
    controls: ["Mouse", "Touch", "Keyboard"],
    howTo: [
      "Press start, then wait. The board turns green at a random moment.",
      "Click, tap or press Space the moment it does.",
      "Too early, and that round starts again.",
      "Your score is the average of five rounds.",
    ],
    keys: [
      { keys: "Space", action: "React" },
      { keys: "Click or tap", action: "React" },
    ],
    score: { key: "ping", label: "Average", unit: "ms", better: "lower" },
    accent: "interface",
  },
];

/** The social image shared by the playground and every game page. */
export const playImage = { url: "/og/play.jpg", width: 1200, height: 630, alt: "The six games in Daksh Nimavat's playground" };

export function getGame(slug: string) {
  return games.find((game) => game.slug === slug);
}
