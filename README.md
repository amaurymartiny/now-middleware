[![Actions Status](https://github.com/amaurym/now-middleware/workflows/pr/badge.svg)](https://github.com/amaurym/now-middleware/actions)
[![npm (scoped)](https://img.shields.io/npm/v/@amaurym/now-middleware.svg)](https://www.npmjs.com/package/@amaurym/now-middleware)
[![dependencies Status](https://david-dm.org/amaurym/now-middleware/status.svg)](https://david-dm.org/amaurym/now-middleware)
[![Buy me a tree](https://img.shields.io/badge/Buy%20me%20a%20tree-%F0%9F%8C%B3-lightgreen)](https://offset.earth/amaurym)

<br /><br /><br />

<h1 align="center">now-middleware</h1>
<h4 align="center">Chain Express middlewares with Vercel Serverless Functions.</h4>

<br /><br /><br />

## Installation

```bash
yarn add @amaurym/now-middleware
```

## Usage

The package exposes one `chain` function.

```typescript
import { chain } from '@amaurym/now-middleware';
import { NowRequest, NowResponse } from '@vercel/node';

// Import a couple of Express middlewares
import cors from 'cors'; // Enable cross-origin resource sharing (CORS) with various options
import morgan from 'morgan'; // HTTP request logger

async function handler(_req: NowRequest, res: NowResponse): Promise<void> {
  // This is your normal ZEIT Now function.
  res.send('Everything OK.');
}

// Chain some middlewares before calling the ZEIT Now serverless function
export default chain(cors(), morgan('common'))(handler);
```

## Learn More

- Vercel Serverless Functions: https://vercel.com/docs/v2/serverless-functions/introduction
- Express middlewares: https://expressjs.com/en/guide/using-middleware.html
