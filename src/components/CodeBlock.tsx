import { useState } from 'react';
import type { AnimationDef } from '../types';
import { highlightCode } from '../data/utils';

interface CodeBlockProps {
  animation: AnimationDef;
}

export function CodeBlock({ animation }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(animation.code()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <section>
      <div className="section-label">Source Code</div>
      <div className="code-box">
        <div className="code-header">
          <span className="code-title">point(progress, time) &rarr; &#123;x, y&#125;</span>
          <button
            className={`copy-btn${copied ? ' copied' : ''}`}
            onClick={handleCopy}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre>
          <code dangerouslySetInnerHTML={{ __html: highlightCode(animation.code()) }} />
        </pre>
      </div>
    </section>
  );
}
