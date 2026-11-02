// functions/api/chat.js - Proxy Aman Koto Batuah V10
// JANGAN taro API key di sini! Key simpan di Cloudflare Env: GROQ_API_KEY

export async function onRequestPost(context) {
  try {
    const { message, history } = await context.request.json();
    
    // Mitigasi 1: Validasi input
    if (!message || typeof message !== 'string' || message.length > 500) {
      return new Response(JSON.stringify({reply: "Pesan terlalu panjang Bos, max 500 karakter ya."}), {status: 400, headers: {"Content-Type":"application/json"}});
    }
    if (message.trim().length < 2) {
      return new Response(JSON.stringify({reply: "Tanya dong Bos, contoh: 'toko saya sepi di BSD budget berapa?'" }), {headers: {"Content-Type":"application/json"}});
    }

    // Mitigasi 2: Key dari Env, bukan dari HTML
    const GROQ_API_KEY = context.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      return new Response(JSON.stringify({reply: "AI lagi istirahat (key belum di-set). Pakai mode lokal dulu ya Bos. Klik WA di pojok kiri untuk audit gratis."}), {headers: {"Content-Type":"application/json"}});
    }

    // Mitigasi 3: Batasi biaya - max_tokens kecil
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // gratis 14.400 req/hari, 500 token/s
        messages: [
          {role: "system", content: "Kamu adalah Koto Batuah, agensi periklanan Tangerang Raya. Personality santai Tangerang: panggil Bos/Gan, tidak alay. Fokus solusi Ekosistem 3 Pilar: 1) Komunitas (QR koto.biz.id + WA auto-reply), 2) Teknologi (katalog + pixel + tracker), 3) Aset (manajemen aset tidak berantakan). Budget: Starter 2,5jt, Growth 7,5jt, Pilar Custom/JV. Selalu arahkan ke cek budget dan WA https://chat.Jimkoto.my.id untuk audit 15 menit gratis. Jangan sebut rahasia 3 domain. Jawab max 3 kalimat pendek + CTA."},
          {role: "user", content: message}
        ],
        max_tokens: 300, // mitigasi biaya - jangan biar AI curhat panjang
        temperature: 0.7
      })
    });

    if (!res.ok) {
      const err = await res.text();
      console.log("Groq error:", err);
      // Fallback ke lokal jika quota habis
      return new Response(JSON.stringify({reply: "AI lagi rame Bos, pakai mode lokal dulu. Intinya: kalau sepi WA itu masalah Komunitas, butuh QR koto.biz.id + auto-reply. Budget mulai 2,5jt. Mau lanjut di WA gratis?"}), {headers: {"Content-Type":"application/json"}});
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "Coba tanya lagi Bos.";

    // Mitigasi 4: CORS hanya untuk domain sendiri
    return new Response(JSON.stringify({reply}), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "https://kotobatuah.com",
        "Access-Control-Allow-Methods": "POST",
        "Cache-Control": "no-store"
      }
    });

  } catch (e) {
    return new Response(JSON.stringify({reply: "Waduh error Bos, coba lagi atau langsung WA ke tim Koto Batuah di pojok kiri ya."}), {headers: {"Content-Type":"application/json"}});
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "https://kotobatuah.com",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
