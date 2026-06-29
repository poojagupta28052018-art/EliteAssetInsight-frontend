// pages/api/listings.ts
export const runtime = 'nodejs'

import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  if(req.method === 'GET'){
    // If SUPABASE_SERVICE_ROLE_KEY is configured, fetch real listings
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if(url && serviceKey){
      const supabase = createClient(url, serviceKey)
      const { data, error } = await supabase.from('listings').select('*').order('created_at', { ascending: false }).limit(50)
      if(error) return res.status(200).json([])
      return res.status(200).json(data)
    }
    // fallback sample data
    return res.status(200).json([
      {id:'1',slug:'azimut-78-yacht',title:'2024 Azimut 78 Yacht',category:'Yacht',location:'Monaco',price_estimate_min:1200000,description:'Azimut 78 in excellent condition'},
      {id:'2',slug:'gulfstream-g650',title:'Gulfstream G650 Private Jet',category:'Jet',location:'Teterboro, NJ',price_estimate_min:32000000,description:'Low hours, full maintenance history'}
    ])
  }
  res.setHeader('Allow',['GET'])
  res.status(405).end('Method not allowed')
}
