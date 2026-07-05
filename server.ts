import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = 3000;

// Initialize Gemini Client securely
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini API Client initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize Gemini Client:", err);
  }
} else {
  console.log("No GEMINI_API_KEY found or default key used. Server will run in simulation mode for AI features.");
}

// ----------------------------------------------------
// RESTAURANT ORDERING SAAS API ENDPOINTS
// ----------------------------------------------------

// 1. AI Menu Generator
app.post("/api/gemini/generate-menu", async (req, res) => {
  const { cuisine, style, count = 4 } = req.body;

  if (!cuisine) {
    return res.status(400).json({ error: "Cuisine is required" });
  }

  const prompt = `Generate a gourmet menu for a restaurant specializing in ${cuisine} cuisine with a ${style || "modern casual"} style.
Return exactly ${count} distinct dishes. For each dish, provide:
1. A creative, appetizing name.
2. A sensory-rich, delicious description highlighting key ingredients.
3. A realistic price (formatted as a number, e.g., 14.99).
4. A comma-separated list of 3-4 optional "extras" or custom additions (e.g. "Extra cheese", "Gluten-free crust").
5. A list of 2 custom "variants" or sizes (e.g., "Regular", "Large") and their price additions.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                price: { type: Type.NUMBER },
                extras: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                variants: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      priceModifier: { type: Type.NUMBER }
                    },
                    required: ["name", "priceModifier"]
                  }
                }
              },
              required: ["name", "description", "price", "extras", "variants"]
            }
          }
        }
      });

      if (response.text) {
        return res.json({ success: true, source: "gemini", items: JSON.parse(response.text) });
      }
    } catch (err: any) {
      console.error("Gemini Generate Menu Error:", err);
    }
  }

  // Fallback Simulation Data
  console.log("Generating simulated menu for", cuisine);
  const fallbacks: Record<string, any[]> = {
    italian: [
      {
        name: "Truffle Tagliolini",
        description: "Fresh hand-rolled pasta tossed in white truffle butter, parmigiano-reggiano, and shaved summer black truffle.",
        price: 24.50,
        extras: ["Fresh Grated Truffle", "Porcini Mushrooms", "Gluten-free Tagliolini"],
        variants: [{ name: "Primi (Appetizer Size)", priceModifier: -6.0 }, { name: "Secondi (Entree Size)", priceModifier: 0.0 }]
      },
      {
        name: "Fiorentina Stone Pizza",
        description: "Thin wood-fired crust topped with wild spinach, crushed San Marzano tomatoes, farm egg, aged provolone, and garlic oil.",
        price: 18.99,
        extras: ["Smoked Pancetta", "Extra Bufala Mozzarella", "Hot Honey Drizzle"],
        variants: [{ name: "12 inch Regular", priceModifier: 0.0 }, { name: "16 inch Large", priceModifier: 4.50 }]
      },
      {
        name: "Artisanal Burrata & Heirloom Salad",
        description: "Creamy pugliese burrata served over juicy heirloom tomatoes, cold-pressed olive oil, fresh basil-infused pearls, and aged balsamic glaze.",
        price: 15.00,
        extras: ["Prosciutto di Parma", "Toasted Pine Nuts"],
        variants: [{ name: "Regular Size", priceModifier: 0.0 }, { name: "Sharing Size", priceModifier: 5.0 }]
      }
    ],
    mexican: [
      {
        name: "Chipotle Birria Tacos",
        description: "Three slow-braised beef birria tacos in crispy corn tortillas with melted Oaxaca cheese, served with rich consommé for dipping.",
        price: 16.50,
        extras: ["Extra Consommé", "Smashed Avocado", "House Habanero Salsa"],
        variants: [{ name: "3 Taco Plate", priceModifier: 0.0 }, { name: "5 Taco Feast", priceModifier: 5.50 }]
      },
      {
        name: "Crispy Avocado Tostadas",
        description: "Crispy blue corn tostadas topped with whipped black beans, seasoned Haas avocado slices, pickled watermelon radishes, and chipotle crema.",
        price: 13.99,
        extras: ["Grilled Cotija Cheese", "Pulled Pollo Asado"],
        variants: [{ name: "Standard Tostadas", priceModifier: 0.0 }, { name: "Add Jalapeño Rice", priceModifier: 2.50 }]
      }
    ],
    asian: [
      {
        name: "Spicy Miso Ramen",
        description: "24-hour slow simmered pork bone broth with rich red miso paste, springy noodles, chashu pork belly, soft-boiled ajitama egg, bamboo shoots, and nori.",
        price: 17.50,
        extras: ["Extra Chashu Pork", "Bamboo Shoots", "House Spicy Paste"],
        variants: [{ name: "Regular Ramen", priceModifier: 0.0 }, { name: "Mega Bowl (Double Noodles)", priceModifier: 3.50 }]
      },
      {
        name: "Crunchy Dragon Roll",
        description: "Pristine tiger shrimp tempura and cucumber wrapped in nori, topped with premium unagi eel, fresh avocado, toasted sesame, and sweet eel sauce.",
        price: 19.00,
        extras: ["Spicy Kewpie Mayo", "Tobiko Caviar"],
        variants: [{ name: "8 Pieces", priceModifier: 0.0 }, { name: "12 Pieces Deluxe", priceModifier: 6.00 }]
      }
    ]
  };

  const selectedCuisine = (cuisine || "").toLowerCase();
  const menuItems = fallbacks[selectedCuisine] || [
    {
      name: `${cuisine} Signature Platter`,
      description: `A masterfully designed combination of the chef's favorite regional ${cuisine} delicacies, seasoned with local organic herbs and cooked to perfection.`,
      price: 21.99,
      extras: ["Extra Side Sauce", "Premium Garnish", "Double Portion"],
      variants: [{ name: "Individual Portion", priceModifier: 0.0 }, { name: "Family Platter", priceModifier: 12.0 }]
    },
    {
      name: `Rustic ${cuisine} Salad`,
      description: `Fresh locally sourced greens paired with traditional ${cuisine} elements, cold-pressed oils, toasted seeds, and a delicious homemade dressing.`,
      price: 14.50,
      extras: ["Grilled Organic Tofu", "Roasted Chicken Breast"],
      variants: [{ name: "Regular Size", priceModifier: 0.0 }, { name: "Large Entrée Size", priceModifier: 3.0 }]
    }
  ];

  return res.json({ success: true, source: "simulation", items: menuItems.slice(0, count) });
});

// 2. AI Menu Description Generator
app.post("/api/gemini/generate-description", async (req, res) => {
  const { name, ingredients, style = "appetizing" } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Item name is required" });
  }

  const prompt = `Write a short, sensory-rich, highly professional restaurant menu description for a dish named "${name}"${ingredients ? ` containing ${ingredients}` : ""}. Keep the description under 30 words and write in a ${style} style that appeals immediately to diners' senses. Only output the description.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      if (response.text) {
        return res.json({ success: true, source: "gemini", description: response.text.trim() });
      }
    } catch (err: any) {
      console.error("Gemini Generate Description Error:", err);
    }
  }

  // Fallback Simulation Data
  const styleWords: Record<string, string> = {
    luxury: "Exquisite hand-crafted creation featuring dry-aged ingredients, finished with high-end reduction, wild organic microgreens, and cold-pressed infusion.",
    playful: "A crowd-pleasing sensory splash loaded with bold layers, fresh bursts of flavor, and our secret custom spice blend that keeps you coming back for another bite!",
    healthy: "A vibrantly fresh, high-nutrient powerhouse brimming with clean, farm-to-table organic ingredients, zero preservatives, and a light zesty dressing.",
    appetizing: "Succulent, golden-brown and cooked to juicy perfection. Topped with rich melted cheese, fresh aromatic herbs, and drizzled with delicious house-made secret sauce."
  };

  const desc = `Indulge in our exquisite ${name}. ${styleWords[style] || styleWords.appetizing}`;
  return res.json({ success: true, source: "simulation", description: desc });
});

// 3. AI Marketing Assistant (Campaigns / Promo generator)
app.post("/api/gemini/marketing-assistant", async (req, res) => {
  const { goal, theme, platform = "Email" } = req.body;

  const prompt = `You are an elite restaurant marketing assistant. The user wants to create a "${platform}" campaign for their restaurant.
Goal: ${goal || "Increase repeat orders"}
Theme: ${theme || "Summer Season Launch"}

Generate 3 alternative marketing headlines/subject lines and 1 short, highly engaging body copy sample (under 80 words) including a strong call-to-action (CTA). Return as a clean JSON structure.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              headlines: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              bodyCopy: { type: Type.STRING },
              recommendedCTA: { type: Type.STRING }
            },
            required: ["headlines", "bodyCopy", "recommendedCTA"]
          }
        }
      });

      if (response.text) {
        return res.json({ success: true, source: "gemini", campaign: JSON.parse(response.text) });
      }
    } catch (err: any) {
      console.error("Gemini Marketing Assistant Error:", err);
    }
  }

  // Fallback Simulation
  const campaign = {
    headlines: [
      `🔥 Beat the heat with 20% OFF our signature dishes!`,
      `Craving something fresh? Discover our new ${theme || "Summer"} menu!`,
      `Exclusive VIP Access: Order now & double your loyalty points!`
    ],
    bodyCopy: `Hey food lover! We're celebrating the launch of our stunning ${theme || "Summer Specials"} with a treat just for you. For the next 48 hours, enjoy delicious chef-crafted creations delivered hot and fresh directly to your door. Use code HELLO20 at checkout and savor the absolute best flavors of the season!`,
    recommendedCTA: "Claim Your 20% Discount"
  };

  return res.json({ success: true, source: "simulation", campaign });
});

// 4. AI Voice & WhatsApp Ordering Simulation Chat
app.post("/api/gemini/chat", async (req, res) => {
  const { messages, agentType = "whatsapp" } = req.body;

  const systemInstruction = agentType === "voice" 
    ? "You are a professional, super friendly, high-speed automated Restaurant Voice Ordering assistant. Help the customer build their order. Speak concisely, as if over the phone. Guide them through choosing items like Pizza, Burgers, Pasta, adding variants, confirming their delivery address, and wrapping up. Keep answers under 2 sentences."
    : "You are 'BiteBot', a highly conversational, intelligent WhatsApp Ordering Assistant for a premium restaurant. Respond with elegant emojis, bullets, and friendly messaging. Assist the customer to browse the menu, add items to their digital cart, customize toppings, select pickup/delivery, and provide a simulation checkout link. Keep responses friendly, playful, and structured.";

  if (ai) {
    try {
      const chatMessages = (messages || []).map((m: any) => ({
        role: m.role === "assistant" ? "model" as const : "user" as const,
        parts: [{ text: m.content }]
      }));

      // Grab the last message as user query, and feed previous as history
      const lastMessage = chatMessages.pop();
      const chat = ai.chats.create({
        model: "gemini-3.5-flash",
        history: chatMessages,
        config: {
          systemInstruction,
        }
      });

      const response = await chat.sendMessage({
        message: lastMessage?.parts[0]?.text || "Hello!"
      });

      if (response.text) {
        return res.json({ success: true, source: "gemini", reply: response.text });
      }
    } catch (err: any) {
      console.error("Gemini Chat Error:", err);
    }
  }

  // Fallback Simulation
  const userText = messages[messages.length - 1]?.content?.toLowerCase() || "";
  let reply = "";

  if (agentType === "voice") {
    if (userText.includes("pizza") || userText.includes("order")) {
      reply = "Great choice! I can add our Signature Margherita Pizza with fresh basil to your cart. Would you like that in Medium or Large size?";
    } else if (userText.includes("large") || userText.includes("medium")) {
      reply = "Perfect! Large Margherita added. Any extra toppings like garlic oil, fresh burrata, or spicy pepperoni?";
    } else if (userText.includes("no") || userText.includes("that's it")) {
      reply = "Got it. Your order comes to $18.99. Shall we deliver this to your saved address, or will you pick it up?";
    } else {
      reply = "Hello! Welcome to Urban Kitchen's voice ordering. I can help you order delicious food instantly. What are you craving today?";
    }
  } else {
    // WhatsApp style
    if (userText.includes("hi") || userText.includes("hello") || userText.includes("menu")) {
      reply = `👋 *Hey there! Welcome to Urban Kitchen's Smart Chat Ordering!* 🍕🍔\n\nI am *BiteBot*, your culinary companion. Here are some of our legendary specials today:\n\n• 🍕 *Margherita Stone Pizza* - $18.99\n• 🍔 *Truffle Bacon Burger* - $16.50\n• 🥗 *Heirloom Burrata Salad* - $15.00\n\n*Reply with the dish name* to add it to your cart, or tell me what you're in the mood for! 😋`;
    } else if (userText.includes("pizza") || userText.includes("margherita")) {
      reply = `🍕 *Excellent choice! Margherita Stone Pizza* has been added to your WhatsApp cart!\n\nWould you like to customize it with toppings?\n1️⃣ *Extra Bufala Mozzarella* (+$2.50)\n2️⃣ *Hot Honey Drizzle* (+$1.50)\n3️⃣ *Fresh Prosciutto* (+$4.00)\n\nJust reply with the number or say "No extras" to continue! 👍`;
    } else if (userText.includes("1") || userText.includes("mozzarella")) {
      reply = `🧀 Got it! Extra Bufala Mozzarella added to your Pizza. Yum!\n\n🛒 *Your current order:* \n• 1x Margherita Stone Pizza (w/ Extra Mozzarella) — *$21.49*\n\nWould you like to add anything else to drink, or should we head over to *Checkout*? 🚀`;
    } else {
      reply = `✨ Understood! I can process that right away. Your order is safely tracked in our cloud system. Say *Checkout* to finalize your order, or let me know if you want to add more delicious items to your list! 🍕🥤`;
    }
  }

  return res.json({ success: true, source: "simulation", reply });
});

// 5. AI Review Analysis & Summarization
app.post("/api/gemini/review-analysis", async (req, res) => {
  const prompt = `You are an AI Consultant analyzing 10 recent customer reviews for a SaaS restaurant partner.
Analyze these themes and provide:
1. A summary of 2 core strengths (why customers love them).
2. A summary of 2 operational weaknesses / bottlenecks (e.g., slow delivery, cold pizza).
3. A bulleted list of 3 high-impact actionable recommendations to increase ratings.
Return in a beautiful, structured JSON format.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              strengths: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              weaknesses: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              recommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["strengths", "weaknesses", "recommendations"]
          }
        }
      });

      if (response.text) {
        return res.json({ success: true, source: "gemini", insights: JSON.parse(response.text) });
      }
    } catch (err: any) {
      console.error("Gemini Review Analysis Error:", err);
    }
  }

  // Fallback Simulation Insights
  const insights = {
    strengths: [
      "Sensational food quality and ingredient freshness, specifically highlighted in the wood-fired pizzas and homemade pasta.",
      "Beautifully intuitive customer-facing mobile website experience leading to high checkout completion rates."
    ],
    weaknesses: [
      "Slightly longer wait times (45+ mins) during Friday-Saturday peak hours (7:00 PM - 9:00 PM).",
      "Minor temperature loss complaints for deliveries in the outer Zone C radius."
    ],
    recommendations: [
      "Implement a smart peak-hour preparation buffer for popular items to shave off 8-10 minutes of preparation delay.",
      "Equip outer zone delivery drivers with premium high-density insulated thermal transport bags.",
      "Configure an automated 'Busy Mode' in the platform settings to dynamically update delivery estimates by 15 mins during peak rushes."
    ]
  };

  return res.json({ success: true, source: "simulation", insights });
});

// 6. AI Sales & Demand Forecasting
app.get("/api/gemini/forecast", (req, res) => {
  // Return clean, realistic prediction data for the analytics dashboard
  const forecast = {
    predictedRevenueNextWeek: 18450,
    growthPercentage: 12.4,
    peakDayPrediction: "Friday",
    peakDayReason: "Predicted rise in delivery orders due to cool weather forecast and local weekend sporting events.",
    recommendedStaffingLevel: "High (Add 1 driver & 1 line-cook for Friday evening shift)",
    popularItemTrendPrediction: "Fiorentina Stone Pizza (+18% demand forecast)",
    chartData: [
      { day: "Mon", actual: 1200, predicted: 1250 },
      { day: "Tue", actual: 1450, predicted: 1400 },
      { day: "Wed", actual: 1550, predicted: 1600 },
      { day: "Thu", actual: 1800, predicted: 1850 },
      { day: "Fri", actual: 2900, predicted: 3100 },
      { day: "Sat", actual: 3400, predicted: 3550 },
      { day: "Sun", actual: 2300, predicted: 2450 }
    ]
  };
  return res.json({ success: true, forecast });
});

// ----------------------------------------------------
// VITE OR STATIC FILE HANDLERS
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Mounted Vite development middleware.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Serving built static production files from dist/ directory.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Restaurant SaaS platform server is running securely on http://localhost:${PORT}`);
  });
}

startServer();
