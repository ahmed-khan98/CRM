"use client";

import { memo } from "react";

/** Match http(s) and www. URLs; trim trailing punctuation from display/href. */
const URL_RE =
  /\b((?:https?:\/\/|www\.)[^\s<>"'`]+)/gi;

function normalizeHref(raw) {
  let url = String(raw || "");
  // Strip common trailing punctuation stuck to the URL
  url = url.replace(/[),.!?;:'"\]]+$/g, "");
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  return url;
}

function linkifyText(text, keyPrefix = "t", mine = false) {
  if (text == null || text === "") return null;
  const str = String(text);
  const nodes = [];
  let last = 0;
  let match;
  let i = 0;
  const re = new RegExp(URL_RE.source, "gi");

  while ((match = re.exec(str)) !== null) {
    const raw = match[0];
    const trimmed = raw.replace(/[),.!?;:'"\]]+$/g, "");
    const trailing = raw.slice(trimmed.length);
    if (match.index > last) {
      nodes.push(
        <span key={`${keyPrefix}-s-${i}`}>{str.slice(last, match.index)}</span>
      );
    }
    if (trimmed) {
      const href = normalizeHref(trimmed);
      nodes.push(
        <a
          key={`${keyPrefix}-a-${i}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={
            mine
              ? "break-all font-medium text-sky-300 underline underline-offset-2 hover:text-sky-200"
              : "break-all font-medium text-sky-400 underline underline-offset-2 hover:text-sky-300"
          }
        >
          {trimmed}
        </a>
      );
    }
    if (trailing) {
      nodes.push(<span key={`${keyPrefix}-p-${i}`}>{trailing}</span>);
    }
    last = match.index + raw.length;
    i += 1;
  }

  if (last < str.length) {
    nodes.push(<span key={`${keyPrefix}-e-${i}`}>{str.slice(last)}</span>);
  }

  return nodes.length ? nodes : str;
}

export function renderMentionBody(body, participants = [], mine = false) {
  if (!body) return null;
  const names = [
    ...new Set(
      (participants || [])
        .flatMap((p) => {
          const full = p.userId?.fullName;
          if (!full) return [];
          const formatted = full
            .trim()
            .split(/\s+/)
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(" ");
          return full === formatted ? [full] : [full, formatted];
        })
        .filter(Boolean)
    ),
  ].sort((a, b) => b.length - a.length);

  if (!names.length) {
    return linkifyText(body, "b", mine);
  }

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
        ...[].concat(
          linkifyText(body.slice(last, match.index), `t-${i}`, mine) || []
        )
      );
    }
    nodes.push(
      <span
        key={`m-${i}`}
        className={
          mine ? "font-semibold text-sky-200" : "font-semibold text-sky-400"
        }
      >
        @{match[1]}
      </span>
    );
    last = match.index + match[0].length;
    i += 1;
  }
  if (last < body.length) {
    nodes.push(
      ...[].concat(linkifyText(body.slice(last), `e-${i}`, mine) || [])
    );
  }
  return nodes.length ? nodes : body;
}

function MentionText({ body, participants = [], mine = false }) {
  return renderMentionBody(body, participants, mine);
}

export default memo(MentionText);
