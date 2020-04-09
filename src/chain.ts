// @amaurymartiny/now-middleware
// Copyright (C) 2020 Amaury Martiny

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { NowRequest, NowResponse } from '@now/node';
import { RequestHandler } from 'express';

type AsyncVoid = void | Promise<void>;

/**
 * A ZEIT Now lambda function.
 */
export type NowFunction<Req, Res> = (req: Req, res: Res) => AsyncVoid;

/**
 * Combine multiple middleware together.
 *
 * @param middlewares - Functions of form: `function(req, res, next) { ... }`, aka
 * express middlewares.
 *
 * @return - Single combined middleware
 */
function combineMiddleware(middlewares: RequestHandler[]): RequestHandler {
  return middlewares.reduce((acc, mid) => {
    return function (req, res, next): void {
      acc(req, res, (err) => {
        if (err) {
          return next(err);
        }

        mid(req, res, next);
      });
    };
  });
}

/**
 * Chain middlewares together, and expose them to be consumed by a `@now/node`
 * serverless function.
 *
 * @param middlewares - Functions of form: `function(req, res, next) { ... }`, aka
 * express middlewares.
 */
export function chain<Req = NowRequest, Res = NowResponse>(
  ...middlewares: RequestHandler[]
): (fn: NowFunction<Req, Res>) => NowFunction<Req, Res> {
  return function (fn: NowFunction<Req, Res>): NowFunction<Req, Res> {
    return function (req: Req, res: Res): AsyncVoid {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore Need to cast (and verify everything works) from a
      // express.Request to a NowRequest
      return combineMiddleware(middlewares)(req, res, () => {
        fn(req, res);
      });
    };
  };
}
