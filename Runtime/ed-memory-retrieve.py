#!/usr/bin/env python3
import argparse, json, math, os, re

STOP = {
    "the","and","for","are","but","not","you","your","with","this","that",
    "what","when","where","which","who","why","how","from","have","has","had",
    "would","could","should","can","will","about","into","tell","show","give",
    "please","after","its"
}

def tokens(q):
    return list(dict.fromkeys(
        w for w in re.findall(r"[a-z0-9._-]+", q.lower())
        if (len(w) >= 3 or w == "ed") and w not in STOP
    ))[:16]

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("query")
    ap.add_argument("--root", default=os.environ.get(
        "ED_MEMORY_ROOT", "/storage/emulated/0/ED/Memory"))
    ap.add_argument("--limit", type=int, default=3)
    args = ap.parse_args()

    words = tokens(args.query)
    docs = []

    for base, _, files in os.walk(args.root):
        for name in files:
            if name.endswith(".log") or name == "memory-links.graph":
                continue

            path = os.path.join(base, name)
            rel = os.path.relpath(path, args.root)
            rel_norm = rel.replace(os.sep, "/").lower()

            # Unapproved/pending memory must never enter active retrieval.
            if rel_norm.startswith("inbox/"):
                continue

            # Operational/runtime records are not approved long-term memory.
            if rel_norm.startswith("context/active/"):
                continue

            if rel_norm.startswith("experience/"):
                continue

            if rel_norm.startswith("questions/"):
                continue

            if rel_norm.startswith("proposals/pending/"):
                continue

            if rel_norm.startswith("pending/"):
                continue

            if rel == "Context/Active/retrieved-memory.txt":
                continue

            try:
                text = open(
                    path, encoding="utf-8", errors="ignore"
                ).read(262144)
            except Exception:
                continue

            docs.append((path, rel, text))

    df = {
        w: sum(1 for _, _, t in docs if w in t.lower())
        for w in words
    }

    results = []
    total = max(len(docs), 1)

    for path, rel, text in docs:
        lower = text.lower()
        score = 0.0
        matched = False

        for w in words:
            count = lower.count(w)
            if not count:
                continue

            matched = True

            idf = math.log((total + 1) / (df[w] + 1)) + 1

            # Cap repeated-word influence so generated context
            # cannot win merely by repeating common terms.
            tf = 1 + (min(count, 3) - 1) * 0.35
            score += tf * idf * 5

            if w in os.path.basename(rel).lower():
                score += idf * 8

            head = "\n".join(text.splitlines()[:6]).lower()
            if w in head:
                score += idf * 5

        # Authority bonuses may rank relevant memories higher,
        # but may never make an unrelated file a search result.
        if not matched:
            continue

        lp = "/" + rel.lower()

        # Prefer authoritative memory over generated/derived context.
        if any(lp.startswith("/" + x) for x in
               ("projects/", "approved/", "decisions/", "lessons/")):
            score += 25

        if lp.startswith("/context/active/"):
            score -= 50

        if lp.startswith("/brain/sessions/"):
            score -= 15

        if score <= 0:
            continue

        lines = text.splitlines()
        best_line = 1
        best_preview = ""
        best_hits = -1

        for n, line in enumerate(lines, 1):
            hits = sum(line.lower().count(w) for w in words)
            if hits > best_hits:
                best_hits = hits
                best_line = n
                best_preview = line.strip()[:240]

        # Wide enough to preserve nearby roadmap/context relationships
        # while still selecting the relevant region of larger files.
        start_line = max(1, best_line - 8)
        end_line = min(len(lines), best_line + 24)

        excerpt = "\n".join(
            lines[start_line - 1:end_line]
        ).strip()

        results.append({
            "path": rel,
            "score": round(score, 2),
            "line": best_line,
            "preview": best_preview,
            "startLine": start_line,
            "endLine": end_line,
            "excerpt": excerpt
        })

    results.sort(key=lambda x: (-x["score"], x["path"]))

    print(json.dumps({
        "query": args.query,
        "terms": words,
        "count": min(len(results), args.limit),
        "results": results[:args.limit]
    }, indent=2))

if __name__ == "__main__":
    main()
