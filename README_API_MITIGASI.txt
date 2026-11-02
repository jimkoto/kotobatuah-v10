KOTOBATUAH V10 API-READY - FINAL SECURE

STRUKTUR:
- index.html (USE_API = false default, ganti true kalau backend ready)
- _headers (PageSpeed 95+ + security)
- _redirects (www->non-www, /blogs/->lead-form, /wa->chat)
- assets/logo.jpg + Badge_brand_light_320x120.png
- functions/api/chat.js (PROXY AMAN - key tidak di HTML)

CARA AKTIFKAN AI BENERAN (15 menit):
1. Daftar groq.com (gratis) -> Create API Key -> copy gsk_xxx
2. Upload folder ini ke GitHub, connect ke Cloudflare Pages
3. Cloudflare Pages > Settings > Environment Variables > Add:
   Variable: GROQ_API_KEY
   Value: gsk_xxx kamu
   Env: Production
4. Di index.html baris 1 ganti const USE_API = false jadi true, push lagi
5. Test di kotobatuah.com, ketik di AI chat

MITIGASI RISIKO (sudah built-in):
- Key bocor? Tidak, key di Env Variable Cloudflare, bukan di HTML View Source
- Biaya jebol? MAX_CHAT_PER_SESSION 20 + max_tokens 300 + Groq gratis 14.400 req/hari = max Rp 4.000/visitor, aman
- Spam? RATE_LIMIT_MS 3000 + Cloudflare Turnstile bisa ditambah
- Quota habis? Auto fallback ke mode lokal V9 + banner "AI istirahat"
- Pengunjung bayar? Tidak, biaya Rp 50-200/chat ditanggung Koto Batuah, tertulis transparan di bawah chat

Kalau mau pakai OpenAI, ganti fetch URL + model di chat.js

Support: https://chat.Jimkoto.my.id
