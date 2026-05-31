import { Fragment } from "react";
import { ArrowRight, RotateCw } from "lucide-react";

// Data-driven lesson visuals. All authored inside src/data/curriculum.js.
//   { flow:    { dir?: "row"|"col", loop?: "label", steps: [{ t, d?, hot? }] } }
//   { compare: { caption?: "...", cols: [{ title, accent?: amber|green|blue|red, items: [...] }] } }
//   { budget:  { total: "caption", parts: [{ label, v, reserved? }] } }

export function Flow({ data }) {
  const { steps, dir = "row", loop } = data;
  return (
    <div className={"flow flow-" + dir}>
      {steps.map((s, i) => (
        <Fragment key={i}>
          <div className={"flow-node" + (s.hot ? " hot" : "")}>
            <span className="flow-t">{s.t}</span>
            {s.d && <span className="flow-d">{s.d}</span>}
          </div>
          {i < steps.length - 1 && (
            <span className="flow-arrow" aria-hidden="true">
              <ArrowRight size={15} />
            </span>
          )}
        </Fragment>
      ))}
      {loop && (
        <span className="flow-loop">
          <RotateCw size={12} /> {loop}
        </span>
      )}
    </div>
  );
}

export function Compare({ data }) {
  const { cols, caption } = data;
  return (
    <div className="cmpwrap">
      <div className="cmp" style={{ gridTemplateColumns: `repeat(${cols.length}, 1fr)` }}>
        {cols.map((c, i) => (
          <div className={"cmp-col cmp-" + (c.accent || "amber")} key={i}>
            <div className="cmp-h">{c.title}</div>
            <ul className="cmp-list">
              {c.items.map((it, j) => (
                <li key={j}>{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {caption && <div className="cmp-cap">{caption}</div>}
    </div>
  );
}

const SEG = ["#b9791f", "#e9a93c", "#f3c879", "#cdb27a", "#a5cf7b", "#84b6d6"];
const RESERVED = "#5a4e34";

export function Budget({ data }) {
  const total = data.parts.reduce((n, p) => n + p.v, 0);
  return (
    <div className="budget">
      <div className="budget-cap">{data.total}</div>
      <div className="budget-bar">
        {data.parts.map((p, i) => {
          const color = p.reserved ? RESERVED : SEG[i % SEG.length];
          return (
            <div
              key={i}
              className={"budget-seg" + (p.reserved ? " reserved" : "")}
              style={{ width: `${(p.v / total) * 100}%`, background: color }}
              title={`${p.label}: ${p.v.toLocaleString()}`}
            />
          );
        })}
      </div>
      <div className="budget-legend">
        {data.parts.map((p, i) => {
          const color = p.reserved ? RESERVED : SEG[i % SEG.length];
          return (
            <span key={i} className="budget-key">
              <i style={{ background: color }} /> {p.label} <b>{p.v.toLocaleString()}</b>
            </span>
          );
        })}
      </div>
    </div>
  );
}
