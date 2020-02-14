[![Actions Status](https://github.com/amaurymartiny/now-middleware/workflows/CI/badge.svg)](https://github.com/amaurymartiny/now-middleware/actions)
[![npm (scoped)](https://img.shields.io/npm/v/@amaurymartiny/now-middleware.svg)](https://www.npmjs.com/package/@amaurymartiny/now-middleware)
[![dependencies Status](https://david-dm.org/amaurymartiny/now-middleware/status.svg)](https://david-dm.org/amaurymartiny/now-middleware)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@amaurymartiny/now-middleware.svg)
![npm bundle size](https://img.shields.io/bundlephobia/min/@amaurymartiny/now-middleware.svg)
[![Buy me a tree](https://img.shields.io/badge/Buy%20me%20a%20tree-%F0%9F%8C%B3-lightgreen)](https://offset.earth/amaurymartiny)

<br /><br /><br />

<h1 align="center">now-middleware</h1>
<h4 align="center">Chain Express middlewares with ZEIT Now serverless functions.</h4>

<br /><br /><br />

## Installation

```bash
yarn add @amaurymartiny/now-middleware
```

## Usage

The package exposes one `chain` function.

```typescript
import { chain } from '@amaurymartiny/now-middleware';
import { NowRequest, NowResponse } from '@now/node';

// Import a couple of Express middlewares
import cors from 'cors'; // Enable cross-origin resource sharing (CORS) with various options.
import morgan from 'morgan'; // HTTP request logger.

async function handler(_req: NowRequest, res: NowResponse): Promise<void> {
  // This is your normal ZEIT Now function.
}

// Chain some middlewares before calling the ZEIT Now serverless function
export default chain(cors(), morgan('common'))(handler);
```

## Learn More

- ZEIT Now serverless functions: https://zeit.co/docs/v2/serverless-functions/introduction
- Express middlewares: https://expressjs.com/en/guide/using-middleware.html
