import { useState, useMemo } from 'react';
import type { AnimationDef, LiveConfig } from '../types';
import { highlightCode } from '../data/utils';
import { generateStandaloneHTML } from '../data/generateHTML';

interface CodeBlockProps {
  animation: AnimationDef;
  liveConfig: LiveConfig;
}

export function CodeBlock({ animation, liveConfig }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<'html' | 'snippet'>('html');

  const htmlCode = useMemo(
    () => generateStandaloneHTML(animation, liveConfig),
    [animation, liveConfig],
  );

  const snippetCode = useMemo(
    () => animation.code(liveConfig),
    [animation, liveConfig],
  );

  const activeCode = tab === 'html' ? htmlCode : snippetCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${animation.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section>
      <div className="section-label">Source Code / 源代码</div>
      <div className="code-box">
        <div className="code-header">
          <div className="code-tabs">
            <button
              className={`code-tab${tab === 'html' ? ' active' : ''}`}
              onClick={() => setTab('html')}
            >
              HTML
            </button>
            <button
              className={`code-tab${tab === 'snippet' ? ' active' : ''}`}
              onClick={() => setTab('snippet')}
            >
              Snippet
            </button>
          </div>
          <div className="code-actions">
            {tab === 'html' && (
              <button className="copy-btn download-btn" onClick={handleDownload}>
                Download
              </button>
            )}
            <button
              className={`copy-btn${copied ? ' copied' : ''}`}
              onClick={handleCopy}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
        <pre>
          <code
            dangerouslySetInnerHTML={{
              __html: tab === 'html' ? highlightHTML(htmlCode) : highlightCode(snippetCode),
            }}
          />
        </pre>
      </div>
    </section>
  );
}

/** Minimal HTML syntax highlighting */
function highlightHTML(code: string): string {
  // First escape HTML entities for display
  let escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Highlight HTML tags
  escaped = escaped.replace(
    /(&lt;\/?)([\w-]+)([\s\S]*?)(&gt;)/g,
    (_, open, tag, attrs, close) => {
      const highlightedAttrs = attrs.replace(
        /([\w-]+)(=)(&quot;[^&]*&quot;)/g,
        '<span class="attr">$1</span>$2<span class="str">$3</span>',
      );
      return `${open}<span class="kw">${tag}</span>${highlightedAttrs}${close}`;
    },
  );

  // Highlight JS inside <script> tags
  escaped = escaped.replace(
    /(&lt;script&gt;)([\s\S]*?)(&lt;\/script&gt;)/g,
    (_, open, js, close) => {
      return `${open}${highlightCode(js)}${close}`;
    },
  );

  return escaped;
}
