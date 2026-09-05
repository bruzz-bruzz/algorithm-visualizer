type Data = {
  repo: string;
  author?: string;
  authorUrl?: string;
};

/**
 * Small GitHub-style attribution component, sized to live in the footer.
 * Links out to the project repo, the author's profile, and shows the license.
 */
export default function Github({ repo, author = 'bruzz-bruzz', authorUrl = 'https://github.com/bruzz-bruzz' }: Data) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-500">
      <span>Built with React, TypeScript, and TailwindCSS</span>
      <span className="hidden sm:inline text-slate-700">•</span>
      <a
        href={authorUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-primary-400 underline underline-offset-2 transition-colors"
      >
        @{author}
      </a>
      <span className="hidden sm:inline text-slate-700">•</span>
      <a
        href={repo}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-primary-400 underline underline-offset-2 transition-colors inline-flex items-center gap-1"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.16c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.4-5.27 5.68.41.36.78 1.07.78 2.17v3.22c0 .31.21.67.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
        </svg>
        View on GitHub
      </a>
      <span className="hidden sm:inline text-slate-700">•</span>
      <span>MIT License</span>
    </div>
  );
}
