// pages/api/paypal/capture-order.ts
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
    const { orderID } = req.body
    if(!orderID) return res.status(400).json({error:'orderID required'})
    const accessToken = await getAccessToken()
    const capRes = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${accessToken}`
      }
    })
    const cap = await capRes.json()
    return res.status(200).json(cap)
  }catch(e:any){
    return res.status(500).json({error:e.message})
  }
}
