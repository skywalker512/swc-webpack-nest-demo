/* eslint-disable @typescript-eslint/no-var-requires */
const zeroEks = require('0x');
const path = require('path');

async function capture() {
  const opts = {
    argv: [path.join(__dirname, 'build/hmr.js')],
    workingDir: __dirname,
    onPort: `autocannon http://localhost:3000/graphql -c 200  -m POST -b c'{"query":"query ExampleQuery($authorId: Int{\n  author(id: $authorId) {\n    id\n  }\n}\n","variables":{"authorId":0},"operationName":"ExampleQuery"}\'  -H "content-type: application/json"`,
  };
  try {
    const file = await zeroEks(opts);
    console.log(`flamegraph in ${file}`);
  } catch (e) {
    console.error(e);
  }
}

capture();
