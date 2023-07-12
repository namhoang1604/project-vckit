import { IAgent } from '@vckit/core-types';
import { NextFunction, Request, Response, Router } from 'express';

interface RequestWithAgent extends Request {
  agent?: IAgent;
}

/**
 *
 * @public
 */
export function encryptedStoreMiddleware(args: {
  apiRoutes: string[];
}): Router {
  const router = Router();

  router.use(
    async (req: RequestWithAgent, res: Response, next: NextFunction) => {
      const originalSend = res.send;

      console.log('req path', req.path);
      console.log('args', args);

      res.send = function (body: any): any {
        if (!req.agent) throw Error('Agent not available');
        let updatedBody = body;
        console.log('body', body);

        if (res.statusCode === 200 && body) {
          switch (req.path) {
            case '/createVerifiableCredential':
              // updatedBody = await processCreateVerifiableCredentialRequest(
              //   req.agent,
              //   body
              // );
              break;
            default:
              break;
          }
        }

        originalSend.call(this, updatedBody);
      };
      next();
    }
  );
  return router;
}

async function processCreateVerifiableCredentialRequest(
  agent: IAgent,
  payload: any
) {
  const publicKeyHex = await agent.execute('encryptAndStoreData', {
    data: payload,
    kms: 'local',
    type: 'Ed25519',
  });

  return { publicKeyHex, credential: payload };
}
