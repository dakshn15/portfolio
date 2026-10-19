/**
 * A small drawing of each game for its card, in the layer colours so it
 * follows the theme. Decorative: the card's text says what the game is.
 */
export function GamePreview({ slug }: { slug: string }) {
  return (
    <svg viewBox="0 0 320 200" aria-hidden className="h-full w-full" fill="none">
      {previews[slug] ?? null}
    </svg>
  );
}

const C = {
  interface: "var(--layer-interface)",
  api: "var(--layer-api)",
  auth: "var(--layer-auth)",
  ai: "var(--layer-ai)",
  data: "var(--layer-data)",
  ink: "var(--ink)",
  ink3: "var(--ink-3)",
  raised: "var(--raised)",
  line: "var(--line-strong)",
};

/** An isometric slab, centred on (x, y). */
function Slab({ x, y, w = 56, color }: { x: number; y: number; w?: number; color: string }) {
  const h = w / 2;
  const t = 9;
  return (
    <g>
      <path d={`M${x - w} ${y}L${x} ${y + h}V${y + h + t}L${x - w} ${y + t}Z`} fill={color} opacity=".78" />
      <path d={`M${x + w} ${y}L${x} ${y + h}V${y + h + t}L${x + w} ${y + t}Z`} fill={color} opacity=".6" />
      <path d={`M${x} ${y - h}L${x + w} ${y}L${x} ${y + h}L${x - w} ${y}Z`} fill={color} />
    </g>
  );
}

const previews: Record<string, React.ReactNode> = {
  "stack-it": (
    <g>
      <Slab x={160} y={150} w={62} color={C.data} />
      <Slab x={160} y={133} w={62} color={C.ai} />
      <Slab x={164} y={116} w={58} color={C.auth} />
      <Slab x={164} y={99} w={58} color={C.api} />
      <Slab x={196} y={66} w={58} color={C.interface} />
      <path d="M232 52h34M246 46l8 6-8 6" stroke={C.ink3} strokeWidth="1.5" strokeLinecap="round" />
    </g>
  ),
  "bug-smash": (
    <g>
      {[0, 1, 2].map((row) =>
        [0, 1, 2, 3, 4, 5].map((col) =>
          (row + col) % 5 === 3 ? null : (
            <rect
              key={`${row}-${col}`}
              x={44 + col * 40}
              y={34 + row * 22}
              width="34"
              height="16"
              rx="4"
              fill={[C.interface, C.api, C.auth][row]}
            />
          ),
        ),
      )}
      <circle cx="186" cy="132" r="6" fill={C.ink} />
      <path d="M150 168 186 132 214 102" stroke={C.ink3} strokeWidth="1.2" strokeDasharray="3 4" />
      <rect x="114" y="166" width="72" height="9" rx="4.5" fill={C.ink} />
    </g>
  ),
  keystrokes: (
    <g>
      <rect x="34" y="62" width="252" height="76" rx="12" fill={C.raised} stroke={C.line} />
      <text x="56" y="106" fontFamily="ui-monospace, monospace" fontSize="15" fill={C.ink}>
        <tspan>return </tspan>
        <tspan fill={C.api}>rules</tspan>
        <tspan fill={C.ink3}>[from]?.inc</tspan>
      </text>
      <rect x="224" y="91" width="2" height="20" fill={C.interface} />
      <rect x="56" y="122" width="96" height="3" rx="1.5" fill={C.api} opacity=".5" />
    </g>
  ),
  echo: (
    <g>
      {[C.interface, C.api, C.auth, C.ai, C.data].map((color, i) => (
        <g key={i}>
          <rect
            x={70}
            y={34 + i * 27}
            width="180"
            height="21"
            rx="6"
            fill={i === 2 ? color : C.raised}
            stroke={i === 2 ? "none" : C.line}
          />
          <circle cx="86" cy={44.5 + i * 27} r="4" fill={i === 2 ? C.raised : color} />
        </g>
      ))}
      <path d="M262 98c8 6 8 16 0 22M270 92c13 10 13 24 0 34" stroke={C.auth} strokeWidth="2" strokeLinecap="round" />
    </g>
  ),
  match: (
    <g>
      {[0, 1, 2, 3].map((col) =>
        [0, 1].map((row) => {
          const up = (col === 1 && row === 0) || (col === 2 && row === 1);
          return (
            <g key={`${col}-${row}`}>
              <rect x={62 + col * 52} y={44 + row * 58} width="44" height="50" rx="7" fill={C.raised} stroke={up ? C.auth : C.line} />
              {up ? (
                <path d={`M${84 + col * 52} ${58 + row * 58}l9 16h-18Z`} fill={C.auth} />
              ) : (
                <path d={`M${84 + col * 52} ${64 + row * 58}v10M${79 + col * 52} ${69 + row * 58}h10`} stroke={C.ink3} strokeWidth="1" />
              )}
            </g>
          );
        }),
      )}
    </g>
  ),
  ping: (
    <g>
      <circle cx="160" cy="100" r="58" stroke={C.line} />
      <circle cx="160" cy="100" r="38" stroke={C.line} />
      <circle cx="160" cy="100" r="18" fill="var(--success)" />
      <text x="160" y="186" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="15" fill={C.ink}>
        212 ms
      </text>
      <path d="M232 46l-26 26M232 46h-12M232 46v12" stroke={C.ink3} strokeWidth="1.5" strokeLinecap="round" />
    </g>
  ),
};
