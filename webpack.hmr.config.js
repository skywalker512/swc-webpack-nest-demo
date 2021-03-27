const path = require('path');
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'none',
  amd: false,
  watch: true,
  optimization: {
    nodeEnv: false,
    minimize: false,
    moduleIds: 'deterministic',
    chunkIds: 'deterministic',
    mangleExports: true,
    concatenateModules: true,
    innerGraph: true,
    sideEffects: true,
  },
  stats: {
    logging: 'error',
  },
  infrastructureLogging: {
    level: 'error',
  },
  node: false,
  target: 'node',
  entry: ['webpack/hot/poll?100', path.join(__dirname, 'src', 'main.ts')],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'hmr.js',
    libraryTarget: 'commonjs2',
    strictModuleExceptionHandling: true,
  },
  externals: [
    nodeExternals({
      allowlist: ['webpack/hot/poll?100']
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [{
          loader: require.resolve('swc-loader'),
          options: {
            'jsc': {
              'loose': true,
              'target': 'es2020',
              'parser': {
                'syntax': 'typescript',
                'decorators': true,
              },
              'transform': {
                'legacyDecorator': true,
                'decoratorMetadata': true,
              },
            },
            'module': {
              'type': 'commonjs',
              'strict': false,
              'strictMode': true,
              'lazy': false,
              'noInterop': false,
            },
          },
        }],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
};
