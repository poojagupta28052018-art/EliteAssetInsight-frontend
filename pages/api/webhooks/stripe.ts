// pages/api/webhooks/stripe.ts
// Stripe removed — using PayPal instead. Keep this stub for backward compatibility.
import { NextApiRequest, NextApiResponse } from 'next'
export default function handler(req:NextApiRequest,res:NextApiResponse){
  res.status(410).json({error:'Stripe integration removed. Use PayPal endpoints.'})
}
