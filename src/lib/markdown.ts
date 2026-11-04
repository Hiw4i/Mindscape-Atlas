import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: false });

/**
 * Рендер markdown в HTML. Контент создаётся в закрытой админ-панели,
 * поэтому санитайзер не нужен; внешним ссылкам добавляется rel.
 */
export function renderMarkdown(md: string): string {
  if (!md.trim()) return "";
  const html = marked.parse(md) as string;
  return html
    .replace(/<a /g, '<a rel="noopener noreferrer" ')
    .replace(/<a ([^>]*?href="https?:)/g, '<a class="link-ext" $1');
}
