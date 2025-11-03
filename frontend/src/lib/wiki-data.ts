// Types
export interface WikiPage {
  id: string;
  title: string;
  content: string;
  tags: string[];
  links: string[]; // IDs of linked pages
  createdAt: string;
  updatedAt: string;
}

export interface WikiPageVersion {
  timestamp: string;
  content: string;
}

export interface Backlink {
  id: string;
  title: string;
  context?: string; // Snippet of text containing the link
}

// Mock data store
const wikiPages: WikiPage[] = [
  {
    id: '1',
    title: 'Getting Started with Personal Wiki',
    content:
      'Welcome to your personal wiki! This is a place to store and connect your knowledge.\n\n## What is a Personal Wiki?\n\nA personal wiki is a digital garden where you can:\n\n- Capture ideas and notes\n- Connect related concepts\n- Build a network of knowledge\n\n## How to Use\n\n1. Create new pages for topics you want to remember\n2. Use [[Page Name]] syntax to link to other pages\n3. Add tags to organize your content\n4. Use the graph view to see connections\n\n## Examples\n\nCheck out the [[Example Note]] to see how linking works.',
    tags: ['guide', 'wiki'],
    links: ['2'],
    createdAt: '2023-01-01T12:00:00Z',
    updatedAt: '2023-01-02T14:30:00Z',
  },
  {
    id: '2',
    title: 'Example Note',
    content:
      "This is an example note to demonstrate how linking works in your personal wiki.\n\n## Features\n\n- You can use **bold** and *italic* text\n- Create lists like this one\n- Add [[Getting Started with Personal Wiki|links back]] to other pages\n- Include code blocks\n\n```js\nconsole.log('Hello Wiki!');\n```\n\n## Related Topics\n\nYou might want to check out [[Markdown Syntax]] for more formatting options.",
    tags: ['example', 'demo'],
    links: ['1', '3'],
    createdAt: '2023-01-01T12:30:00Z',
    updatedAt: '2023-01-03T09:15:00Z',
  },
  {
    id: '3',
    title: 'Markdown Syntax',
    content:
      "# Markdown Basics\n\nMarkdown is a lightweight markup language that you can use to add formatting elements to plaintext text documents.\n\n## Headings\n\n# Heading 1\n## Heading 2\n### Heading 3\n\n## Emphasis\n\n*Italic text* or _italic text_\n**Bold text** or __bold text__\n\n## Lists\n\nUnordered list:\n- Item 1\n- Item 2\n  - Subitem 2.1\n\nOrdered list:\n1. First item\n2. Second item\n\n## Links\n\n[External link](https://example.com)\n[[Internal link]] to another wiki page\n\n## Code\n\nInline `code` has backticks around it.\n\n```javascript\n// Code block\nfunction hello() {\n  console.log('Hello, wiki!');\n}\n```\n\n## Blockquotes\n\n> This is a blockquote\n> It can span multiple lines\n\n## Tables\n\n| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n| Cell 3   | Cell 4   |\n\nSee the [[Getting Started with Personal Wiki]] for more information.",
    tags: ['markdown', 'reference', 'formatting'],
    links: ['1'],
    createdAt: '2023-01-02T10:00:00Z',
    updatedAt: '2023-01-04T16:45:00Z',
  },
];

// Mock version history
const wikiVersions: Record<string, WikiPageVersion[]> = {
  '1': [
    {
      timestamp: '2023-01-02T14:30:00Z',
      content:
        'Welcome to your personal wiki! This is a place to store and connect your knowledge.\n\n## What is a Personal Wiki?\n\nA personal wiki is a digital garden where you can:\n\n- Capture ideas and notes\n- Connect related concepts\n- Build a network of knowledge\n\n## How to Use\n\n1. Create new pages for topics you want to remember\n2. Use [[Page Name]] syntax to link to other pages\n3. Add tags to organize your content\n4. Use the graph view to see connections\n\n## Examples\n\nCheck out the [[Example Note]] to see how linking works.',
    },
    {
      timestamp: '2023-01-01T12:00:00Z',
      content:
        'Welcome to your personal wiki! This is a place to store and connect your knowledge.\n\n## What is a Personal Wiki?\n\nA personal wiki is a digital garden where you can:\n\n- Capture ideas and notes\n- Connect related concepts\n- Build a network of knowledge\n\n## How to Use\n\n1. Create new pages for topics you want to remember\n2. Use [[Page Name]] syntax to link to other pages\n3. Add tags to organize your content',
    },
  ],
};

// Helper functions
export function getAllWikiPages(): WikiPage[] {
  return [...wikiPages];
}

export function getWikiPageById(id: string): WikiPage | undefined {
  return wikiPages.find((page) => page.id === id);
}

export function getWikiPageByTitle(title: string): WikiPage | undefined {
  return wikiPages.find(
    (page) => page.title.toLowerCase() === title.toLowerCase()
  );
}

export function createWikiPage(
  pageData: Omit<WikiPage, 'id' | 'links' | 'createdAt' | 'updatedAt'>
): string {
  const now = new Date().toISOString();
  const newId = (
    Math.max(0, ...wikiPages.map((p) => Number.parseInt(p.id))) + 1
  ).toString();

  const newPage: WikiPage = {
    id: newId,
    ...pageData,
    links: [],
    createdAt: now,
    updatedAt: now,
  };

  wikiPages.push(newPage);
  return newId;
}

export function updateWikiPage(
  id: string,
  updates: Partial<Omit<WikiPage, 'id' | 'createdAt'>>
): void {
  const pageIndex = wikiPages.findIndex((page) => page.id === id);

  if (pageIndex === -1) {
    throw new Error(`Wiki page with ID ${id} not found`);
  }

  // Extract links from content if content is updated
  if (updates.content) {
    const linkRegex = /\[\[(.*?)\]\]/g;
    const links: string[] = [];
    let match;

    while ((match = linkRegex.exec(updates.content)) !== null) {
      const linkedPageTitle = match[1].split('|')[0].trim();
      const linkedPage = getWikiPageByTitle(linkedPageTitle);

      if (linkedPage && linkedPage.id !== id) {
        links.push(linkedPage.id);
      }
    }

    updates.links = Array.from(new Set(links)); // Remove duplicates
  }

  // Add to version history if content changed
  if (updates.content && updates.content !== wikiPages[pageIndex].content) {
    const now = new Date().toISOString();

    if (!wikiVersions[id]) {
      wikiVersions[id] = [];
    }

    wikiVersions[id].unshift({
      timestamp: now,
      content: updates.content,
    });
  }

  wikiPages[pageIndex] = {
    ...wikiPages[pageIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
}

export function deleteWikiPage(id: string): void {
  const pageIndex = wikiPages.findIndex((page) => page.id === id);

  if (pageIndex === -1) {
    throw new Error(`Wiki page with ID ${id} not found`);
  }

  // Remove the page
  wikiPages.splice(pageIndex, 1);

  // Remove links to this page from other pages
  wikiPages.forEach((page) => {
    if (page.links.includes(id)) {
      page.links = page.links.filter((linkId) => linkId !== id);
    }
  });

  // Remove version history
  delete wikiVersions[id];
}

export function getBacklinks(pageId: string): Backlink[] {
  return wikiPages
    .filter((page) => page.links.includes(pageId))
    .map((page) => {
      // Find context (snippet containing the link)
      const linkRegex = new RegExp(
        `\\[\\[(.*?${getWikiPageById(pageId)?.title}.*?)\\]\\]`,
        'i'
      );
      const match = page.content.match(linkRegex);
      const contextStart = match
        ? Math.max(0, page.content.indexOf(match[0]) - 40)
        : 0;
      const contextEnd = match
        ? Math.min(
            page.content.length,
            page.content.indexOf(match[0]) + match[0].length + 40
          )
        : 0;
      const context = match
        ? `...${page.content.slice(contextStart, contextEnd)}...`
        : undefined;

      return {
        id: page.id,
        title: page.title,
        context,
      };
    });
}

export function getWikiPageVersions(pageId: string): WikiPageVersion[] {
  return wikiVersions[pageId] || [];
}

export function getAllTags(): string[] {
  const tagsSet = new Set<string>();

  wikiPages.forEach((page) => {
    page.tags.forEach((tag) => tagsSet.add(tag));
  });

  return Array.from(tagsSet);
}
