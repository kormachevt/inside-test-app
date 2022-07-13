module.exports = {
  '!(src/infrastructure/shared/persistence/prisma/seed.ts)*.{js,ts}': [
    'prettier --check --write --ignore-unknown',
    'eslint --cache --color --fix',
    () => 'tsc --pretty --noEmit'
  ],
  '!*.{js,ts}': ['prettier --check --write --ignore-unknown'],
  '{README.md,TODO.md,.github/*.md,src/**/*.ts}': ['cspell']
};
