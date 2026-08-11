"use client";

import { memo } from "react";

export function renderMentionBody(body, participants = [], mine = false) {
  if (!body) return null;
  const names = [
    ...new Set(
      (participants || [])
        .map((p) => p.userId?.fullName)
        .filter(Boolean)
    ),
  ].sort((a, b) => b.length - a.length);
  if (!names.length) return body;

  const escaped = names.map((n) =>
    n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );
  const re = new RegExp(`@(${escaped.join("|")})`, "g");
  const nodes = [];
  let last = 0;
  let match;
  let i = 0;
  while ((match = re.exec(body)) !== null) {
    if (match.index > last) {
      nodes.push(
        <span key={`t-${i}`}>{body.slice(last, match.index)}</span>
      );
    }
    nodes.push(
      <span
        key={`m-${i}`}
        className={
          mine ? "font-semibold text-sky-200" : "font-semibold text-sky-700"
        }
      >
        @{match[1]}
      </span>
    );
    last = match.index + match[0].length;
    i += 1;
  }
  if (last < body.length) {
    nodes.push(<span key={`e-${i}`}>{body.slice(last)}</span>);
  }
  return nodes.length ? nodes : body;
}

function MentionText({ body, participants = [], mine = false }) {
  return renderMentionBody(body, participants, mine);
}

export default memo(MentionText);
