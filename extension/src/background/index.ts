import { API_BASE_URL } from '../config';
import { getStoredToken, signIn, signOut } from './auth';

type Message =
  | { type: 'SIGN_IN' }
  | { type: 'SIGN_OUT' }
  | { type: 'GET_TOKEN' }
  | { type: 'REVIEW_PR'; payload: ReviewRequest };

interface ReviewRequest {
  diff: string;
  prTitle: string;
  prDescription: string;
  repo: string;
}

chrome.runtime.onMessage.addListener((message: Message, _sender, sendResponse) => {
  void handle(message)
    .then((result) => sendResponse({ ok: true, result }))
    .catch((err) => sendResponse({ ok: false, error: err instanceof Error ? err.message : 'Unknown error' }));
  return true;
});

async function handle(message: Message): Promise<unknown> {
  switch (message.type) {
    case 'SIGN_IN':
      return signIn();
    case 'SIGN_OUT':
      await signOut();
      return null;
    case 'GET_TOKEN':
      return getStoredToken();
    case 'REVIEW_PR':
      return reviewPr(message.payload);
  }
}

async function reviewPr(payload: ReviewRequest) {
  const token = await getStoredToken();
  if (!token) throw new Error('Not signed in');

  const res = await fetch(`${API_BASE_URL}/api/review`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Review API ${res.status}: ${text}`);
  }
  return res.json();
}
