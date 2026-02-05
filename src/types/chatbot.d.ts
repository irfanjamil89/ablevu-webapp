// types/chatbot.d.ts

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'df-messenger': {
        'project-id'?: string;
        'agent-id'?: string;
        'language-code'?: string;
        'max-query-length'?: string;
        'intent'?: string;
        'storage-option'?: string;
        'location'?: string;
        'url-allowlist'?: string;
        children?: React.ReactNode;
      };
      'df-messenger-chat-bubble': {
        'chat-title'?: string;
        'chat-subtitle'?: string;
        'expanded'?: boolean;
        'chat-icon'?: string;
        'chat-title-icon'?: string;
      };
    }
  }
}

export {};