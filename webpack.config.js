const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const ESBuildMinimizerPlugin = require('@starfleet/esbuild-minimizer');

module.exports = {
  mode: 'none',
  amd: false,
  optimization: {
    nodeEnv: false,
    // minimize: false,
    minimize: true,
    minimizer: [
      new ESBuildMinimizerPlugin({
        minifyIdentifiers: false,
        minifyWhitespace: true,
        minifySyntax: false,
        keepNames: true,
      }),
    ],
    moduleIds: 'deterministic',
    chunkIds: 'deterministic',
    mangleExports: true,
    concatenateModules: true,
    innerGraph: true,
    sideEffects: true,
    usedExports: true,
  },
  externals: [
    'ts-morph',
    '@apollo/gateway',
    'apollo-server-testing',
    'fsevents',
    'graphql-tools'
  ],
  stats: {
    logging: 'error',
  },
  infrastructureLogging: {
    level: 'error',
  },
  node: false,
  target: 'node',
  entry: path.join(__dirname, 'src', 'main.ts'),
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    libraryTarget: 'commonjs2',
    strictModuleExceptionHandling: true,
  },
  module: {
    rules: [
      {
        test: /@@notfound\.js$/,
        use: [
          {
            loader: eval('__dirname + "/loaders/notfound-loader.js"'),
          },
        ],
      },
      {
        test: /\.(js|mjs|node)$/,
        use: [
          {
            loader: require.resolve('@vercel/webpack-asset-relocator-loader'),
            options: {
              escapeNonAnalyzableRequires: true,
              wrapperCompatibility: true,
            },
          },
        ],
      },
      // {
      //   test: /.tsx?$/,
      //   use: [
      //     {
      //       loader: 'ts-loader',
      //       options: {
      //         transpileOnly: true,
      //         configFile: path.resolve(__dirname, 'tsconfig.build.json'),
      //       },
      //     },
      //   ],
      //   exclude: /node_modules/,
      // },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('swc-loader'), // you would put swc-loader
            options: {
              jsc: {
                keepClassNames: true,
                loose: true,
                target: 'es2020',
                parser: {
                  syntax: 'typescript',
                  decorators: true,
                },
                transform: {
                  legacyDecorator: true,
                  decoratorMetadata: true,
                },
              },
              module: {
                type: 'commonjs',
                strict: false,
                strictMode: true,
                lazy: false,
                noInterop: false,
              },
            },
          },
        ],
      },
      {
        parser: { amd: false },
        exclude: /\.(node|json)$/,
        use: [
          {
            loader: require.resolve('shebang-loader'),
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
    plugins: [
      {
        apply(resolver) {
          const resolve = resolver.resolve;
          resolver.resolve = function (
            context,
            path,
            request,
            resolveContext,
            callback,
          ) {
            const self = this;
            resolve.call(
              self,
              context,
              path,
              request,
              resolveContext,
              function (err, innerPath, result) {
                if (result) return callback(null, innerPath, result);
                if (err && !err.message.startsWith("Can't resolve")) {
                  return callback(err);
                }
                callback(
                  null,
                  __dirname + '/@@notfound.js?' + request,
                  request,
                );
              },
            );
          };
        },
      },
    ],
  },
  plugins: [
    new BundleAnalyzerPlugin(),
  ],
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
};
