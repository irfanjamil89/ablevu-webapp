// src/app/component/Chatbot.tsx
'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function Chatbot() {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/themes/df-messenger-default.css';
    document.head.appendChild(link);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  return (
    <>
      <Script
        src="https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js"
        strategy="lazyOnload"
      />

      <style jsx global>{`
        .chatbot-container {
          position: fixed;
          bottom: 10px;
          right: 20px;
          z-index: 9999;
        }

        df-messenger {
          --df-messenger-chat-bubble-size: 58px;
          --df-messenger-chat-bubble-icon-size: 52px;
          --df-messenger-titlebar-icon-width: 32px;
          --df-messenger-titlebar-icon-height: 32px;
        }

        .visually-hidden {
          position: absolute !important;
          height: 1px;
          width: 1px;
          overflow: hidden;
          clip: rect(1px, 1px, 1px, 1px);
          white-space: nowrap;
        }

        :where(a, button, input, select, textarea, [tabindex]) {
          outline: 2px solid transparent;
          outline-offset: 2px;
        }

        :where(a, button, input, select, textarea, [tabindex]):focus-visible {
          outline: 3px solid #2b7cff;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <section className="chatbot-container" aria-label="Chat">
        <section aria-labelledby="chat-label">
          <h2 id="chat-label" className="visually-hidden">
            AbleVu Assistant
          </h2>
          {/* @ts-expect-error - Web component not recognized by TypeScript */}
          <df-messenger
            project-id="ablevu-2"
            agent-id="2659afb8-bfbf-4610-b0c2-1c37d55d5d8b"
            language-code="en"
            max-query-length="-1"
            intent="HelloWelcome"
            storage-option="none"
            location="us-central1"
            url-allowlist="https://cozy-narwhal-217323.netlify.app/"
          >
            {/* @ts-expect-error - Web component not recognized by TypeScript */}
            <df-messenger-chat-bubble
              chat-title="AbleBot"
              chat-subtitle="Ask about accessibility by city & features"
              expanded
              chat-icon="https://cozy-narwhal-217323.netlify.app/Ablebot-Logo.png"
              chat-title-icon="https://cozy-narwhal-217323.netlify.app/Ablebot-Logo.png"
            >
              {/* @ts-expect-error - Web component not recognized by TypeScript */}
            </df-messenger-chat-bubble>
            {/* @ts-expect-error - Web component not recognized by TypeScript */}
          </df-messenger>
        </section>
      </section>
    </>
  );
}