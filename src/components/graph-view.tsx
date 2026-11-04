"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from "d3-force";

export interface GraphNode {
  id: string;
  label: string;
  color: string;
  size: number;
  slug: string;
  description?: string;
  materials?: number;
}

export interface GraphLink {
  source: string;
  target: string;
}

interface SimNode extends SimulationNodeDatum {
  id: string;
  label: string;
  color: string;
  size: number;
  slug: string;
  description?: string;
  materials?: number;
}

interface Props {
  nodes: GraphNode[];
  links: GraphLink[];
  height?: number;
  interactive?: boolean;
  legend?: Array<{ label: string; color: string }>;
  className?: string;
}

const NODE_R = 4; /* точка 8px */
const MONO = "var(--font-plex-mono), ui-monospace, 'Courier New', monospace";

/**
 * Карта связей понятий: топография. Узлы - точки 8px terrain-цвета,
 * подписи mono 13px, рёбра hairline 1px. Hover открывает карточку
 * легенды (описание + число материалов) с единственной тенью продукта.
 */
export function GraphView({
  nodes,
  links,
  height = 480,
  interactive = true,
  legend,
  className = "",
}: Props) {
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragRef = useRef<{ x: number; y: number; ox: number; oy: number; moved: boolean } | null>(null);
  const [w, setW] = useState(0);
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      setW(Math.max(280, Math.floor(entries[0].contentRect.width)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!w || !nodes.length) return;
    const simNodes: SimNode[] = nodes.map((n) => ({
      ...n,
      x: w / 2 + (Math.random() - 0.5) * w * 0.55,
      y: height / 2 + (Math.random() - 0.5) * height * 0.55,
    }));
    const simLinks: Array<SimulationLinkDatum<SimNode>> = links.map((l) => ({
      source: l.source,
      target: l.target,
    }));
    const sim = forceSimulation<SimNode>(simNodes)
      .force("charge", forceManyBody<SimNode>().strength(-400))
      .force(
        "link",
        forceLink<SimNode, SimulationLinkDatum<SimNode>>(simLinks)
          .id((d) => d.id)
          .distance(140)
          .strength(0.5)
      )
      .force("center", forceCenter<SimNode>(w / 2, height / 2))
      .force("collide", forceCollide<SimNode>((d) => d.size + 30));
    sim.stop();
    for (let i = 0; i < 280; i++) sim.tick();

    // Подгоняем раскладку под видимую область, чтобы узлы не уезжали за край
    const xs = simNodes.map((n) => n.x ?? 0);
    const ys = simNodes.map((n) => n.y ?? 0);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const pad = 46;
    const availW = Math.max(w - pad * 2, 100);
    const availH = Math.max(height - pad * 2, 100);
    const boxW = Math.max(maxX - minX, 1);
    const boxH = Math.max(maxY - minY, 1);
    // По ширине подгоняем строго, по высоте допускаем переполнение до 15%:
    // так масштаб больше и подписи размещаются свободнее.
    const scale = Math.min(
      availW / boxW,
      (availH * 1.15) / boxH,
      1.25
    );
    const offX = pad + (availW - boxW * scale) / 2 - minX * scale;
    const offY = pad + (availH - boxH * scale) / 2 - minY * scale;

    const map: Record<string, { x: number; y: number }> = {};
    for (const n of simNodes) {
      map[n.id] = { x: (n.x ?? 0) * scale + offX, y: (n.y ?? 0) * scale + offY };
    }
    setPositions(map);
    setTransform({ x: 0, y: 0, k: 1 });
  }, [nodes, links, w, height]);

  // Масштабирование колесом (нативный слушатель, чтобы preventDefault работал)
  useEffect(() => {
    const el = svgRef.current;
    if (!el || !interactive) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      setTransform((t) => {
        const k = Math.min(4, Math.max(0.35, t.k * (e.deltaY < 0 ? 1.12 : 0.89)));
        const ratio = k / t.k;
        return { k, x: px - (px - t.x) * ratio, y: py - (py - t.y) * ratio };
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [interactive]);

  const neighborIds = useMemo(() => {
    if (!active) return null;
    const set = new Set<string>([active]);
    for (const l of links) {
      if (l.source === active) set.add(l.target);
      if (l.target === active) set.add(l.source);
    }
    return set;
  }, [active, links]);

  /**
   * Отбор подписей в плотных местах: подпись показывается, если её
   * прямоугольник не пересекается с уже размещёнными. Приоритет у узлов
   * с большим числом материалов; скрытая подпись появляется на hover.
   */
  const labelVisible = useMemo(() => {
    if (!Object.keys(positions).length) return null;
    const boxes: Array<{
      id: string;
      x0: number;
      x1: number;
      y0: number;
      y1: number;
      order: number;
    }> = [];
    for (const n of nodes) {
      const p = positions[n.id];
      if (!p) continue;
      const width = Math.min(n.label.length, 24) * 7.2 + 8;
      boxes.push({
        id: n.id,
        x0: p.x - width / 2,
        x1: p.x + width / 2,
        y0: p.y + NODE_R,
        y1: p.y + NODE_R + 20,
        order: n.materials ?? n.size,
      });
    }
    boxes.sort((a, b) => b.order - a.order);
    const kept = new Set<string>();
    const placed: Array<{ x0: number; x1: number; y0: number; y1: number }> = [];
    for (const b of boxes) {
      const clash = placed.some(
        (t) => b.x0 < t.x1 && b.x1 > t.x0 && b.y0 < t.y1 && b.y1 > t.y0
      );
      if (!clash) {
        kept.add(b.id);
        placed.push(b);
      }
    }
    return kept;
  }, [positions, nodes]);

  const activeNode = useMemo(
    () => (active ? nodes.find((n) => n.id === active) ?? null : null),
    [active, nodes]
  );

  function onPointerDown(e: React.PointerEvent<SVGSVGElement>) {
    if (!interactive) return;
    dragRef.current = {
      x: e.clientX,
      y: e.clientY,
      ox: transform.x,
      oy: transform.y,
      moved: false,
    };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<SVGSVGElement>) {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true;
    setTransform((t) => ({ ...t, x: d.ox + dx, y: d.oy + dy }));
  }

  function onPointerUp() {
    dragRef.current = null;
  }

  function openNode(node: SimNode) {
    if (dragRef.current?.moved) return;
    router.push(`/topics/${node.slug}`);
  }

  const activePos = active ? positions[active] : null;
  const activeScreen = activePos
    ? {
        x: activePos.x * transform.k + transform.x,
        y: activePos.y * transform.k + transform.y,
      }
    : null;

  return (
    <div ref={wrapRef} className={`relative overflow-hidden ${className}`}>
      {w > 0 && positions && Object.keys(positions).length > 0 ? (
        <svg
          ref={svgRef}
          width="100%"
          height={height}
          role="img"
          aria-label="Карта связей понятий"
          className={interactive ? "cursor-grab touch-none select-none" : "select-none"}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={() => {
            onPointerUp();
            setActive(null);
          }}
        >
          <g transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}>
            {/* Рёбра: hairline 1px, без стрелок и градиентов */}
            {links.map((l, i) => {
              const a = positions[l.source];
              const b = positions[l.target];
              if (!a || !b) return null;
              const highlighted =
                active && (l.source === active || l.target === active);
              const dimmed = active && !highlighted;
              return (
                <line
                  key={i}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={
                    highlighted
                      ? "var(--route)"
                      : "color-mix(in srgb, var(--ink) 26%, transparent)"
                  }
                  strokeWidth={1}
                  opacity={dimmed ? 0.3 : 1}
                />
              );
            })}
            {nodes.map((n) => {
              const p = positions[n.id];
              if (!p) return null;
              const dimmed = neighborIds && !neighborIds.has(n.id);
              return (
                <g
                  key={n.id}
                  opacity={dimmed ? 0.3 : 1}
                  onMouseEnter={() => setActive(n.id)}
                  onMouseLeave={() => setActive(null)}
                  onClick={interactive ? () => openNode(n) : undefined}
                  className={interactive ? "cursor-pointer" : ""}
                >
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={NODE_R}
                    fill={n.color}
                    stroke={active === n.id ? "var(--route)" : "transparent"}
                    strokeWidth={1.5}
                  />
                  {(labelVisible?.has(n.id) || active === n.id || transform.k > 1.3) && (
                    <text
                      x={p.x}
                      y={p.y + NODE_R + 14}
                      textAnchor="middle"
                      fontSize={13}
                      fontFamily={MONO}
                      fill={active === n.id ? "var(--ink)" : "var(--ink-2)"}
                      style={{ pointerEvents: "none" }}
                    >
                      {n.label.length > 24 ? n.label.slice(0, 23) + "…" : n.label}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      ) : (
        <div style={{ height }} className="flex items-center justify-center font-mono text-[13px] text-ink-3">
          Построение карты...
        </div>
      )}

      {/* Карточка легенды: плавающий слой с единственной тенью */}
      {activeNode && activeScreen && (activeNode.description || typeof activeNode.materials === "number") && (
        <div
          className="pointer-events-none absolute z-10 max-w-[260px] border border-line bg-bg px-3 py-2.5"
          style={{
            left: activeScreen.x,
            top: activeScreen.y - 14,
            transform: "translate(-50%, -100%)",
            boxShadow: "var(--shadow-float)",
          }}
        >
          <p className="font-mono text-[13px] text-ink">{activeNode.label}</p>
          {activeNode.description && (
            <p className="mt-1 text-[13px] leading-snug text-ink-2">{activeNode.description}</p>
          )}
          {typeof activeNode.materials === "number" && (
            <p className="mt-1.5 font-mono text-[13px] tabular-nums text-ink-3">
              {activeNode.materials} материалов
            </p>
          )}
        </div>
      )}

      {legend && legend.length > 0 && (
        <div className="flex flex-wrap gap-x-5 gap-y-1 border-t border-line px-1 pt-2.5 pb-1 font-mono text-[13px] text-ink-2">
          {legend.map((item) => (
            <span key={item.label} className="inline-flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="size-2 rounded-full"
                style={{ background: item.color }}
              />
              {item.label}
            </span>
          ))}
        </div>
      )}

      {interactive && (
        <p className="pointer-events-none absolute right-2 top-2 border border-line bg-bg px-2 py-1 font-mono text-[13px] text-ink-3">
          колесо - масштаб, перетаскивание - перемещение
        </p>
      )}
    </div>
  );
}
