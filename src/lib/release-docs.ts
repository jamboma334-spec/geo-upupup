import fs from "node:fs";
import path from "node:path";

export interface ReleaseDocMeta {
  slug: string;
  filename: string;
  title: string;
}

export interface ReleaseDoc extends ReleaseDocMeta {
  content: string;
}

const releaseDir = path.join(process.cwd(), "release");

export function getReleaseDocs(): ReleaseDocMeta[] {
  if (!fs.existsSync(releaseDir)) return [];
  return fs.readdirSync(releaseDir)
    .filter((filename) => filename.endsWith(".md"))
    .sort((a, b) => b.localeCompare(a))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      return {
        slug,
        filename,
        title: slug,
      };
    });
}

export function getReleaseDoc(slug?: string): ReleaseDoc | null {
  const docs = getReleaseDocs();
  const target = docs.find((doc) => doc.slug === slug) || docs[0];
  if (!target) return null;
  const filePath = path.join(releaseDir, target.filename);
  return {
    ...target,
    content: fs.readFileSync(filePath, "utf-8"),
  };
}
