import { defineManifest } from '@crxjs/vite-plugin';

export default defineManifest({
  manifest_version: 3,
  name: 'PRsense — AI PR review',
  description: 'Inline AI code review on every GitHub pull request.',
  version: '0.0.1',
  action: {
    default_title: 'PRsense',
    default_popup: 'src/popup/index.html',
  },
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['https://github.com/*/pull/*'],
      js: ['src/content/index.ts'],
      run_at: 'document_idle',
    },
  ],
  permissions: ['identity', 'storage'],
  host_permissions: ['https://api.github.com/*', 'https://prsense.app/*', 'http://localhost:3000/*'],
  icons: {
    '16': 'src/assets/icon-16.png',
    '48': 'src/assets/icon-48.png',
    '128': 'src/assets/icon-128.png',
  },
});
