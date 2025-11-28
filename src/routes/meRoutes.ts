import { Router } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../utils/auth.js';

const router = Router();

router.get('/me', async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  if (!session || !session.user) {
    return res
      .status(401)
      .json({ status: 'error', message: 'Unauthenticated' });
  }
  return res.status(200).json({ status: 'success', data: session });
});

export default router;
