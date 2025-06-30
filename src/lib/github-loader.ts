import {GithubRepoLoader} from '@langchain/community/document_loaders/web/github';

export const loadGithubRepo= async(githubUrl: string, githubToken?:string)=> {
  const loader = new GithubRepoLoader(githubUrl, {
    accessToken: githubToken || process.env.GITHUB_TOKEN,
    branch: 'main',
    ignoreFiles: ['.gitignore', 'README.md', 'LICENSE', 'CONTRIBUTING.md', 'CODE_OF_CONDUCT.md','package-lock.json', 'yarn.lock', 'pnpm-lock.yaml','bun.lock','bun.lockb'],
    ignorePaths: ['node_modules', 'dist', 'build', 'out', 'coverage', '.next', '.nuxt', '.vercel', '.output', '.cache','.vscode', '.idea', '.git'],
    recursive: true,
    unknown: 'warn',
    maxConcurrency: 5
  });
  const docs = await loader.load();
  return docs
}
