import { NowRequest, NowResponse } from '@now/node';
import { NextFunction, Request, Response } from 'express';

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
      send: jest.fn()
    } as unknown) as NowResponse;

    chain(dummyMiddleware)(dummyHandler)(req, res);
    expect(res.send).toHaveBeenCalledWith('bar');
  });
});
