import type { ReactNode } from "react";

type Block =
  | { kind: "heading"; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "quote"; text: string };

/** Small block parser for the stored note bodies. No runtime markdown dependency. */
export function parseNote(body: string): Block[] {
  return body
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map<Block>((chunk) => {
      if (chunk.startsWith("## ")) return { kind: "heading", text: chunk.slice(3).trim() };
      if (chunk.startsWith("> ")) return { kind: "quote", text: chunk.slice(2).trim() };
      if (chunk.startsWith("- ")) {
        return {
          kind: "list",
          items: chunk
            .split("\n")
            .map((line) => line.replace(/^-\s*/, "").trim())
            .filter(Boolean),
        };
      }
      return { kind: "paragraph", text: chunk.replace(/\n/g, " ") };
    });
}

export function NoteBody({ body }: { body: string }): ReactNode {
  const blocks = parseNote(body);

  return (
    <div className="prose-note">
      {blocks.map((block, index) => {
        if (block.kind === "heading") return <h2 key={index}>{block.text}</h2>;
        if (block.kind === "quote") return <blockquote key={index}>{block.text}</blockquote>;
        if (block.kind === "list") {
          return (
            <ul key={index}>
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }
        return <p key={index}>{block.text}</p>;
      })}
    </div>
  );
}
