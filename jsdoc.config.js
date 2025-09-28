module.exports = {
  source: {
    include: ['./src'],
    includePattern: '\\.(js|jsx|ts|tsx)$',
    exclude: ['node_modules/', 'dist/', 'build/', '**/*.test.*', '**/*.spec.*'],
  },
  opts: {
    destination: './docs/generated/',
    recurse: true,
  },
  plugins: [
    'plugins/markdown',
    'node_modules/jsdoc-plugin-typescript',
  ],
  typescript: {
    moduleRoot: './src',
  },
  templates: {
    cleverLinks: false,
    monospaceLinks: false,
  },
  markdown: {
    parser: 'gfm',
  },
};
