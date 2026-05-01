interface BackgroundResponse<T> {
  ok: boolean;
  result?: T;
  error?: string;
}

async function send<T>(message: unknown): Promise<T> {
  const res = (await chrome.runtime.sendMessage(message)) as BackgroundResponse<T>;
  if (!res.ok) throw new Error(res.error ?? 'Background error');
  return res.result as T;
}

const statusEl = document.getElementById('status') as HTMLDivElement;
const signInBtn = document.getElementById('sign-in') as HTMLButtonElement;
const signOutBtn = document.getElementById('sign-out') as HTMLButtonElement;

async function refresh() {
  const token = await send<string | null>({ type: 'GET_TOKEN' });
  if (token) {
    statusEl.textContent = 'Signed in';
    signInBtn.hidden = true;
    signOutBtn.hidden = false;
  } else {
    statusEl.textContent = 'Not signed in';
    signInBtn.hidden = false;
    signOutBtn.hidden = true;
  }
}

signInBtn.addEventListener('click', async () => {
  statusEl.textContent = 'Signing in…';
  try {
    await send({ type: 'SIGN_IN' });
    await refresh();
  } catch (err) {
    statusEl.textContent = err instanceof Error ? err.message : 'Sign-in failed';
  }
});

signOutBtn.addEventListener('click', async () => {
  await send({ type: 'SIGN_OUT' });
  await refresh();
});

void refresh();
