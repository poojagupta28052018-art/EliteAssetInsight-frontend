// pages/api/webhooks/paypal.ts
import { NextApiRequest, NextApiResponse } from 'next'

export const config = { api: { bodyParser: true } }

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  // PayPal webhook handler (sandbox). In production verify signature via PayPal's verify-webhook-signature API.
  console.log('PayPal webhook headers:', req.headers)
  console.log('PayPal webhook body:', req.body)
  // TODO: verify using /v1/notifications/verify-webhook-signature
  // For now, just acknowledge
  res.status(200).json({received:true})
}
