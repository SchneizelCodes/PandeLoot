import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const BOT_PERSONAS = [
  { name: 'Baker Bob', avatar: '👨‍🍳', badge: 'Head Baker', role: 'Staff' },
  { name: 'Aling Marites', avatar: '💅', badge: 'Bakery Suki', role: 'Customer' },
  { name: 'Kuya Joms', avatar: '🏍️', badge: 'Motor Suki', role: 'Customer' },
  { name: 'Sarah QC', avatar: '🌸', badge: 'Foodie', role: 'Customer' },
  { name: 'Carlo Caloocan', avatar: '⚡', badge: 'Crate Hunter', role: 'Customer' },
  { name: 'Tita Baby', avatar: '👵', badge: 'Suki VIP', role: 'Customer' },
];

const FALLBACK_RESPONSES = [
  'Sana all nakakakuha ng Whole Yema Cake! Kanina pa ako nagro-roll puro Cheese Cup Cake haha!',
  'Legit yung Golden Egg Pie nila paps, bagong luto pa nung inabot ni cashier kanina sa counter.',
  'Sobrang lambot ng Cheese Ensaymada, punong-puno ng queso de bola at butter!',
  'Naka-jackpot ako ng Whole Decadent Choco Cake kanina! Sulit na sulit!',
  'Grabe yung amoy ng Butter Cake at Custard Cake sa branch, amoy pa lang busog ka na.',
  'Kakagaling ko lang sa branch, ipinakita ko lang yung dynamic QR sa cashier, nakuha ko agad yung Cheese Mamon!',
  'Bukas ang Manay\'s Panaderia from 7:00 AM to 8:00 PM everyday! Wag kalimutan mag-comment sa FB post para sure sa stock.',
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userMessage, lastDropItem, botPersona } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    // Pick responding persona
    const persona = BOT_PERSONAS.find((p) => p.name === botPersona) ||
      BOT_PERSONAS[Math.floor(Math.random() * BOT_PERSONAS.length)];

    if (!apiKey) {
      const randomText = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
      return NextResponse.json({
        user: persona.name,
        avatar: persona.avatar,
        badge: persona.badge,
        text: randomText,
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are ${persona.name} (${persona.badge}), a friendly participant in the live "Tambayan Chat" of Manay's Panaderia (a beloved local bakery in the Philippines).
The bakery offers a viral case-opening web app called "PandeLoot".

BAKERY DETAILS:
- Name: Manay's Panaderia
- Store Hours: 7:00 AM – 8:00 PM (Same-day pickup only)
- Location: Available on Google Maps (https://maps.app.goo.gl/dhg1VcLtAYsrEjJC7)
- Vouchers: 1 user can get strictly 1 voucher via Google Sign-In. Perks can be: 50% OFF, Buy 1 Get 1 (BOGO), or 100% Free.
- Customer Guide: Customers can comment on Manay's Facebook post to check if freshly baked pastries are in stock before pickup.
- 12 Bestsellers: Choco Cake, Yema Cake, Egg Pie, Pianono, Cheese Mamon, Custard Cake, Banana Cake, Cheese Cup Cake, Brownies, Torta, Butter Cake, Cheese Ensaymada.

YOUR PERSONA (${persona.name}):
- If you are Baker Bob: speak proudly about baking, fresh batches, oven heat, and butter.
- If you are Kuya Joms: talk about motor riding, hot coffee, breakfast, and good merienda.
- If you are Aling Marites: talk about bakery gossip, who got big drops, and quick claims.
- If you are Sarah QC: talk about sweet cakes, food reviews, and cravings.
- If you are Carlo: talk about lootbox rolls, probabilities, and winning 100% free drops.
- If you are Tita Baby: warm Filipino auntie, asking for recommendations or coffee pairings.

STYLE:
- Realistic, warm, casual Philippine Taglish (use "paps", "lodi", "sana all", "legit", "sarap", "mainit-init", "tara").
- Maximum 1 to 2 short sentences. No hashtags, no quotes around text.
- If replying to a user question, answer their inquiry accurately and warmly.
- Never mention you are an AI.`;

    let prompt = '';
    if (userMessage) {
      prompt = `A customer asked in the tambayan chat: "${userMessage}". Reply directly to them warmly and helpfully in Taglish as ${persona.name}.`;
    } else if (lastDropItem) {
      prompt = `A player in the bakery just unlocked a "${lastDropItem}" drop! Give a 1-sentence excited reaction in Taglish celebrating their win as ${persona.name}.`;
    } else {
      prompt = `Share a spontaneous 1-sentence chat comment or question to the other tambays about bakery pastries, oven drops, or coffee as ${persona.name}.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.85,
        maxOutputTokens: 80,
      },
    });

    const replyText = response.text?.trim().replace(/^["']|["']$/g, '') || FALLBACK_RESPONSES[0];

    return NextResponse.json({
      user: persona.name,
      avatar: persona.avatar,
      badge: persona.badge,
      text: replyText,
      timestamp: new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }),
    });
  } catch (error) {
    console.error('Error generating chat message:', error);
    const persona = BOT_PERSONAS[0];
    const randomText = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
    return NextResponse.json({
      user: persona.name,
      avatar: persona.avatar,
      badge: persona.badge,
      text: randomText,
      timestamp: new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }),
    });
  }
}
