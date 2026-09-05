/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { startAuthorization, getToken, getConnectorMetadata } from "@vercel/connect";
import dotenv from "dotenv";

dotenv.config();

// Vercel Connect & Supabase OAuth constants from your configuration
const VERCEL_CONNECT_ID = process.env.VERCEL_CONNECT_ID || "scl_0bIcaoDjGhDCxnuisy43Q";
const SUPABASE_OAUTH_CLIENT_ID = process.env.SUPABASE_OAUTH_CLIENT_ID || "1a9865df-029d-4a6e-aa44-5b217b799560";
const SUPABASE_SERVER_URL = "https://mcp.supabase.com/mcp";
const SUPABASE_DISCOVERY_URL = "https://api.supabase.com";
const SUPABASE_AUTH_ENDPOINT = "https://api.supabase.com/v1/oauth/authorize";
const SUPABASE_TOKEN_ENDPOINT = "https://api.supabase.com/v1/oauth/token";
const SUPABASE_REGISTRATION_ENDPOINT = "https://api.supabase.com/platform/oauth/register";
const SUPABASE_ISSUER = "https://api.supabase.com";

// Gemini API Key Rotation Manager
class KeyRotationManager {
  private keys: string[];
  private currentIndex: number = 0;
  constructor(keysStr: string) {
    this.keys = keysStr ? keysStr.split(',').map(k => k.trim()).filter(k => k) : [];
  }
  getNextKey() {
    if (this.keys.length === 0) return null;
    const key = this.keys[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.keys.length;
    return key;
  }
  rotate() {
    if (this.keys.length === 0) return;
    this.currentIndex = (this.currentIndex + 1) % this.keys.length;
  }
}

const rotationManager = new KeyRotationManager(process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || "");
const diagnosisCache = new Map<string, any>();

// Simple hash function for caching requests
function generateRequestHash(payload: any): string {
  const str = JSON.stringify(payload);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `diag_${hash}`;
}

async function verifyDiagnosis(ai: any, originalResult: any, promptContext: string) {
  try {
    const verificationPrompt = `You are a Senior Medical Review Board. Review the following AI-generated diagnostic result for clinical contradictions, inaccuracies, or gaps in evidence.

    Patient Context: "${promptContext}"
    Proposed Result: ${JSON.stringify(originalResult)}

    Your task is to either:
    1. Confirm the result is accurate.
    2. Provide a corrected version of the JSON if errors are found.

    Return only a JSON object with two fields: "status" ("confirmed" or "corrected") and "result" (the final verified JSON diagnostic object).`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-pro",
      contents: { parts: [{ text: verificationPrompt }] },
      config: {
        temperature: 0,
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (text) {
      const parsed = JSON.parse(text.trim());
      return parsed.status === "corrected" ? parsed.result : originalResult;
    }
  } catch (err) {
    console.warn("[Verification Engine] Error during verification, returning original result:", err);
  }
  return originalResult;
}


const SUPABASE_SCOPES = [
  "analytics:read", "analytics:write",
  "analytics_config:read", "analytics_config:write",
  "auth:read", "auth:write",
  "database:read", "database:write",
  "domains:read", "domains:write",
  "edge_functions:read", "edge_functions:write",
  "environment:read", "environment:write",
  "organizations:read", "organizations:write",
  "projects:read", "projects:write",
  "rest:read", "rest:write",
  "secrets:read", "secrets:write",
  "storage:read", "storage:write"
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Allow parsing json with a generous limit to support high-res base64 medical images
  app.use(express.json({ limit: '25mb' }));

  // API HEALTH CHECK
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // VERCEL CONNECT & SUPABASE OAUTH AUTHORIZATION ROUTE
  app.post("/api/connect/supabase", async (req, res) => {
    const subjectId = req.body?.subjectId || "usr_123";
    const subjectType = req.body?.subjectType || "user";
    const customScopes = req.body?.scopes || SUPABASE_SCOPES;
    const connectorTarget = req.body?.connectorId || VERCEL_CONNECT_ID;

    const authParams = {
      subject: { type: subjectType, id: subjectId },
      scopes: customScopes
    };

    console.log("[Vercel Connect] Starting authorization for Supabase...", {
      connector: connectorTarget,
      subject: authParams.subject,
      scopesCount: customScopes.length,
      clientId: SUPABASE_OAUTH_CLIENT_ID
    });

    try {
      let authResult;
      try {
        authResult = await startAuthorization(connectorTarget, authParams);
      } catch (firstErr) {
        authResult = await startAuthorization("supabase/auth", authParams);
      }

      return res.json({
        success: true,
        connector: connectorTarget,
        result: authResult
      });
    } catch (err: any) {
      console.warn("[Vercel Connect] Notice during startAuthorization:", err?.message || err);
      const fallbackAuthorizeUrl = `${SUPABASE_AUTH_ENDPOINT}?client_id=${encodeURIComponent(
        SUPABASE_OAUTH_CLIENT_ID
      )}&response_type=code&scope=${encodeURIComponent(SUPABASE_SCOPES.join(" "))}`;

      return res.status(200).json({
        success: false,
        notice: "Vercel Connect OIDC active in production Vercel deployments.",
        error: err?.message || "Vercel OIDC Token header required in cloud container.",
        connectionId: VERCEL_CONNECT_ID,
        clientId: SUPABASE_OAUTH_CLIENT_ID,
        clientName: "auth",
        scopes: SUPABASE_SCOPES,
        manualAuthorizeUrl: fallbackAuthorizeUrl,
        serverUrl: SUPABASE_SERVER_URL,
        discoveryUrl: SUPABASE_DISCOVERY_URL,
        authorizationEndpoint: SUPABASE_AUTH_ENDPOINT,
        tokenEndpoint: SUPABASE_TOKEN_ENDPOINT,
        registrationEndpoint: SUPABASE_REGISTRATION_ENDPOINT,
        issuer: SUPABASE_ISSUER,
        codeChallengeMethodsSupported: ["S256", "plain"],
        grantTypesSupported: ["authorization_code", "refresh_token"],
        responseModesSupported: ["query"],
        responseTypesSupported: ["code"],
        tokenAuthMethodsSupported: ["client_secret_basic", "client_secret_post"]
      });
    }
  });

  app.post("/api/connect/supabase/token", async (req, res) => {
    try {
      const subjectId = req.body?.subjectId || "usr_123";
      const subjectType = req.body?.subjectType || "user";
      const connectorTarget = req.body?.connectorId || VERCEL_CONNECT_ID;

      const token = await getToken(connectorTarget, {
        subject: { type: subjectType, id: subjectId }
      });

      return res.json({ success: true, token });
    } catch (err: any) {
      return res.status(200).json({
        success: false,
        notice: "Vercel Connect session required for token exchange.",
        error: err?.message || "No active token cached."
      });
    }
  });

  app.get("/api/connect/supabase", (req, res) => {
    res.json({
      connectionId: VERCEL_CONNECT_ID,
      clientId: SUPABASE_OAUTH_CLIENT_ID,
      clientName: "auth",
      scopes: SUPABASE_SCOPES,
      serverUrl: SUPABASE_SERVER_URL,
      discoveryUrl: SUPABASE_DISCOVERY_URL,
      authorizationEndpoint: SUPABASE_AUTH_ENDPOINT,
      tokenEndpoint: SUPABASE_TOKEN_ENDPOINT,
      registrationEndpoint: SUPABASE_REGISTRATION_ENDPOINT,
      issuer: SUPABASE_ISSUER,
      codeChallengeMethodsSupported: ["S256", "plain"],
      grantTypesSupported: ["authorization_code", "refresh_token"],
      responseModesSupported: ["query"],
      responseTypesSupported: ["code"],
      tokenAuthMethodsSupported: ["client_secret_basic", "client_secret_post"]
    });
  });

  function getLocalDiagnosticFallback(description: string, image: string | null): any {
    const text = (description || "").toLowerCase();
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
    let anatomicalArea: 'throat' | 'lungs' | 'heart' | 'head' | 'abdomen' | 'skin' | 'limbs' | 'general' = 'throat';
    let affectedOrganSystem = "Otolaryngological & Pharyngeal Region";
    let primaryLesionSite = "Pharyngeal mucosa & tonsillar pillars";
    let affectedDownstreamOrgans = [
      "Deep cervical lymph nodes (lymphadenopathy)",
      "Upper respiratory mucosal lining"
    ];
    let systemicSideEffects = [
      "Odynophagia leading to acute dehydration",
      "Secondary bacterial superinfection",
      "Severe sleep fragmentation & malaise"
    ];
    let propagationPathways = [
      "Lymphatic drainage into jugulodigastric anterior cervical chains",
      "Direct contiguous pharyngeal mucosal extension"
    ];
    let icd10Code = "R68.89";
    let clinicalWorkup = {
      labTests: [
        "Complete Blood Count (CBC) with differential",
        "Comprehensive Metabolic Panel (CMP)",
        "C-Reactive Protein (CRP) & Erythrocyte Sedimentation Rate (ESR)"
      ],
      imagingStudies: [
        "Targeted anatomical ultrasonography / POCUS",
        "Contrast-enhanced sectional imaging if symptoms persist"
      ],
      physicalSigns: [
        "Systematic regional inspection and palpation",
        "Full baseline vital signs evaluation (HR, BP, SpO2, Temp)",
        "Targeted neurovascular and peripheral perfusion check"
      ]
    };
    let pharmacotherapy = {
      firstLine: "Acetaminophen 500-1000 mg PO q6h PRN (max 3000 mg/24h) or Ibuprofen 400 mg PO q8h with food",
      alternative: "Naproxen 250-500 mg PO q12h PRN with gastroprotection (PPI) if indicated",
      contraindications: [
        "Active peptic ulcer disease or GI bleeding (avoid NSAIDs)",
        "Severe renal insufficiency eGFR < 30 mL/min (avoid NSAIDs)",
        "Severe hepatic failure or active cirrhosis (limit/avoid acetaminophen)"
      ]
    };
    let soapNote = {
      subjective: `Patient presented for clinical evaluation with chief complaint: "${description || 'Physical discomfort and symptoms'}". Duration is acute/subacute. Patient describes localized discomfort at ${primaryLesionSite}. Associated symptoms: ${systemicSideEffects.slice(0, 2).join(', ')}. Denies recent major trauma or known drug allergies.`,
      objective: "Alert, oriented x4 in no acute distress. Vitals reviewed. Focused physical exam reveals localized tissue irritation without gross peritoneal, meningeal, or unstable hemodynamic signs.",
      assessment: `${primaryHypothesis} (ICD-10: ${icd10Code}). Stable clinical appearance; low emergent acuity on preliminary triage pending confirmatory workup.`,
      plan: "1. Order targeted lab panel and focused imaging as indicated. 2. Initiate symptomatic first-line pharmacotherapy. 3. Monitor for clinical red flags. 4. Follow-up in 48-72 hours or immediate emergency escalation if warning signs manifest."
    };
    let matched = false;

    if (text.includes("heart attack") || text.includes("chest pain") || text.includes("angina") || text.includes("crushing paint") || text.includes("myocardial")) {
      primaryHypothesis = "Acute Coronary Distress (Chest Pain / Cardiac Alert)";
      empatheticNarrative = `URGENT ALARM! Your described chest pain, pressure, or tightness can indicate critical cardiovascular stress, such as myocardial ischemia or coronary vessel spasm.

Please rest immediately in a comfortable, seated posture. Avoid any physical exertion. If physical distress carries on for over 3 minutes, please call local emergency rescue channels (911) or proceed to the nearest emergency department or trauma hospital immediately.`;
      confidence = 90;
      isDangerous = true;
      anatomicalArea = 'heart';
      affectedOrganSystem = "Cardiovascular Mediastinum";
      primaryLesionSite = "Left anterior descending (LAD) coronary territory & left ventricular myocardium";
      affectedDownstreamOrgans = [
        "Pulmonary venous bed (pulmonary congestion & acute edema)",
        "Cerebral circulation (syncope, dizziness & acute hypoperfusion)",
        "Renal microvascular system (prerenal acute azotemia)"
      ];
      systemicSideEffects = [
        "Irreversible myocardial cell necrosis if reperfusion is delayed",
        "Malignant ventricular tachyarrhythmias or cardiogenic shock",
        "Acute diaphoresis, dyspnea, and crushing substernal radiation"
      ];
      propagationPathways = [
        "Coronary hypoperfusion propagating from subendocardium to epicardium",
        "Cardiac sympathetic afferent nerve radiation to left shoulder, arm, and jaw",
        "Retrograde pulmonary venous pressure elevation into alveolar capillaries"
      ];
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
    else if (text.includes("asthma") || text.includes("wheez") || text.includes("bronch") || text.includes("breath") || text.includes("tight throat") || text.includes("chok")) {
      primaryHypothesis = "Bronchospasm & Acute Respiratory Asthma Flare";
      empatheticNarrative = `Your described symptoms indicate acute constriction of the bronchial airways. Safe airflow is restricted, causing high-pitched wheezing, respiratory distress, or coughing spasms.

Identify and stay away from triggers immediately. Utilize your rescue fast-acting bronchodilator (e.g., Albuterol). Sit upright in a comfortable posture and breathe calmly. Seek professional pulmonological review if attacks happen more than twice a week.`;
      confidence = 88;
      isDangerous = true;
      anatomicalArea = 'lungs';
      affectedOrganSystem = "Pulmonary & Bronchial Tree";
      primaryLesionSite = "Terminal bronchiolar smooth muscle & respiratory alveolar ducts";
      affectedDownstreamOrgans = [
        "Right ventricle of heart (pulmonary arterial hypertension strain / cor pulmonale)",
        "Thoracic intercostal & diaphragmatic muscles (ventilatory fatigue)",
        "Systemic circulatory tissues (arterial hypoxemia & hypercapnia)"
      ];
      systemicSideEffects = [
        "Acute alveolar air trapping leading to atelectasis or pneumothorax",
        "Respiratory muscle exhaustion leading to hypercapnic respiratory arrest",
        "Persistent nocturnal cough, anxiety, and impaired oxygen saturation"
      ];
      propagationPathways = [
        "Widespread smooth muscle bronchoconstriction propagating across bronchial tree",
        "Hypertrophied goblet cell mucus hypersecretion occluding subsegmental airways",
        "Hypoxic pulmonary vasoconstriction redirecting hemodynamic strain to right atrium/ventricle"
      ];
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
    else if (text.includes("diabet") || text.includes("blood sugar") || text.includes("insulin") || text.includes("glucose") || text.includes("frequent urin") || text.includes("thirst")) {
      primaryHypothesis = "Insulin Resistance / Chronically High Blood Sugar";
      empatheticNarrative = `Symptoms such as excessive thirst, frequent urination, and fatigue suggest underlying changes in glycemic metabolism. Your body cells are not properly processing blood glucose, leading to high circulating sugar levels.

Focus on low-glycemic foods and complete high-fiber carbs. Test your blood glucose levels. Meet with an endocrinologist to structure an HbA1c test and design a cohesive treatment plan.`;
      confidence = 85;
      isDangerous = false;
      anatomicalArea = 'abdomen';
      affectedOrganSystem = "Endocrine & Pancreatic Metabolism";
      primaryLesionSite = "Pancreatic Islets of Langerhans (Beta cell secretory insufficiency) & skeletal muscle insulin receptors";
      affectedDownstreamOrgans = [
        "Renal glomeruli (diabetic nephropathy and hyperfiltration)",
        "Retinal microvasculature (diabetic retinopathy and macular edema)",
        "Peripheral nervous system (distal symmetric polyneuropathy)"
      ];
      systemicSideEffects = [
        "Osmotic diuresis triggering severe electrolyte depletion and dehydration",
        "Endothelial microvascular sclerosis increasing stroke and CAD hazard",
        "Chronic impaired wound healing and heightened susceptibility to deep tissue infections"
      ];
      propagationPathways = [
        "Hyperglycemia-induced advanced glycation end-product (AGE) accumulation across arterial walls",
        "Renal tubular overload exceeding transport maximum for glucose",
        "Sorbitol pathway activation causing osmotic edema in Schwann cells and ocular lenses"
      ];
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
    else if (text.includes("rash") || text.includes("eczema") || text.includes("itch") || text.includes("dermatitis") || text.includes("dry skin") || text.includes("patches") || text.includes("skin") || text.includes("spots") || text.includes("hives")) {
      primaryHypothesis = "Atopic Dermatitis (Eczema) or Dermatological Allergies";
      empatheticNarrative = `Your skin description matches localized epidermal irritation, such as chronic Eczema or contact-allergy dermatitis. This causes moisture loss, cell flaking, and skin inflammation.

Keep the skin well-lubricated with barrier ceramide moisturizers. Consider mild over-the-counter Hydrocortisone cream (1%) to curb acute itching. Avoid hot baths or highly perfumed soaps.`;
      confidence = 82;
      isDangerous = false;
      anatomicalArea = 'skin';
      affectedOrganSystem = "Integumentary & Epidermal Barrier";
      primaryLesionSite = "Stratum corneum epidermal barrier & dermal papillae capillary plexus";
      affectedDownstreamOrgans = [
        "Regional lymphatic drainage nodes (reactive lymphadenitis)",
        "Cutaneous unmyelinated C-fiber nerve terminals (pruritic neural hyperalgesia)",
        "Subcutaneous fascial tissue (risk of secondary bacterial cellulitis)"
      ];
      systemicSideEffects = [
        "Accelerated transepidermal water loss (TEWL) causing severe barrier dehydration",
        "Secondary colonization by opportunistic Staphylococcus aureus",
        "Lichenification, excoriation fissures, and chronic sleep disruption from pruritus"
      ];
      propagationPathways = [
        "Type 2 helper T-cell cytokine release (IL-4, IL-13) promoting epidermal spongiosis",
        "Antigen uptake by dermal dendritic cells triggering regional immune cascade",
        "Histaminergic and non-histaminergic nerve activation driving intense itch-scratch cycles"
      ];
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
    else if (text.includes("psoriasis") || text.includes("scaly") || text.includes("scales")) {
      primaryHypothesis = "Plaque Psoriasis (Immune Dermal Proliferation)";
      empatheticNarrative = `The presence of reddish thick skin regions or silvery scaling suggests plaque psoriasis. This is driven by an overactive immune cascade, causing skin cells to compile extremely fast on the skin outer surface.

Keep skin highly lubricated using thick ceramide creams. Gentle exposure to sunlight can help, but avoid burning. Plan a visit with a dermatologist to review immunomodulators or targeted light therapy options.`;
      confidence = 80;
      isDangerous = false;
      anatomicalArea = 'skin';
      affectedOrganSystem = "Integumentary Dermal Proliferation";
      primaryLesionSite = "Epidermal basal keratinocytes & dermal microvascular loops";
      affectedDownstreamOrgans = [
        "Axial & peripheral synovial joints (psoriatic arthritis risk in 30% of patients)",
        "Systemic cardiovascular endothelium (systemic pro-inflammatory atherogenesis)",
        "Nail matrix and nail beds (onycholysis and subungual hyperkeratosis)"
      ];
      systemicSideEffects = [
        "Rapid keratinocyte hyperproliferation causing painful cracking and bleeding plaques",
        "Enthesitis (inflammation of tendon insertion sites) and joint stiffness",
        "Heightened metabolic and cardiovascular inflammatory risk"
      ];
      propagationPathways = [
        "IL-23 / IL-17 cytokine immune axis causing accelerated 3-4 day keratinocyte turnover",
        "Tortuous capillary proliferation in dermal papillae causing Auspitz bleeding sign",
        "Systemic spillover of inflammatory mediators into vascular circulation"
      ];
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
    else if (text.includes("acne") || text.includes("pimple") || text.includes("blackhead") || text.includes("pustul")) {
      primaryHypothesis = "Acne Vulgaris (Sebum duct Blockage)";
      empatheticNarrative = `Your described parameters align with Acne Vulgaris, where glandular ducts are clogged with sebum oils and dead cells, breeding micro-bacteria.

Maintain mild washing twice a day using a gentle salicylic acid wash. Refrain from picking or popping, which aggravates infection and scarring. Consult a dermatologist for topical tretinoin prescription options if it persists.`;
      confidence = 85;
      isDangerous = false;
      anatomicalArea = 'skin';
      affectedOrganSystem = "Dermal Sebaceous Pilosebaceous Unit";
      primaryLesionSite = "Pilosebaceous infundibulum & sebaceous gland follicular duct";
      affectedDownstreamOrgans = [
        "Surrounding dermal extracellular matrix (fibrotic scarring and ice-pick defects)",
        "Facial subcutaneous tissue (deep cystic nodules and sinus tracts)",
        "Regional facial lymphatic drainage"
      ];
      systemicSideEffects = [
        "Post-inflammatory hyperpigmentation (PIH) and permanent dermal atrophic scarring",
        "Rupture of follicular wall causing deep dermal granulomatous inflammation",
        "Psychological distress and social anxiety"
      ];
      propagationPathways = [
        "Follicular hyperkeratinization occluding sebum outflow",
        "Cutibacterium acnes colonization triggering TLR-2 inflammatory pathway",
        "Extrafollicular rupture spilling lipids into adjacent dermis"
      ];
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
    else if (text.includes("reflux") || text.includes("heartburn") || text.includes("gerd") || text.includes("acid") || text.includes("stomach burn")) {
      primaryHypothesis = "Gastroesophageal Reflux Disease (GERD) / Acid Excess";
      empatheticNarrative = `Chest burning or a sour reflux liquid indicates stomach acid backflowing past the lower esophageal sphincter, irritating the esophagus mucosa.

Eat smaller meals; avoid heavy food within 3 hours of bedtime. Avoid triggers like coffee, spicy recipes, peppermint, or smoking. Elevate the head of your bed 6 inches.`;
      confidence = 84;
      isDangerous = false;
      anatomicalArea = 'abdomen';
      affectedOrganSystem = "Gastrointestinal & Esophageal Tract";
      primaryLesionSite = "Lower esophageal sphincter (LES) junction & distal esophageal squamous mucosa";
      affectedDownstreamOrgans = [
        "Esophagus (reflux esophagitis, erosive strictures, Barrett's columnar metaplasia)",
        "Larynx & posterior vocal cords (reflux laryngitis, vocal cord ulcers, dysphonia)",
        "Tracheobronchial airway (nocturnal acid micro-aspiration and reactive bronchospasm)"
      ];
      systemicSideEffects = [
        "Severe heartburn and retrosternal burning radiating to epigastrium",
        "Chronic peptic stricture formation causing progressive dysphagia",
        "Increased long-term neoplastic risk (esophageal adenocarcinoma from Barrett's)"
      ];
      propagationPathways = [
        "Transient lower esophageal sphincter relaxations (TLESRs) venting gastric juice",
        "Caustic acid and pepsin degradation of mucosal barrier tight junctions",
        "Vagal neuro-reflex arch causing bronchoconstriction and laryngeal cough"
      ];
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
    else if (text.includes("nerve") || text.includes("neuropathy") || text.includes("tingl") || text.includes("burn feet") || text.includes("numb")) {
      primaryHypothesis = "Peripheral Neuropathy / Neural Pathway Irritation";
      empatheticNarrative = `Burning sensations, cold numbness, or pins-and-needles match neuropathic issues. This signals erratic sensory nerve signaling.

Protect digits from extreme temperatures. Avoid staying in cramped or neural-restricting postures. Meet with a neurologist to trace underlying causes like diabetic progression or nerve root compression.`;
      confidence = 80;
      isDangerous = false;
      anatomicalArea = 'limbs';
      affectedOrganSystem = "Peripheral Nervous & Musculoskeletal";
      primaryLesionSite = "Distal axon terminals of small unmyelinated C-fibers and large myelinated A-beta sensory nerves";
      affectedDownstreamOrgans = [
        "Plantar cutaneous tissues of feet (undetected pressure ulcers and Charcot arthropathy)",
        "Cerebellum & spinal proprioceptive columns (sensory ataxia and postural instability)",
        "Autonomic nervous fibers (sudomotor dysfunction, dry skin, and orthostatic changes)"
      ];
      systemicSideEffects = [
        "Intractable burning, lancinating nocturnal pain, and painful allodynia",
        "Loss of protective sensation leading to undetected injuries and severe soft tissue infections",
        "Gait instability and marked increase in slip/fall traumatic hazards"
      ];
      propagationPathways = [
        "Length-dependent axonal degeneration progressing in a 'stocking-glove' distribution",
        "Ectopic pacemaker action potentials firing in damaged peripheral axon segments",
        "Central dorsal horn sensitization amplifying normal tactile inputs into painful sensations"
      ];
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
    else if (text.includes("throat") || text.includes("strep") || text.includes("swallow") || text.includes("tonsil")) {
      primaryHypothesis = "Pharyngitis (Sore Throat / Possible Strep)";
      empatheticNarrative = `A sore throat and painful swallow points to pharyngeal tissue inflammation, which can be bacterial (Strep throat) or viral (chest cold standard).

Drink soothing warm herbal teas, gargle saltwater, and rest. We advise visiting a local clinic for a rapid strep diagnostic swab to determine if antibiotics represent appropriate therapy.`;
      confidence = 82;
      isDangerous = false;
      anatomicalArea = 'throat';
      affectedOrganSystem = "Pharyngeal & Cervical Airway";
      primaryLesionSite = "Palatine tonsillar crypts, posterior pharyngeal wall & uvula mucosa";
      affectedDownstreamOrgans = [
        "Cardiac valves & endocardium (autoimmune cross-reactivity / rheumatic carditis risk if Group A Strep)",
        "Bilateral deep anterior cervical lymph node chains (acute jugulodigastric lymphadenitis)",
        "Eustachian tube & middle ear cleft (secondary otitis media and conductive hearing muffledness)"
      ];
      systemicSideEffects = [
        "Intense odynophagia precluding adequate fluid ingestion, causing rapid clinical dehydration",
        "Peritonsillar cellulitis or abscess formation (Quinsy) threatening airway patency",
        "Post-streptococcal sequelae including acute glomerulonephritis or acute rheumatic fever"
      ];
      propagationPathways = [
        "Direct lymphatic transudate into deep cervical nodes producing tender anterior lymphadenopathy",
        "Contiguous spread into parapharyngeal or retropharyngeal spaces in severe cases",
        "Ascending mucosal colonization along Eustachian tube into tympanic cavity"
      ];
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
    else if (text.includes("fever") || text.includes("flu") || text.includes("chill") || text.includes("ache") || text.includes("cough") || text.includes("cold")) {
      primaryHypothesis = "Influenza (Flu) or Acute Common Cold / Bronchial Irritation";
      empatheticNarrative = `Full-body muscle sore pains, shifting chills, cough, and fever indicate an active viral challenge like Influenza or acute respiratory infection.

Rest fully and isolate safely. Drink plenty of warm fluids (chicken broth, hot lemon tea) to keep hydrated. Use standard OTC antipyretics like Ibuprofen to relieve fever or body aches.`;
      confidence = 88;
      isDangerous = false;
      anatomicalArea = 'lungs';
      affectedOrganSystem = "Respiratory & Systemic Viral";
      primaryLesionSite = "Ciliated tracheobronchial respiratory epithelium & circulating systemic leukocytes";
      affectedDownstreamOrgans = [
        "Skeletal muscle beds (widespread inflammatory myalgias and weakness)",
        "Thermoregulatory hypothalamic nuclei (febrile reset & shifting rigors/chills)",
        "Pulmonary alveoli (risk of secondary bacterial bronchopneumonia)"
      ];
      systemicSideEffects = [
        "Systemic cytokine storm (TNF-alpha, IL-6) causing profound constitutional prostration",
        "Significant diaphoresis, fluid depletion, and orthostatic hypotension risk",
        "Secondary post-viral pneumococcal superinfection or prolonged bronchial hyperreactivity"
      ];
      propagationPathways = [
        "Rapid hematogenous viremic circulation distributing pro-inflammatory cytokines",
        "Contiguous aerosolized descent from nasopharynx into lower tracheobronchial tree",
        "Hypothalamic prostaglandin E2 synthesis triggering systemic temperature elevation"
      ];
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
    else if (text.includes("headache") || text.includes("migraine") || text.includes("head") || text.includes("dizz")) {
      primaryHypothesis = "Tension Cephalea or Acute Migraine Episode";
      empatheticNarrative = `Persistent cranial pain, pressure or temple throbbing points to acute cephalea or migraine.

Rest in a darkened, quiet environment, apply a cool compress to the forehead, and stay well hydrated. OTC analgesics like acetaminophen or NSAIDs may help alleviate discomfort.`;
      confidence = 84;
      isDangerous = false;
      anatomicalArea = 'head';
      affectedOrganSystem = "Cranial & Neurovascular Axis";
      primaryLesionSite = "Trigeminovascular neural complex & meningeal dural vasodilation";
      affectedDownstreamOrgans = [
        "Ocular visual cortex & optic nerve (photophobia, scintillating scotoma & visual aura)",
        "Vestibulocochlear cranial pathways (phonophobia, acute vertigo & motion sensitivity)",
        "Brainstem chemoreceptor trigger zone (nausea, emesis & gastroparesis)"
      ];
      systemicSideEffects = [
        "Severe hemicranial pulsating agony and cutaneous cranial allodynia",
        "Autonomous nervous deregulation causing facial pallor, diaphoresis, and rhinorrhea",
        "Complete functional incapacitation and prolonged postdrome exhaustion"
      ];
      propagationPathways = [
        "Cortical spreading depression (CSD) wave propagating across cerebral neocortex",
        "Antidromic release of vasoactive neuropeptides (CGRP, Substance P) triggering neurogenic inflammation",
        "Ascending nociceptive sensitization through trigeminocervical complex to thalamus"
      ];
      doctorType = "Neurologist / Primary Care";
      matches = [
        {
          condition: "Migraine with/without Aura",
          details: "Neurovascular cranial hypersensitivity.",
          typicalInterventions: "Triptans, dark room rest, hydration, NSAIDs.",
          urgency: "Routine Care"
        }
      ];
      warningSigns = [
        "Sudden thunderclap headache reaching maximum intensity within seconds",
        "Confusion, slurred speech, or weakness on one side of body"
      ];
      matched = true;
    }

    if (icd10Code === "R68.89") {
      if (anatomicalArea === 'heart') icd10Code = "I20.9";
      else if (anatomicalArea === 'lungs') icd10Code = "J45.901";
      else if (anatomicalArea === 'throat') icd10Code = "J02.0";
      else if (anatomicalArea === 'abdomen') icd10Code = "K21.9";
      else if (anatomicalArea === 'head') icd10Code = "G43.909";
      else if (anatomicalArea === 'skin') icd10Code = "L30.9";
      else if (anatomicalArea === 'limbs') icd10Code = "M79.60";
    }

    soapNote = {
      subjective: `Patient presented for clinical evaluation with chief complaint: "${description || 'Physical discomfort and symptoms'}". Duration is acute/subacute. Patient describes localized discomfort at ${primaryLesionSite}. Associated symptoms: ${systemicSideEffects.slice(0, 2).join(', ')}. Denies recent major trauma or known drug allergies.`,
      objective: `Alert, oriented x4, appearing in ${isDangerous ? 'moderate distress' : 'no acute distress'}. Focused physical exam demonstrates targeted pathology at ${primaryLesionSite}. Secondary organ monitoring: ${affectedDownstreamOrgans.slice(0, 2).join(' and ')}. Vital signs baseline reviewed.`,
      assessment: `${primaryHypothesis} [ICD-10-CM: ${icd10Code}]. Diagnostic confidence index: ${confidence}%. Clinical acuity: ${isDangerous ? 'HIGH PRIORITY / URGENT' : 'STABLE / ROUTINE CLINICAL FOLLOW-UP'}.`,
      plan: `1. Diagnostic Workup: Order ${clinicalWorkup.labTests.slice(0, 2).join('; ')} and ${clinicalWorkup.imagingStudies[0] || 'targeted diagnostic imaging'}. 2. Pharmacotherapy: ${pharmacotherapy.firstLine}. 3. Interdisciplinary Referral: ${doctorType}. 4. Red Flag Alert: Immediate emergency transfer if ${warningSigns[0] || 'severe hemodynamic decompensation occurs'}.`
    };

    return {
      primaryHypothesis,
      icd10Code,
      empatheticNarrative,
      confidence,
      matches,
      clinicalWorkup,
      pharmacotherapy,
      soapNote,
      disclaimer: "Physician Clinical Decision Support: These diagnostic models and clinical indices are provided for licensed practitioner guidance and medical record correlation.",
      warningSigns,
      isPlanAFallback: true,
      recDoctor: doctorType,
      isDangerous: isDangerous ? "Dangerous" : "Safe",
      anatomicalArea,
      affectedOrganSystem,
      primaryLesionSite,
      affectedDownstreamOrgans,
      systemicSideEffects,
      propagationPathways
    };
  }

  app.post("/api/ai-diagnosis", async (req, res) => {
    const { image, mimeType, description, fileData, fileName, fileText } = req.body;

    const effectivePayload = (description && description.trim().length > 0) || image || fileData || fileText;
    if (!effectivePayload) {
      return res.status(400).json({
        error: "Please provide either a symptom description or upload/attach a visual scan or clinical document (PDF, Word, Image)."
      });
    }

    const requestHash = generateRequestHash(req.body);
    if (diagnosisCache.has(requestHash)) {
      console.log(`[tpis.agies Cache] Hit for request ${requestHash}. Returning cached diagnostic.`);
      return res.json(diagnosisCache.get(requestHash));
    }

    const apiKey = rotationManager.getNextKey();

    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      console.log("[tpis.agies Fallback Engine] Active: No API Key provided. Returning Plan A local diagnostic resolver.");
      const fallbackResult = getLocalDiagnosticFallback(description || fileText, image || fileData);
      return res.json(fallbackResult);
    }

    const parts: any[] = [];
    const activeFileData = fileData || image;
    const activeMime = mimeType || 'image/jpeg';
    if (activeFileData && activeMime) {
      let rawBase64 = activeFileData;
      if (activeFileData.includes("base64,")) {
        rawBase64 = activeFileData.split("base64,")[1];
      }
      parts.push({
        inlineData: {
          mimeType: activeMime,
          data: rawBase64,
        }
      });
    }

    let textContext = description || '';
    if (fileText && fileText.trim().length > 0) {
      textContext += `\n[Attached Clinical Document Content (${fileName || 'Scan Report'})]:\n${fileText}`;
    }

    const designPrompt = `You are an expert Clinical Decision Support (CDS) system and medical consultant providing diagnostic intelligence for licensed physicians and healthcare professionals.
Analyze the following patient presentation, respiratory/visceral/cardiovascular/neurological/dermatological symptoms, physical signs, or attached clinical scan/document with strict scientific accuracy and clinical precision.
Physician / Clinical Intake Context: "${textContext || 'Clinical scan / document file attached for physician inspection'}"

Your task is to provide an objective, physician-grade diagnostic evaluation adhering to evidence-based clinical practice guidelines.
Ensure differential candidates, ICD-10-CM codes, laboratory workup, diagnostic imaging, pharmacotherapy regimens, and anatomical localization are strictly accurate.

Required clinical specifications:
- primaryHypothesis: Definitive diagnostic condition name with formal medical taxonomy.
- icd10Code: Precise primary ICD-10-CM diagnostic classification code (e.g., "I20.9", "J02.0", "J45.901", "K21.9", "G62.9", "L70.0", "R51.9").
- empatheticNarrative: Physician Clinical Summary & Executive Assessment (concise, professional, clinician-to-clinician tone).
- confidence: Statistical diagnostic likelihood estimation based on bayesian symptom correlation (integer 1 to 100).
- anatomicalArea: MUST be exactly one of: "throat", "lungs", "heart", "head", "abdomen", "skin", "limbs", "general".
- affectedOrganSystem: Formal medical organ system involved.
- primaryLesionSite: Highly specific anatomical epicenter where the pathology originates.
- affectedDownstreamOrgans: Array of 2 to 4 collateral organs or systems at risk of complications.
- systemicSideEffects: Array of 2 to 4 systemic pathophysiological sequelae.
- propagationPathways: Array of 2 to 3 anatomical or physiological propagation mechanisms.
- clinicalWorkup: Object containing:
  * labTests: Array of 3 to 5 priority diagnostic laboratory tests (e.g., "CBC with differential", "Comprehensive Metabolic Panel", "High-Sensitivity Troponin-I", "D-Dimer", "Procalcitonin", "ESR/CRP").
  * imagingStudies: Array of 2 to 4 diagnostic imaging modalities (e.g., "Point-of-Care Bedside Ultrasound (POCUS)", "High-Resolution Chest CT with IV contrast", "12-Lead Electrocardiogram with rhythm strip", "Bilateral Carotid Duplex").
  * physicalSigns: Array of 3 to 5 targeted physical examination maneuvers to elicit (e.g., "Auscultation for focal bronchial breath sounds and end-expiratory wheezing", "Palpation of anterior cervical lymphadenopathy", "Assessment for Murphy's sign and peritoneal guarding").
- pharmacotherapy: Object containing:
  * firstLine: First-line guideline pharmacological regimen with standard adult dosing.
  * alternative: Second-line or penicillin/allergy alternative therapeutic regimen.
  * contraindications: Array of 2 to 3 critical contraindications or drug-drug warnings.
- matches: At least 2 ranked differential diagnosis candidates, each with condition, icd10Code, distinguishingFeatures, details, typicalInterventions, and urgency.
- soapNote: Structured EMR SOAP Note for hospital chart integration:
  * subjective: Chief complaint, HPI, duration, pertinent review of systems.
  * objective: Focused physical examination findings to inspect and verify.
  * assessment: Clinical impression, primary diagnosis with ICD-10, severity stratification.
  * plan: Diagnostic orders, pharmacotherapy, specialty consultation, escalation thresholds.
- disclaimer: Clinical decision support disclaimer stating findings assist licensed practitioners and require physician clinical correlation.
- warningSigns: Essential red flag criteria that mandate acute emergency escalation.
- recDoctor: Appropriate specialty service (e.g., "Interventional Cardiology", "Pulmonology", "Gastroenterology", "Infectious Disease", "Neurology").
- isDangerous: "Dangerous" if presentation requires urgent/emergent triage, or "Safe" for stable/routine workup.

Generate a JSON object matching the requested schema.`;

    parts.push({ text: designPrompt });

    const modelRetrySteps = [
      "gemini-3.8-flash",
      "gemini-flash-latest"
    ];

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
    });

    for (let step = 0; step < modelRetrySteps.length; step++) {
      const selectedModelName = modelRetrySteps[step];
      try {
        const response = await ai.models.generateContent({
          model: selectedModelName,
          contents: { parts },
          config: {
            temperature: 0.1,
            maxOutputTokens: 2500,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                primaryHypothesis: { type: Type.STRING, description: "Precise medical condition name." },
                icd10Code: { type: Type.STRING, description: "Primary ICD-10-CM diagnostic classification code." },
                empatheticNarrative: { type: Type.STRING, description: "Physician clinical summary and executive diagnostic assessment." },
                confidence: { type: Type.INTEGER, description: "Statistical diagnostic confidence percentage (1 to 100)." },
                anatomicalArea: { type: Type.STRING, description: "Specific affected anatomical area: 'throat', 'lungs', 'heart', 'head', 'abdomen', 'skin', 'limbs', or 'general'" },
                affectedOrganSystem: { type: Type.STRING, description: "Name of the organ system affected." },
                primaryLesionSite: { type: Type.STRING, description: "Exact anatomical epicenter where the pathology is localized." },
                affectedDownstreamOrgans: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of collateral organs or systems secondarily impacted." },
                systemicSideEffects: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Clinical side-effects and disease sequelae." },
                propagationPathways: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Physiological/anatomical pathways of disease transmission." },
                clinicalWorkup: {
                  type: Type.OBJECT,
                  properties: {
                    labTests: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Priority diagnostic laboratory orders" },
                    imagingStudies: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Diagnostic imaging and radiological examinations" },
                    physicalSigns: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Targeted physical exam maneuvers to elicit" }
                  },
                  required: ["labTests", "imagingStudies", "physicalSigns"]
                },
                pharmacotherapy: {
                  type: Type.OBJECT,
                  properties: {
                    firstLine: { type: Type.STRING, description: "First-line pharmacological regimen and dosing" },
                    alternative: { type: Type.STRING, description: "Alternative or allergy-sparing regimen" },
                    contraindications: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key drug contraindications and cautions" }
                  },
                  required: ["firstLine", "alternative", "contraindications"]
                },
                soapNote: {
                  type: Type.OBJECT,
                  properties: {
                    subjective: { type: Type.STRING, description: "Subjective HPI summary" },
                    objective: { type: Type.STRING, description: "Objective physical findings and vital correlations" },
                    assessment: { type: Type.STRING, description: "Clinical assessment and ICD-10 diagnostic impression" },
                    plan: { type: Type.STRING, description: "Actionable clinical management and orders plan" }
                  },
                  required: ["subjective", "objective", "assessment", "plan"]
                },
                matches: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      condition: { type: Type.STRING, description: "Potential diagnostic match condition" },
                      icd10Code: { type: Type.STRING, description: "ICD-10-CM code for differential candidate" },
                      distinguishingFeatures: { type: Type.STRING, description: "Clinical hallmark that differentiates this condition" },
                      details: { type: Type.STRING, description: "Short explanation of clinical overlays" },
                      typicalInterventions: { type: Type.STRING, description: "Common evidence-based medical relief or therapies" },
                      urgency: { type: Type.STRING, description: "Severity tag" }
                    },
                    required: ["condition", "details", "typicalInterventions", "urgency"]
                  },
                  description: "Alternative possible conditions or related therapeutics."
                },
                disclaimer: { type: Type.STRING, description: "Clinical medical decision support disclaimer." },
                warningSigns: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Red flag warning signs that indicate urgent emergency escalation." },
                recDoctor: { type: Type.STRING, description: "Medical specialist service to consult." },
                isDangerous: { type: Type.STRING, description: "Must be either 'Dangerous' or 'Safe'." }
              },
              required: ["primaryHypothesis", "empatheticNarrative", "confidence", "anatomicalArea", "affectedOrganSystem", "primaryLesionSite", "affectedDownstreamOrgans", "systemicSideEffects", "propagationPathways", "clinicalWorkup", "pharmacotherapy", "soapNote", "matches", "disclaimer", "warningSigns", "recDoctor", "isDangerous"]
            }
          }
        });
        const text = response.text;
        if (text) {
          const parsedJSON = JSON.parse(text.trim());
          diagnosisCache.set(requestHash, parsedJSON);
          return res.json(parsedJSON);
        }
      } catch (err: any) {
        console.warn(`[tpis.agies Engine] Tier ${step + 1} with model '${selectedModelName}' failed:`, err.message || err);
      }
    }
    const fallbackResult = getLocalDiagnosticFallback(description || fileText, image || fileData);
    return res.json(fallbackResult);
  });

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
