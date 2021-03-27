# NestJS 快速 build demo

- 使用 swc 转义 ts
  - esbuild 不能处理 emitDecoratorMetadata
  - swc 比不进行 type 检查的 tsc 要快上几倍
  - todo 等待 swc 转义之后类名的处理和 tsc 不用

- 使用 esbuild 处理 minimize
  - swc 的 minimize 效果很差
  - esbuild 要比 swc 快 1 到 3 倍
  - 能够在 minimize 之后还能保持类名

- 使用 webpack 做打包
  - 能够很好的兼容 commonjs 生态 (rollup 有很多问题)
  - 抄了部分 ncc 对于 webpack 打包 nodejs 项目的处理
    - 尽量的使用 nodejs 的 require
    - 静态资源依赖于 @vercel/webpack-asset-relocator-loader
  - filesystem cache 很强大
  - 支持 hmr

- TODO
  - v8 cache (? 测试了启动时间并没有减少)
  - nx.dev
  

