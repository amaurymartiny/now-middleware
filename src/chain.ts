// @amaurym/now-middleware
// Copyright (C) 2020-2021 Amaury

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

import type { NowRequest, NowResponse } from '@vercel/node';
import type {
	ErrorRequestHandler,
	NextFunction,
	Request,
	RequestHandler,
	Response,
} from 'express';

type AsyncVoid = void | Promise<void>;

/**
 * A ZEIT Now lambda function.
 */
export type NowFunction<Req, Res> = (req: Req, res: Res) => AsyncVoid;

function reduceMiddleware(
	acc: RequestHandler,
	mid: RequestHandler | ErrorRequestHandler
): RequestHandler {
	return function (req: Request, res: Response, next: NextFunction): void {
		acc(req, res, (err: string) => {
			if (err) {
				if (mid.length === 4) {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore FIXME If anyone knows how to fix this...
					return mid(err, req, res, next);
				}
				return next(err);
			}
			if (mid.length === 4) {
				return next();
			}
			try {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore FIXME If anyone knows how to fix this...
				mid(req, res, next, undefined);
			} catch (e) {
				next(e);
			}
		});
	};
}
/**
 * Combine multiple middleware together.
 *
 * @param middlewares - Functions of form: `function(req, res, next) { ... }` or `function(err, req, res, next) { ... }`, aka
 * express middlewares.
 *
 * @return - Single combined middleware
 */
function combineMiddleware(
	middlewares: (RequestHandler | ErrorRequestHandler)[]
): RequestHandler | ErrorRequestHandler {
	return middlewares.reduce(
		reduceMiddleware,
		(_req: Request, _res: Response, next: NextFunction) => next()
	);
}

/**
 * Chain middlewares together, and expose them to be consumed by a `@vercel/node`
 * serverless function.
 *
 * @param middlewares - Functions of form: `function(req, res, next) { ... }`, aka
 * express middlewares.
 */
export function chain<Req = NowRequest, Res = NowResponse>(
	...middlewares: (RequestHandler | ErrorRequestHandler)[]
): (fn: NowFunction<Req, Res>) => NowFunction<Req, Res> {
	return function (fn: NowFunction<Req, Res>): NowFunction<Req, Res> {
		return function (req: Req, res: Res): AsyncVoid {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore Need to cast (and verify everything works) from a
			// express.Request to a NowRequest
			return combineMiddleware(middlewares)(req, res, () => {
				fn(req, res) as void;
			});
		};
	};
}
