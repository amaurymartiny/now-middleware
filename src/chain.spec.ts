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
import type { NextFunction, Request, Response } from 'express';

import { chain } from './chain';

describe('chain', () => {
	it('should work', () => {
		// A dummy Express middleware
		function dummyMiddleware(
			req: Request,
			_res: Response,
			next: NextFunction
		): void {
			req.headers.foo = 'foo';
			next();
		}

		// A dummy ZEIT now handler
		function dummyHandler(req: NowRequest, res: NowResponse): void {
			expect(req.headers.foo).toBe('foo');

			res.send('bar');
		}

		const req = { headers: {} } as NowRequest;
		const res = ({
			send: jest.fn(),
		} as unknown) as NowResponse;

		chain(dummyMiddleware)(dummyHandler)(req, res) as void;
		expect(res.send).toHaveBeenCalledWith('bar');
	});

	it('should work deal with error sended as param of next', () => {
		// A dummy Express middleware
		function errorMiddleware(
			_req: Request,
			_res: Response,
			next: NextFunction
		): void {
			next(new Error('errorMiddleware'));
		}

		function errorCatchMiddleware(
			err: Error,
			_req: Request,
			res: Response,
			next: NextFunction
		): void {
			if (err) {
				res.send(err.message);
				return;
			}
			next();
		}

		// A dummy ZEIT now handler
		function dummyHandler(req: NowRequest, res: NowResponse): void {
			expect(req.headers.foo).toBe('foo');

			res.send('bar');
		}

		const req = { headers: {} } as NowRequest;
		const res = ({
			send: jest.fn(),
		} as unknown) as NowResponse;

		chain(errorMiddleware, errorCatchMiddleware)(dummyHandler)(
			req,
			res
		) as void;
		expect(res.send).toHaveBeenCalledWith('errorMiddleware');
		expect(res.send).not.toHaveBeenCalledWith('bar');
	});

	it('should work deal with error when thrown in the middleware', () => {
		// A dummy Express middleware
		function errorThrowMiddleware(
			_req: Request,
			_res: Response,
			_next: NextFunction
		): void {
			throw new Error('errorThrowMiddleware');
		}

		function errorCatchMiddleware(
			err: Error,
			_req: Request,
			res: Response,
			next: NextFunction
		): void {
			if (err) {
				res.send(err.message);
				return;
			}
			next();
		}

		// A dummy ZEIT now handler
		function dummyHandler(req: NowRequest, res: NowResponse): void {
			expect(req.headers.foo).toBe('foo');

			res.send('bar');
		}

		const req = { headers: {} } as NowRequest;
		const res = ({
			send: jest.fn(),
		} as unknown) as NowResponse;

		chain(errorThrowMiddleware, errorCatchMiddleware)(dummyHandler)(
			req,
			res
		) as void;
		expect(res.send).toHaveBeenCalledWith('errorThrowMiddleware');
		expect(res.send).not.toHaveBeenCalledWith('bar');
	});
});
