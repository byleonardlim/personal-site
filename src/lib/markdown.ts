import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { toString as mdastToString } from 'mdast-util-to-string';
import GithubSlugger from 'github-slugger';

// Minimal mdast-like shapes to avoid external type packages
type MdastNode = {
  type: string;
  depth?: number;
  position?: { start?: { line?: number }; end?: { line?: number } };
  [key: string]: unknown;
};
type MdastRoot = { children?: MdastNode[] };

export interface Section {
  title: string;
  content: string;
  id: string;
}

export function parseMarkdownSections(markdown: string): Section[] {
  const tree = unified().use(remarkParse).parse(markdown) as unknown as MdastRoot;
  const lines = markdown.split('\n');
  const sections: Section[] = [];
  const children: MdastNode[] = tree.children || [];
  const slugger = new GithubSlugger();

  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    if (node.type === 'heading' && node.depth === 2) {
      const title = mdastToString(node as unknown as object);
      const id = slugger.slug(title);
      const startLine = (node.position?.end?.line ?? 0) + 1;
      // find next H2 or end of document
      let endLine = lines.length;
      for (let j = i + 1; j < children.length; j++) {
        const next = children[j];
        if (next.type === 'heading' && next.depth === 2) {
          endLine = (next.position?.start?.line ?? endLine) - 1;
          break;
        }
      }
      const content = startLine <= endLine ? lines.slice(startLine - 1, endLine).join('\n') : '';
      sections.push({ title, id, content });
    }
  }

  return sections;
}
