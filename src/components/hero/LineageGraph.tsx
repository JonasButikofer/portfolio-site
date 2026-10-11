import { useMediaQuery } from '@/hooks/useMediaQuery';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface NodeSpec {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
}

interface EdgeSpec {
  from: NodeSpec;
  to: NodeSpec;
}

function rightMid(node: NodeSpec) {
  return { x: node.x + node.w, y: node.y + node.h / 2 };
}

function leftMid(node: NodeSpec) {
  return { x: node.x, y: node.y + node.h / 2 };
}

function edgePath(from: NodeSpec, to: NodeSpec, vertical = false) {
  if (vertical) {
    const a = { x: from.x + from.w / 2, y: from.y + from.h };
    const b = { x: to.x + to.w / 2, y: to.y };
    const dy = (b.y - a.y) / 2;
    return `M${a.x},${a.y} C${a.x},${a.y + dy} ${b.x},${b.y - dy} ${b.x},${b.y}`;
  }
  const a = rightMid(from);
  const b = leftMid(to);
  const dx = (b.x - a.x) / 2;
  return `M${a.x},${a.y} C${a.x + dx},${a.y} ${b.x - dx},${b.y} ${b.x},${b.y}`;
}

function Node({ node, delay }: { node: NodeSpec; delay: number }) {
  return (
    <g className="lineage-node" style={{ '--delay': `${delay}s` } as React.CSSProperties}>
      <rect
        x={node.x}
        y={node.y}
        width={node.w}
        height={node.h}
        rx={7}
        fill="var(--color-surface)"
        stroke="var(--color-line)"
        strokeWidth={1.5}
      />
      <text
        x={node.x + node.w / 2}
        y={node.y + node.h / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-display)"
        fontSize={13}
        fill="var(--color-text)"
      >
        {node.label}
      </text>
    </g>
  );
}

function Edge({ from, to, delay, vertical }: EdgeSpec & { delay: number; vertical?: boolean }) {
  return (
    <path
      className="lineage-edge"
      style={{ '--delay': `${delay}s` } as React.CSSProperties}
      d={edgePath(from, to, vertical)}
      fill="none"
      stroke="var(--color-muted)"
      strokeWidth={1.5}
      pathLength={1}
    />
  );
}

// Desktop layout: sources converge into a transform stage, through Delta,
// out to the serve layer. Vocabulary matches SPEC.md §4.1 exactly.
const fred: NodeSpec = { x: 20, y: 16, w: 140, h: 40, label: 'FRED' };
const markets: NodeSpec = { x: 20, y: 100, w: 140, h: 40, label: 'Markets' };
const s3: NodeSpec = { x: 20, y: 184, w: 140, h: 40, label: 'S3' };
const transform: NodeSpec = { x: 260, y: 92, w: 170, h: 56, label: 'dbt / PySpark' };
const delta: NodeSpec = { x: 540, y: 98, w: 110, h: 44, label: 'Delta' };
const agent: NodeSpec = { x: 740, y: 40, w: 130, h: 40, label: 'Agent' };
const dashboard: NodeSpec = { x: 740, y: 160, w: 130, h: 40, label: 'Dashboard' };

function DesktopGraph() {
  return (
    <svg
      viewBox="0 0 900 240"
      className="h-auto w-full"
      style={{ aspectRatio: '900 / 240' }}
      role="img"
      aria-hidden="true"
    >
      <Edge from={fred} to={transform} delay={0} />
      <Edge from={markets} to={transform} delay={0.05} />
      <Edge from={s3} to={transform} delay={0.1} />
      <Edge from={transform} to={delta} delay={0.45} />
      <Edge from={delta} to={agent} delay={0.75} />
      <Edge from={delta} to={dashboard} delay={0.8} />

      <Node node={fred} delay={0.35} />
      <Node node={markets} delay={0.35} />
      <Node node={s3} delay={0.35} />
      <Node node={transform} delay={0.7} />
      <Node node={delta} delay={1.0} />
      <Node node={agent} delay={1.05} />
      <Node node={dashboard} delay={1.05} />
    </svg>
  );
}

// Mobile layout: same graph, simplified to a static vertical column.
const mFred: NodeSpec = { x: 15, y: 16, w: 86, h: 36, label: 'FRED' };
const mMarkets: NodeSpec = { x: 113, y: 16, w: 86, h: 36, label: 'Markets' };
const mS3: NodeSpec = { x: 211, y: 16, w: 86, h: 36, label: 'S3' };
const mTransform: NodeSpec = { x: 60, y: 108, w: 200, h: 44, label: 'dbt / PySpark' };
const mDelta: NodeSpec = { x: 110, y: 188, w: 100, h: 40, label: 'Delta' };
const mAgent: NodeSpec = { x: 30, y: 268, w: 120, h: 36, label: 'Agent' };
const mDashboard: NodeSpec = { x: 170, y: 268, w: 120, h: 36, label: 'Dashboard' };

function MobileGraph() {
  return (
    <svg
      viewBox="0 0 320 328"
      className="lineage-static h-auto w-full"
      style={{ aspectRatio: '320 / 328' }}
      role="img"
      aria-hidden="true"
    >
      <Edge from={mFred} to={mTransform} delay={0} vertical />
      <Edge from={mMarkets} to={mTransform} delay={0} vertical />
      <Edge from={mS3} to={mTransform} delay={0} vertical />
      <Edge from={mTransform} to={mDelta} delay={0} vertical />
      <Edge from={mDelta} to={mAgent} delay={0} vertical />
      <Edge from={mDelta} to={mDashboard} delay={0} vertical />

      <Node node={mFred} delay={0} />
      <Node node={mMarkets} delay={0} />
      <Node node={mS3} delay={0} />
      <Node node={mTransform} delay={0} />
      <Node node={mDelta} delay={0} />
      <Node node={mAgent} delay={0} />
      <Node node={mDashboard} delay={0} />
    </svg>
  );
}

export function LineageGraph() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const reducedMotion = usePrefersReducedMotion();

  if (isMobile) return <MobileGraph />;

  return (
    <div className={reducedMotion ? 'lineage-static' : undefined}>
      <DesktopGraph />
    </div>
  );
}
