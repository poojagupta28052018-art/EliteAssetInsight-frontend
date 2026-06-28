// pages/api/paypal/create-order.ts
import { NextApiRequest, NextApiResponse } from 'next'

async function getAccessToken(){
  const client = process.env.PAYPAL_CLIENT_ID
  const secret = process.env.PAYPAL_SECRET
  if(!client || !secret) throw new Error('PayPal client credentials not set')
  const basic = Buffer.from(`${client}:${secret}`).toString('base64')
  const res = await fetch(`https://api-m.sandbox.paypal.com/v1/oauth2/token`, {
    method:'POST',
    headers:{
      'Authorization': `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  })
  const data = await res.json()
  return data.access_token
}

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  if(req.method !== 'POST') return res.status(405).end()
  try{
    const { amount = '1.00', currency = 'USD', description='EliteAssetInsight Purchase' } = req.body
    const accessToken = await getAccessToken()
    const orderRes = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${accessToken}`
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{amount:{currency_code: currency, value: amount}, description}]
      })
    })
    const order = await orderRes.json()
    return res.status(200).json(order)
  }catch(e:any){
    return res.status(500).json({error:e.message})
  }
}
