import { Router } from 'express';

/**
 *
 * @public
 */
export function encryptedStoreMiddleware(args: {
  apiRoutes: string[];
}): Router {
  const router = Router();

  router.use((req, res, next) => {
    const originalSend = res.send;

    console.log('req path', req.path);
    console.log('args', args);

    res.send = function (body: any): any {
      if (res.statusCode === 200 && body) {
        console.log('encryptedStoreMiddleware', body);
      }

      originalSend.call(this, body);
    };
    next();
  });
  return router;
}
