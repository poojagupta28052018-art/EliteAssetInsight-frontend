import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(410).json({ error: 'Stripe removed. Use /api/paypal/ endpoints.' })
}
