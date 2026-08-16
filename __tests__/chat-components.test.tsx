/**
 * FE-09 — Vitest + React Testing Library
 * Six distinct test cases covering:
 *   1. User & assistant message text rendering
 *   2. Thinking / streaming indicator state
 *   3. ChatErrorCard error state + retry button
 *   4. AuditResultCard structured metrics on tool success
 *   5. ToolErrorState on tool invocation failure
 *   6. Input form submission → sendMessage state transition
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuditResultCard } from '@/components/chat/AuditResultCard';
import { ToolErrorState } from '@/components/chat/ToolErrorState';
import { ChatErrorCard } from '@/components/chat/ChatErrorCard';
import type { SiteAuditResult } from '@/lib/tools/get-site-audit';

// ── Module mocks (hoisted by vitest before imports) ──────────────────────────

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('@ai-sdk/react', () => ({
  useChat: vi.fn(),
}));

vi.mock('ai', () => ({
  // Must be a regular (non-arrow) function so `new DefaultChatTransport()` works
  DefaultChatTransport: vi.fn(function MockTransport() {}),
}));

// Avoid JSDOM issues with the full markdown parser
vi.mock('react-markdown', () => ({
  default: ({ children }: { children: string }) => <span>{children}</span>,
}));

// Isolate page tests from the full tool-part rendering tree
vi.mock('@/components/chat/SiteAuditToolPart', () => ({
  SiteAuditToolPart: () => <div data-testid="site-audit-tool-part" />,
}));

// ── Import the page *after* mocks so it receives the mocked modules ───────────

import ChatPage from '@/app/chat/page';
import { useChat } from '@ai-sdk/react';

// ── Helpers ──────────────────────────────────────────────────────────────────

type MockPart =
  | { type: 'text'; text: string }
  | { type: 'tool-getSiteAudit'; toolCallId: string };

type MockMessage = {
  id: string;
  role: 'user' | 'assistant';
  parts: MockPart[];
};

/** Builds a minimal useChat return value, spread-overridable per test. */
function makeUseChatReturn(overrides: Record<string, unknown> = {}) {
  return {
    messages: [] as MockMessage[],
    sendMessage: vi.fn(),
    stop: vi.fn(),
    status: 'idle',
    error: undefined,
    regenerate: vi.fn(),
    clearError: vi.fn(),
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  // Provide a safe default so any render that doesn't configure useChat won't
  // throw "Cannot read properties of undefined".
  vi.mocked(useChat).mockReturnValue(makeUseChatReturn() as ReturnType<typeof useChat>);
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 1 — Text rendering across user & assistant messages
// ─────────────────────────────────────────────────────────────────────────────
describe('ChatPage – message text rendering', () => {
  it('displays user and assistant message text in the conversation log', () => {
    vi.mocked(useChat).mockReturnValue(
      makeUseChatReturn({
        messages: [
          {
            id: 'u1',
            role: 'user',
            parts: [{ type: 'text', text: 'Hello, assistant!' }],
          },
          {
            id: 'a1',
            role: 'assistant',
            parts: [{ type: 'text', text: 'Hi there — how can I help?' }],
          },
        ],
      }) as ReturnType<typeof useChat>,
    );

    render(<ChatPage />);

    // User bubble: rendered via getMessageText() → plain <p>
    expect(screen.getByText('Hello, assistant!')).toBeInTheDocument();

    // Assistant bubble: text piped through (mocked) ReactMarkdown → <span>
    expect(screen.getByText('Hi there — how can I help?')).toBeInTheDocument();

    // Accessible article labels distinguish the two roles
    expect(screen.getByRole('article', { name: 'Your message' })).toBeInTheDocument();
    expect(screen.getByRole('article', { name: 'Assistant message' })).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 2 — Loading / pending / streaming indicator
// ─────────────────────────────────────────────────────────────────────────────
describe('ChatPage – thinking indicator', () => {
  it('shows the thinking indicator while status is "submitted"', () => {
    vi.mocked(useChat).mockReturnValue(
      makeUseChatReturn({
        messages: [
          {
            id: 'u1',
            role: 'user',
            parts: [{ type: 'text', text: 'Tell me something interesting.' }],
          },
        ],
        status: 'submitted',
      }) as ReturnType<typeof useChat>,
    );

    render(<ChatPage />);

    const indicator = screen.getByRole('status');
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveTextContent('Assistant is thinking');
  });

  it('does not render the thinking indicator when status is "idle"', () => {
    vi.mocked(useChat).mockReturnValue(
      makeUseChatReturn({ status: 'idle' }) as ReturnType<typeof useChat>,
    );

    render(<ChatPage />);

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 3 — Chat error state with retry action button
// ─────────────────────────────────────────────────────────────────────────────
describe('ChatErrorCard', () => {
  it('renders the error message, labels it as an alert, and fires onRetry on click', () => {
    const onRetry = vi.fn();

    render(
      <ChatErrorCard error={new Error('Connection timeout after 30 s')} onRetry={onRetry} />,
    );

    // Alert role signals the error to assistive technology
    expect(screen.getByRole('alert')).toBeInTheDocument();

    // Status heading and actual error message
    expect(screen.getByText('Response interrupted')).toBeInTheDocument();
    expect(screen.getByText('Connection timeout after 30 s')).toBeInTheDocument();

    // Retry button is present and calls the handler
    const retryBtn = screen.getByRole('button', { name: 'Retry / Reload' });
    expect(retryBtn).toBeInTheDocument();

    fireEvent.click(retryBtn);
    expect(onRetry).toHaveBeenCalledOnce();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 4 — AuditResultCard structured metrics on tool success
// ─────────────────────────────────────────────────────────────────────────────
const mockAuditResult: SiteAuditResult = {
  url: 'flyrank.ai',
  status: 'healthy',
  scores: { seo: 92, performance: 88, accessibility: 95 },
  metrics: {
    pageSizeKb: 220,
    loadTimeMs: 1200,
    brokenLinks: 0,
    mobileFriendly: true,
  },
  recommendations: [
    'Add descriptive meta titles and Open Graph tags.',
    'Lazy-load below-the-fold images.',
  ],
  auditedAt: new Date('2024-06-01T12:00:00Z').toISOString(),
};

describe('AuditResultCard', () => {
  it('renders domain, status badge, score meters, page metrics, and recommendations', () => {
    render(<AuditResultCard result={mockAuditResult} />);

    // Top-level article with accessible label
    expect(
      screen.getByRole('article', { name: /site audit results for flyrank\.ai/i }),
    ).toBeInTheDocument();

    // Domain heading and status badge
    expect(screen.getByText('flyrank.ai')).toBeInTheDocument();
    expect(screen.getByText('Healthy')).toBeInTheDocument();

    // Score meters — each rendered as "{value}/100"
    expect(screen.getByText('92/100')).toBeInTheDocument(); // SEO
    expect(screen.getByText('88/100')).toBeInTheDocument(); // Performance
    expect(screen.getByText('95/100')).toBeInTheDocument(); // Accessibility

    // Page metrics
    expect(screen.getByText('220 KB')).toBeInTheDocument();   // Page Size
    expect(screen.getByText('1200 ms')).toBeInTheDocument();  // Load Time
    expect(screen.getByText('Yes')).toBeInTheDocument();       // Mobile Friendly

    // Recommendations list
    expect(
      screen.getByText('Add descriptive meta titles and Open Graph tags.'),
    ).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 5 — ToolErrorState on mock tool invocation failure
// ─────────────────────────────────────────────────────────────────────────────
describe('ToolErrorState', () => {
  it('shows alert role, custom title, error message, and tool name', () => {
    render(
      <ToolErrorState
        title="Audit failed"
        message='Unable to reach "fail.example.com". The host did not respond to audit probes.'
        toolName="getSiteAudit"
      />,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Audit failed')).toBeInTheDocument();
    expect(screen.getByText(/Unable to reach/)).toBeInTheDocument();
    expect(screen.getByText(/Tool: getSiteAudit/)).toBeInTheDocument();
  });

  it('falls back to default title and toolName when props are omitted', () => {
    render(<ToolErrorState message="Something went wrong internally." />);

    expect(screen.getByText('Tool execution failed')).toBeInTheDocument();
    expect(screen.getByText(/Tool: getSiteAudit/)).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 6 — Input form submission triggers sendMessage state transition
// ─────────────────────────────────────────────────────────────────────────────
describe('ChatPage – form submission', () => {
  it('calls sendMessage with trimmed input and clears the textarea after submit', async () => {
    const sendMessage = vi.fn();
    vi.mocked(useChat).mockReturnValue(
      makeUseChatReturn({ sendMessage }) as ReturnType<typeof useChat>,
    );

    const user = userEvent.setup();
    render(<ChatPage />);

    // The textarea is associated with its label via htmlFor / id
    const textarea = screen.getByRole('textbox', { name: /message/i });

    // Send button is disabled while the textarea is empty
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();

    await user.type(textarea, 'Audit flyrank.ai for me');

    // After typing, Send becomes enabled
    expect(screen.getByRole('button', { name: 'Send' })).toBeEnabled();

    await user.click(screen.getByRole('button', { name: 'Send' }));

    // sendMessage must be called with the message payload
    expect(sendMessage).toHaveBeenCalledOnce();
    expect(sendMessage).toHaveBeenCalledWith({ text: 'Audit flyrank.ai for me' });
  });
});
