// commitlint.config.ts
const commitlintConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'test', 'refactor', 'chore', 'docs', 'perf']],
    'scope-enum': [
      2,
      'always',
      ['landing', 'dashboard', 'canvas', 'auth', 'room', 'common', 'infra', 'deps', 'readme'],
    ],
    'scope-empty': [2, 'never'],
    'subject-case': [2, 'always', 'sentence-case'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
  },
}

export default commitlintConfig
