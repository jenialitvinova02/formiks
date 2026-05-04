import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const docs = path.join(root, "docs");
const build = path.join(root, "build");
const diagramDir = path.join(build, "diagrams");

mkdirSync(diagramDir, { recursive: true });

const nav = [
  "index.md",
  "01-project-overview/index.md",
  "01-project-overview/problem-and-goals.md",
  "01-project-overview/stakeholders.md",
  "01-project-overview/scope.md",
  "01-project-overview/features.md",
  "02-technical/index.md",
  "02-technical/tech-stack.md",
  "02-technical/criteria/backend.md",
  "02-technical/criteria/frontend.md",
  "02-technical/criteria/database.md",
  "02-technical/criteria/realtime-analytics.md",
  "02-technical/criteria/cloud.md",
  "02-technical/criteria/containerization.md",
  "02-technical/criteria/testing-api-quality.md",
  "02-technical/deployment.md",
  "03-user-guide/index.md",
  "03-user-guide/features.md",
  "03-user-guide/faq.md",
  "04-retrospective/index.md",
  "appendices/index.md",
  "appendices/glossary.md",
  "appendices/api-reference.md",
  "appendices/db-schema.md",
];

const puppeteerConfig = path.join(build, "puppeteer-config.json");
writeFileSync(
  puppeteerConfig,
  JSON.stringify(
    {
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
    null,
    2,
  ),
);

let diagramIndex = 0;

function renderMermaid(source, sourceFile) {
  diagramIndex += 1;
  const base = `diagram-${String(diagramIndex).padStart(2, "0")}`;
  const input = path.join(diagramDir, `${base}.mmd`);
  const output = path.join(diagramDir, `${base}.png`);
  writeFileSync(input, source.trim() + "\n");
  execFileSync(
    "npx",
    [
      "-y",
      "@mermaid-js/mermaid-cli",
      "-i",
      input,
      "-o",
      output,
      "-p",
      puppeteerConfig,
      "-b",
      "white",
      "-s",
      "2",
    ],
    { cwd: root, stdio: "inherit" },
  );

  const alt = path.basename(sourceFile, ".md").replaceAll("-", " ");
  return `\n\n![${alt} diagram](diagrams/${base}.png){ width=82% }\n\n`;
}

function transformMarkdown(relativeFile) {
  const fullPath = path.join(docs, relativeFile);
  let markdown = readFileSync(fullPath, "utf8");

  markdown = markdown.replace(/^<!--[\s\S]*?-->\n*/g, "");
  markdown = markdown.replace(/```mermaid\n([\s\S]*?)```/g, (_match, source) =>
    renderMermaid(source, relativeFile),
  );

  return markdown.trim() + "\n";
}

const combined = nav
  .map((file, index) => {
    const pageBreak = index === 0 ? "" : "\n\\newpage\n\n";
    return pageBreak + transformMarkdown(file);
  })
  .join("\n");

const outputMarkdown = path.join(build, "formics-thesis-rendered.md");
writeFileSync(outputMarkdown, combined);

console.log(`Rendered ${diagramIndex} Mermaid diagrams.`);
console.log(`Combined Markdown: ${outputMarkdown}`);
