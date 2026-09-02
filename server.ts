/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Allow parsing json with a generous limit to support high-res base64 medical images
  app.use(express.json({ limit: '25mb' }));

  // API HEALTH CHECK
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // COMPREHENSIVE LOCAL RULE-BASED CLINICAL MAPPING ENGINE (PLAN A FALLBACK)
  function getLocalDiagnosticFallback(description: string, image: string | null): any {
    const text = (description || "").toLowerCase();
    
    // Default system response
    let primaryHypothesis = "General Physical Symptom / Uncategorized Condition";
    let empatheticNarrative = `We've activated our secure, offline-first rule-based clinical mapping engine (backup protocol) to deliver instant clinical analysis.

Your symptoms suggest a general physiological or discomfort syndrome. Based on our clinical mapping indices, we recommend monitoring your vital signs, hydration, and resting fully. We highly encourage a routine review with a family doctor or clinician to analyze the underlying causes.`;
    let confidence = 75;
    let matches: any[] = [
      {
        condition: "General Inflammation / Muscle Strain",
        details: "Localized physical strain or idiopathic tissue reaction.",
        typicalInterventions: "Standard rest, warm compression, over-the-counter pain relievers if appropriate.",
        urgency: "Routine Care / Doctor Visit"
      },
      {
        condition: "Mild Viral Rash or Skin Reaction",
        details: "Temporary immunologic response triggering localized symptoms.",
        typicalInterventions: "Symptomatic soothing lotions, skin moisture barriers, cooling compress.",
        urgency: "Routine Care"
      }
    ];
    let warningSigns = [
      "Severe chest pain, heavy tightness, or choking lung pressure",
      "Extreme difficulty speaking, breathless heavy wheezing, or confusion",
      "Sudden weakness or loss of coordination on one side of physical body",
      "Severe skin rash that is spreading extremely fast inside a few short hours",
      "High spiking fever over 103°F (39.4°C) with neck stiffness"
    ];
    let doctorType = "General Physician / Family Doctor";
    let isDangerous = false;

    let matched = false;

    // Check for acute cardiac discomfort
    if (text.includes("heart attack") || text.includes("chest pain") || text.includes("angina") || text.includes("crushing paint") || text.includes("myocardial")) {
      primaryHypothesis = "Acute Coronary Distress (Chest Pain / Cardiac Alert)";
      empatheticNarrative = `URGENT ALARM! Your described chest pain, pressure, or tightness can indicate critical cardiovascular stress, such as myocardial ischemia or coronary vessel spasm.

Please rest immediately in a comfortable, seated posture. Avoid any physical exertion. If physical distress carries on for over 3 minutes, please call local emergency rescue channels (911) or proceed to the nearest emergency department or trauma hospital immediately.`;
      confidence = 90;
      isDangerous = true;
      doctorType = "Cardiologist / Emergency Team";
      matches = [
        {
          condition: "Cardiac Chest Pain (Severe Ischemia)",
          details: "Significant drop in blood flow to heart muscle ventricles.",
          typicalInterventions: "Immediate emergency hospital assessment, chewable baby Aspirin (81mg).",
          urgency: "CRITICAL EMERGENCY ALERT"
        },
        {
          condition: "Severe Esophageal Spasm / Acid Panic",
          details: "Acid reflux irritating gastric nerves, mimicking heart congestion pressure.",
          typicalInterventions: "Liquid antacids, Proton Pump Inhibitor (Omeprazole before breakfast).",
          urgency: "Moderate Care / Doctor Review"
        }
      ];
      warningSigns = [
        "Chest discomfort radiating directly into jaw, left shoulder, or throat",
        "Shortness of breath accompanied by cold sweating, rapid heartbeat, or dizzy spells",
        "Loss of consciousness, extreme physical fatigue, or near-fainting sensations"
      ];
      matched = true;
    }
    // Check for asthmatic lung tightness
    else if (text.includes("asthma") || text.includes("wheez") || text.includes("bronch") || text.includes("breath") || text.includes("tight throat") || text.includes("chok")) {
      primaryHypothesis = "Bronchospasm & Acute Respiratory Asthma Flare";
      empatheticNarrative = `Your described symptoms indicate acute constriction of the bronchial airways. Safe airflow is restricted, causing high-pitched wheezing, respiratory distress, or coughing spasms.

Identify and stay away from triggers immediately. Utilize your rescue fast-acting bronchodilator (e.g., Albuterol). Sit upright in a comfortable posture and breathe calmly. Seek professional pulmonological review if attacks happen more than twice a week.`;
      confidence = 88;
      isDangerous = true;
      doctorType = "Pulmonologist / Respirologist";
      matches = [
        {
          condition: "Bronchial Asthma (Hyperresponsive Airways)",
          details: "Inflammatory irritation of the lung bronchi.",
          typicalInterventions: "Inhaled Albuterol (Rescue), Fluticasone (Controller steroid).",
          urgency: "Urgent Bronchospasm Alert"
        },
        {
          condition: "Bacterial or Viral Bronchitis / Chest Cold",
          details: "Acute mucus blockage triggered by bronchial pathogens.",
          typicalInterventions: "Hydration, mucolytic expectorants, throat lozenges.",
          urgency: "Moderate Clinical Care"
        }
      ];
      warningSigns = [
        "No relief whatsoever 15 minutes after utilizing rescue Albuterol inhaler",
        "Inability to speak short sentences or single words without gasping for breath",
        "Chest and neck skin drawing heavily inward with each breathing attempt"
      ];
      matched = true;
    }
    // Check for diabetic symptoms
    else if (text.includes("diabet") || text.includes("blood sugar") || text.includes("insulin") || text.includes("glucose") || text.includes("frequent urin") || text.includes("thirst")) {
      primaryHypothesis = "Insulin Resistance / Chronically High Blood Sugar";
      empatheticNarrative = `Symptoms such as excessive thirst, frequent urination, and fatigue suggest underlying changes in glycemic metabolism. Your body cells are not properly processing blood glucose, leading to high circulating sugar levels.

Focus on low-glycemic foods and complete high-fiber carbs. Test your blood glucose levels. Meet with an endocrinologist to structure an HbA1c test and design a cohesive treatment plan.`;
      confidence = 85;
      isDangerous = false;
      doctorType = "Endocrinologist / Diabetologist";
      matches = [
        {
          condition: "Type 2 Diabetes Mellitus",
          details: "Cellular insulin receptor resistance and metabolic dysregulation.",
          typicalInterventions: "Metformin, regular low-impact strength exercise, weight loss.",
          urgency: "Regular Specialist Review"
        },
        {
          condition: "Severe Hyperglycemia / Pre-Ketoacidosis",
          details: "Extreme spike in circulating blood glucose.",
          typicalInterventions: "Insulin therapy, immediate hospital hydration and clinical monitoring.",
          urgency: "Urgent Hospital Alert"
        }
      ];
      warningSigns = [
        "Fruity-smelling acetone breath accompanied by deep, heavy breathing (Kussmaul)",
        "Severe confusion, persistent nausea, projectile vomiting, or lethargic state",
        "Frequent glucose values exceeding 250 mg/dL accompanied by high ketone body levels"
      ];
      matched = true;
    }
    // Check for dermatological rash matches
    else if (text.includes("rash") || text.includes("eczema") || text.includes("itch") || text.includes("dermatitis") || text.includes("dry skin") || text.includes("patches") || text.includes("skin") || text.includes("spots") || text.includes("hives")) {
      primaryHypothesis = "Atopic Dermatitis (Eczema) or Dermatological Allergies";
      empatheticNarrative = `Your skin description matches localized epidermal irritation, such as chronic Eczema or contact-allergy dermatitis. This causes moisture loss, cell flaking, and skin inflammation.

Keep the skin well-lubricated with barrier ceramide moisturizers. Consider mild over-the-counter Hydrocortisone cream (1%) to curb acute itching. Avoid hot baths or highly perfumed soaps.`;
      confidence = 82;
      isDangerous = false;
      doctorType = "Dermatologist / Allergist";
      matches = [
        {
          condition: "Atopic Dermatitis (Chronic Eczema)",
          details: "Immune-mediated drying of the standard dermal defense barrier.",
          typicalInterventions: "Regular hydration creams, mild topical steroid ointment, oral anti-histamines.",
          urgency: "Routine Dermal Review"
        },
        {
          condition: "Allergic Contact hives (Urticaria)",
          details: "Acute epidermal hyper-reaction to metallic dyes, weeds, or cleaning chemicals.",
          typicalInterventions: "Take oral Cetirizine allergy relief tablet, apply cool calming oatmeal compress.",
          urgency: "General Allergist Review"
        }
      ];
      warningSigns = [
        "Rash spreading rapidly across large skin regions within hours",
        "Blisters that break open, weep fluid, feel very hot, or display honey-colored crusting",
        "Rashes developing simultaneously with sudden face swelling or breathing problems"
      ];
      matched = true;
    }
    // Check for psoriasis scales
    else if (text.includes("psoriasis") || text.includes("scaly") || text.includes("scales")) {
      primaryHypothesis = "Plaque Psoriasis (Immune Dermal Proliferation)";
      empatheticNarrative = `The presence of reddish thick skin regions or silvery scaling suggests plaque psoriasis. This is driven by an overactive immune cascade, causing skin cells to compile extremely fast on the skin outer surface.

Keep skin highly lubricated using thick ceramide creams. Gentle exposure to sunlight can help, but avoid burning. Plan a visit with a dermatologist to review immunomodulators or targeted light therapy options.`;
      confidence = 80;
      isDangerous = false;
      doctorType = "Dermatologist / Rheumatologist";
      matches = [
        {
          condition: "Plaque Psoriasis",
          details: "Intense autoimmune-mediated rapid skin cell accumulation.",
          typicalInterventions: "Topical vitamin D analogues, topical steroid ointments, gentle coal tar gels.",
          urgency: "Routine Specialist Check"
        },
        {
          condition: "Seborrheic Dermatitis",
          details: "Localized yeast reaction overriding excess skin oils on face/scalp.",
          typicalInterventions: "Tar or Ketoconazole dandruff shampoos, light soothing ointments.",
          urgency: "Routine Care"
        }
      ];
      warningSigns = [
        "Scaling patches becoming extremely red, shedding, and spreading (>80% body coverage)",
        "Severe joint aches, swelling, or stiff knuckles accompanying the skin scaling"
      ];
      matched = true;
    }
    // Check for acne and pimples
    else if (text.includes("acne") || text.includes("pimple") || text.includes("blackhead") || text.includes("pustul")) {
      primaryHypothesis = "Acne Vulgaris (Sebum duct Blockage)";
      empatheticNarrative = `Your described parameters align with Acne Vulgaris, where glandular ducts are clogged with sebum oils and dead cells, breeding micro-bacteria.

Maintain mild washing twice a day using a gentle salicylic acid wash. Refrain from picking or popping, which aggravates infection and scarring. Consult a dermatologist for topical tretinoin prescription options if it persists.`;
      confidence = 85;
      isDangerous = false;
      doctorType = "Dermatologist / Aesthetic Care";
      matches = [
        {
          condition: "Acne Vulgaris",
          details: "Sebaceous duct blockages colonized by common acne bacteria.",
          typicalInterventions: "Benzoyl peroxide wash, Salicylic acid ointment, topical Tretinoin cream.",
          urgency: "Routine Care / Consult"
        }
      ];
      warningSigns = [
        "Development of deep, extremely painful, swelling cysts near the eyes or nose",
        "Unusual facial heat accompanied by high fever or rapid swelling"
      ];
      matched = true;
    }
    // Check for GERD / reflushes
    else if (text.includes("reflux") || text.includes("heartburn") || text.includes("gerd") || text.includes("acid") || text.includes("stomach burn")) {
      primaryHypothesis = "Gastroesophageal Reflux Disease (GERD) / Acid Excess";
      empatheticNarrative = `Chest burning or a sour reflux liquid indicates stomach acid backflowing past the lower esophageal sphincter, irritating the esophagus mucosa.

Eat smaller meals; avoid heavy food within 3 hours of bedtime. Avoid triggers like coffee, spicy recipes, peppermint, or smoking. Elevate the head of your bed 6 inches.`;
      confidence = 84;
      isDangerous = false;
      doctorType = "Gastroenterologist";
      matches = [
        {
          condition: "Acid Reflux / Esophagitis",
          details: "Frequent stomach acid backsplashes past upper gastric seals.",
          typicalInterventions: "Omeprazole (PPI) in morning, Famotidine before bed, liquid antacid.",
          urgency: "Regular Doctor Visit"
        }
      ];
      warningSigns = [
        "Vomiting red blood, passing dark black sticky stools, or constant severe stomach cramps",
        "Food getting stuck when swallowing or complete inability to swallow liquids"
      ];
      matched = true;
    }
    // Check for neuropathies
    else if (text.includes("nerve") || text.includes("neuropathy") || text.includes("tingl") || text.includes("burn feet") || text.includes("numb")) {
      primaryHypothesis = "Peripheral Neuropathy / Neural Pathway Irritation";
      empatheticNarrative = `Burning sensations, cold numbness, or pins-and-needles match neuropathic issues. This signals erratic sensory nerve signaling.

Protect digits from extreme temperatures. Avoid staying in cramped or neural-restricting postures. Meet with a neurologist to trace underlying causes like diabetic progression or nerve root compression.`;
      confidence = 80;
      isDangerous = false;
      doctorType = "Neurologist";
      matches = [
        {
          condition: "Peripheral Neuropathy",
          details: "Gradual irritation or erosion of distal small sensory fibers.",
          typicalInterventions: "Gabapentin, Pregabalin, secure roomy footwear, glycemic tracking.",
          urgency: "Regular Follow Up"
        }
      ];
      warningSigns = [
        "Sudden loss of bowel or bladder control (Cauda Equina emergency hazard)",
        "Saddle anesthesia (total numbness in pelvic/groin seat areas)",
        "Rapid weakness spreading up leg muscles causing frequent falls"
      ];
      matched = true;
    }
    // Check for throat matches
    else if (text.includes("throat") || text.includes("strep") || text.includes("swallow") || text.includes("tonsil")) {
      primaryHypothesis = "Pharyngitis (Sore Throat / Possible Strep)";
      empatheticNarrative = `A sore throat and painful swallow points to pharyngeal tissue inflammation, which can be bacterial (Strep throat) or viral (chest cold standard).

Drink soothing warm herbal teas, gargle saltwater, and rest. We advise visiting a local clinic for a rapid strep diagnostic swab to determine if antibiotics represent appropriate therapy.`;
      confidence = 82;
      isDangerous = false;
      doctorType = "ENT Specialist / General Clinician";
      matches = [
        {
          condition: "Bacterial Strep Throat (Group A Strep)",
          details: "Tonsillitis colonization requiring antibiotic cover to prevent severe complications.",
          typicalInterventions: "Penicillin or Amoxicillin antibiotic course once confirmed by professional swap.",
          urgency: "PCP Visit Required"
        }
      ];
      warningSigns = [
        "Inability to swallow saliva or breathe safely due to throat swelling",
        "Complete stiff jaw (trismus) making opening the mouth hard",
        "High spiking fever with severe neck rigidity"
      ];
      matched = true;
    }
    // Check for acute cold/fever/flu
    else if (text.includes("fever") || text.includes("flu") || text.includes("chill") || text.includes("ache") || text.includes("cough") || text.includes("cold")) {
      primaryHypothesis = "Influenza (Flu) or Acute Common Cold / Bronchial Irritation";
      empatheticNarrative = `Full-body muscle sore pains, shifting chills, cough, and fever indicate an active viral challenge like Influenza or acute respiratory infection.

Rest fully and isolate safely. Drink plenty of warm fluids (chicken broth, hot lemon tea) to keep hydrated. Use standard OTC antipyretics like Ibuprofen to relieve fever or body aches.`;
      confidence = 88;
      isDangerous = false;
      doctorType = "General Practitioner / Family Doctor";
      matches = [
        {
          condition: "Acute Pharyngitis / Viral Cold",
          details: "Upper respiratory pathogen triggering immune response.",
          typicalInterventions: "Rest, high fluids, Ibuprofen for aches, throat lozenges.",
          urgency: "Supportive Routine Care"
        },
        {
          condition: "Seasonal Allergic Rhinitis",
          details: "Environmental allergen irritation of nasal mucosa.",
          typicalInterventions: "Antihistamine (Cetirizine), saline nasal rinse, pollen avoidance.",
          urgency: "Routine Care"
        }
      ];
      warningSigns = [
        "Fever staying above 103°F (39.4°C) despite regular antipyretics",
        "Shortness of breath, sharp chest pain when breathing, or blue-tinted lips"
      ];
      matched = true;
    }

    return {
      primaryHypothesis,
      empatheticNarrative,
      confidence,
      matches,
      disclaimer: "These clinical findings represent an intelligent diagnostic assessment. This does not constitute formal diagnostic medical reviews or doctor feedback. Please consult your physician or healthcare provider for clinical confirmation.",
      warningSigns,
      isPlanAFallback: true,
      recDoctor: doctorType,
      isDangerous: isDangerous ? "Dangerous" : "Safe"
    };
  }

  // GEMINI SKIN / SYMPTOM IMAGE AND DESCRIPTION ANALYZER
  app.post("/api/ai-diagnosis", async (req, res) => {
    const { image, mimeType, description } = req.body;
    
    if (!description && !image) {
      return res.status(400).json({ 
        error: "Please provide either a symptom description or upload/capture a visual image of any symptom." 
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    // If API key is not present or is default placeholder, fall back to Plan A local solver!
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      console.log("[tpis.agies Fallback Engine] Active: No API Key provided. Returning Plan A local diagnostic resolver.");
      const fallbackResult = getLocalDiagnosticFallback(description, image);
      return res.json(fallbackResult);
    }

    // Structure model payloads
    const parts: any[] = [];
    if (image && mimeType) {
      let rawBase64 = image;
      if (image.includes("base64,")) {
        rawBase64 = image.split("base64,")[1];
      }
      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: rawBase64,
        }
      });
    }

    const designPrompt = `You are an expert clinical consultant and medical assistant for tpis.agies Clinical Intelligence Center. Analyze the following health or skin symptom description/image with high scientific accuracy and dermatological precision.
User Description: "${description || 'None provided'}"

Your task is to provide an accurate, evidence-based, medically correct, and helpful diagnostic evaluation while maintaining an empathetic, calm, and reassuring tone. Do NOT hazard guesses; ensure the candidate conditions, treatments, and precautions are aligned with modern medical guidelines.

Explain:
- primaryHypothesis: The most likely disease, medical condition, or drug/ingredient being referenced. Short, clear title.
- empatheticNarrative: An accurate, professional overview explaining what the condition is, why it occurs, and reassuring instructions (3-4 sentences max, completely clear and clinically sound).
- confidence: A medically sound estimation of confidence based on the typicality of symptoms described or visualized (number 1 to 100).
- matches: At least 2 alternative candidate conditions or related therapeutic pathways.
- disclaimer: A strict clinical disclaimer stating this is AI support and the user must consult a licensed physical caregiver.
- warningSigns: Essential "red flag" warning signs that mandate urgent emergency evaluation (e.g. difficulty breathing, rapid spreading, severe chest pain).
- recDoctor: The precise clinical specialist category the user should consult (e.g., Dermatologist, Pulmonologist, Otolaryngologist, etc.).
- isDangerous: Flag as "Dangerous" if the presentation commonly carries severe emergent risks, or "Safe" if stable.

Generate a JSON object matching the requested schema.`;

    parts.push({ text: designPrompt });

    // Multi-tier model cascade
    const modelRetrySteps = [
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash"
    ];

    for (let step = 0; step < modelRetrySteps.length; step++) {
      const selectedModelName = modelRetrySteps[step];
      
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });

        const response = await ai.models.generateContent({
          model: selectedModelName,
          contents: { parts },
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                primaryHypothesis: { 
                  type: Type.STRING,
                  description: "What is this disease, condition, or medicine? Short precise name." 
                },
                empatheticNarrative: { 
                  type: Type.STRING,
                  description: "Helpful overview of what is this disease or what is this medicine, offering calm validation and guidance." 
                },
                confidence: { 
                  type: Type.INTEGER,
                  description: "Approximate statistical confidence percentage match (1 to 100) based on symptom clarity." 
                },
                matches: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      condition: { type: Type.STRING, description: "Potential diagnostic match condition or matched medicine usage" },
                      details: { type: Type.STRING, description: "Short explanation of clinical overlays" },
                      typicalInterventions: { type: Type.STRING, description: "Common OTC relief, soothing creams, or typical medications linked to this" },
                      urgency: { type: Type.STRING, description: "Severity tag (e.g., 'Low Care', 'Moderate Care', 'Urgent Doctor Alert')" }
                    },
                    required: ["condition", "details", "typicalInterventions", "urgency"]
                  },
                  description: "Alternative possible conditions or related therapeutics that should also be overviewed."
                },
                disclaimer: { 
                  type: Type.STRING,
                  description: "A highly prominent clinical medical disclaimer that these computer analytics are purely informational and do not override professional advice." 
                },
                warningSigns: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Red flag warning signs or immediate symptoms that indicate emergency medical care is needed."
                },
                recDoctor: {
                  type: Type.STRING,
                  description: "Which doctor or clinician specialist to consult for this (e.g., Dermatologist, Pulmonologist, etc.)."
                },
                isDangerous: {
                  type: Type.STRING,
                  description: "Is it dangerous? Must be either 'Dangerous' or 'Safe'."
                }
              },
              required: ["primaryHypothesis", "empatheticNarrative", "confidence", "matches", "disclaimer", "warningSigns", "recDoctor", "isDangerous"]
            }
          }
        });

        const text = response.text;
        if (text) {
          const parsedJSON = JSON.parse(text.trim());
          return res.json(parsedJSON);
        }
      } catch (err: any) {
        console.warn(`[tpis.agies Engine] Step ${step + 1} with model '${selectedModelName}' failed:`, err.message || err);
      }
    }

    // Fallback to Plan A local resolver
    const fallbackResult = getLocalDiagnosticFallback(description, image);
    return res.json(fallbackResult);
  });

  // Vite development middleware vs Static Production bundle loading
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[tpis.agies Express Server] running on http://localhost:${PORT}`);
  });
}

startServer();
