import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';

const MarkdownRenderer = ({ content }) => {
  const preprocessMarkdown = (text) => {
    if (!text) return '';
    return text
      // Fix spaces before closing italics asterisk (Obsidian allows it, standard MD does not)
      .replace(/\*(.*?)\s+\*/g, '*$1*')
      // Remove greetings
      .replace(/добрий\s+ран(ок|о)[!.,]?\s*/gi, '')
      .replace(/добрий\s+день[!.,]?\s*/gi, '')
      // Verse styling: Extracts number from old format "> **10 text**"
      .replace(/^>\s*\*\*(\d+)\s+(.*?)\*\*/gm, '> <span class="verse-num">$1</span> <span class="verse-text">$2</span>')
      // Verse styling: Extracts number from new format "> **10** text"
      .replace(/^>\s*\*\*(\d+)\*\*\s+(.*)$/gm, '> <span class="verse-num">$1</span> <span class="verse-text">$2</span>')
      // Catch format without number: > **текст...**
      .replace(/^>\s*\*\*(?!\s*\d)(.*?)\*\*/gm, '> <span class="verse-text">$1</span>')
      // Verse styling: Extracts raw number "> 10 text" (ignores lists like "1. ")
      .replace(/^>\s*(\d+)(?!\.)\s+(.*)$/gm, '> <span class="verse-num">$1</span> <span class="verse-text">$2</span>')
      // Text definitions highlight
      .replace(/==(.*?)==/g, '<mark class="highlight-blue">$1</mark>')
      // Obsidian callouts
      .replace(/^>\s*\[!QUOTE\](.*)$/gm, '> <strong class="callout-title">$1</strong>\n>')
      .replace(/^>\s*\[!WARNING\](.*)$/gm, '> <strong class="callout-title warning">⚠️ $1</strong>\n>');
  };

  return (
    <ReactMarkdown 
      remarkPlugins={[remarkGfm, remarkBreaks]}
      rehypePlugins={[rehypeRaw]}
      components={{
        blockquote: ({node, ...props}) => <blockquote className="obsidian-quote" {...props} />
      }}
    >
      {preprocessMarkdown(content)}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
