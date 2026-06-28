// pages/api/submissions.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  if(req.method !== 'POST') return res.status(405).end()
  const payload = req.body
  try{
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if(url && serviceKey){
      const supabase = createClient(url, serviceKey)
      const { data, error } = await supabase.from('submissions').insert([{contact_name: payload.contact_name, contact_email: payload.contact_email, company: payload.company, payload: payload, agreed_commission_pct: payload.agreed_commission_pct || null, promoted_request: payload.promoted_request || false}])
      if(error) return res.status(500).json({error:error.message})
      return res.status(200).json({ok:true,message:'Submission saved', submission:data})
    }
    return res.status(200).json({ok:true,message:'Submission received (local stub)', payload})
  }catch(e:any){
    return res.status(500).json({error:e.message})
  }
}
