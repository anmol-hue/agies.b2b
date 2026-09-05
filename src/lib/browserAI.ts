import { pipeline } from '@xenova/transformers';

/**
 * BrowserAI: Stable Clinical Summary Engine
 * Logic: Simple Research -> Simple Summary
 * This version is stripped of all complexity to ensure 100% stability.
 */
export class BrowserAI {
  private textGenerator: any = null;

  async init() {
    if (this.textGenerator) return;
    try {
      // Using a stable text-generation model
      this.textGenerator = await pipeline('text-generation', 'Xenova/phi-1_5');
    } catch (e) {
      console.error("[BrowserAI] Model load failed:", e);
    }
  }

  async generateQueries(symptoms: string, visualDescriptors: string): Promise<string[]> {
    try {
      await this.init();
      if (!this.textGenerator) throw new Error("AI not loaded");

      const prompt = `Medical search queries for: ${symptoms} ${visualDescriptors}. List 3 separated by |`;
      const result = await this.textGenerator(prompt, { max_new_tokens: 64 });
      const text = result[0]?.generated_text || result[0]?.text || "";
      return text.split('|').map((q: string) => q.trim()).filter(q => q.length > 0);
    } catch (e) {
      return [`differential diagnosis for ${symptoms}`];
    }
  }

  async synthesize(symptoms: string, visualDescriptors: string, researchData: any[]) {
    await this.init().catch(() => {});

    if (!researchData || researchData.length === 0) {
      return {
        primaryHypothesis: "No Evidence Found",
        confidence: 0,
        empatheticNarrative: "No medical evidence was found for these symptoms.",
        anatomicalArea: "general",
        isDangerous: "Safe",
        rawResearch: []
      };
    }

    // Use the first and most relevant search result as the primary hypothesis
    const winner = researchData[0];
    let primaryHypothesis = winner.title;
    let empatheticNarrative = `Based on research from ${winner.title}, the findings suggest: ${winner.snippet}`;

    try {
      if (this.textGenerator) {
        const prompt = `Instruction: Summarize this medical finding in one professional English sentence.
Finding: ${winner.snippet}
Patient: ${symptoms}
Summary:`;
        const result = await this.textGenerator(prompt, { max_new_tokens: 100, temperature: 0.1 });
        const text = result[0]?.generated_text || result[0]?.text || "";
        const summary = text.includes('Summary:') ? text.split('Summary:')[1].trim() : text.trim();

        if (summary.length > 10) {
          empatheticNarrative = summary;
        }
      }
    } catch (e) {
      console.warn("AI summary failed, using raw snippet");
    }

    return {
      primaryHypothesis,
      confidence: 50, // Baseline confidence for research-based results
      empatheticNarrative,
      anatomicalArea: "general",
      isDangerous: "Safe",
      rawResearch: researchData
    };
  }
}

export const browserAI = new BrowserAI();
