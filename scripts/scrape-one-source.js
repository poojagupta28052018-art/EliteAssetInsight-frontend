// scripts/scrape-one-source.js
// updated to warn about API usage and to output a sample fetch example
const fetch = require('node-fetch')
const API_KEY = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY
const CX = process.env.NEXT_PUBLIC_GCS_CX

async function search(query){
  const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${API_KEY}&cx=${CX}`
  const res = await fetch(url)
  return res.json()
}

async function main(){
  if(!API_KEY || !CX){
    console.error('Please set GOOGLE_CUSTOM_SEARCH_API_KEY and NEXT_PUBLIC_GCS_CX in env')
    return
  }
  const results = await search('luxury yacht auction')
  console.log('found', results.items?.length || 0, 'results')
  if(results.items && results.items.length){
    console.log(results.items[0].title, results.items[0].link)
    // Next: fetch the page and run an extractor (Grok/Gemini) to parse fields
    // Respect robots.txt and source TOS
  }
}

main()
