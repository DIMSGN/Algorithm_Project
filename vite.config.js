import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// If deploying to GitHub Pages at https://username.github.io/repo-name/
// set REPO_NAME=repo-name (GitHub Actions will export this) so assets use correct subpath.
const repoName = process.env.REPO_NAME || '';
const base = repoName ? `/${repoName}/` : '/';

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
})
