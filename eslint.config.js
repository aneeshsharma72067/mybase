import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Downgraded to a warning: the app deliberately uses effects to mirror
      // external state into local state (mount/unmount animations, populating
      // modal forms from the store on open). These are legitimate
      // synchronization effects, not the cascading-render anti-pattern the rule
      // targets, so they should not fail CI.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
])
