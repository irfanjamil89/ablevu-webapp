import React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "df-messenger": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          "project-id"?: string;
          "agent-id"?: string;
          "language-code"?: string;
          "max-query-length"?: string;
          intent?: string;
          "storage-option"?: string;
          location?: string;
          "url-allowlist"?: string;
        },
        HTMLElement
      >;
      "df-messenger-chat-bubble": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          "chat-title"?: string;
          "chat-subtitle"?: string;
          expanded?: boolean;
          "chat-icon"?: string;
          "chat-title-icon"?: string;
        },
        HTMLElement
      >;
    }
  }
}