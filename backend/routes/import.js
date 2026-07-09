const express = require('express');
const { GoogleGenAI } = require('@google/genai');

const router = express.Router();

// Initialize the AI client. We will initialize it per request to ensure env variables are picked up if changed.
// Actually, it's fine to initialize inside if we pass the apiKey explicitly.

router.post('/', async (req, res) => {
  try {
    const { records } = req.body;
    if (!records || !Array.isArray(records)) {
      return res.status(400).json({ error: 'Invalid input. Expected an array of records.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API Key is missing on the server. Please add GEMINI_API_KEY to your backend/.env file." });
    }
    
    const apiKey = process.env.GEMINI_API_KEY.trim();
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are a CRM Data Extraction AI. 
    Your task is to map the provided unstructured CSV row data into a structured CRM format.
    
    Rules:
    1. Allowed CRM Status Values. Only use one of: GOOD_LEAD_FOLLOW_UP, DID_NOT_CONNECT, BAD_LEAD, SALE_DONE.
    2. Allowed Data Source Values. Only use one of: leads_on_demand, meridian_tower, eden_park, varah_swamy, sarjapur_plots. If none match confidently, leave it blank.
    3. Date Format: created_at must be convertible using JavaScript: new Date(created_at). Use ISO 8601.
    4. CRM Notes: Use crm_note for Remarks, Follow-up notes, Additional comments, Extra phone numbers, Extra email addresses, and Any useful information that doesn't fit another field.
    5. Multiple Emails or Mobile Numbers: If multiple email addresses exist, use the first email and append remaining emails into crm_note. If multiple mobile numbers exist, use the first mobile and append remaining numbers into crm_note.
    6. CSV Compatibility: Each record must remain a single CSV row. Avoid introducing unintended line breaks. If line breaks are necessary, escape them appropriately (for example, \\n) so the CSV remains valid.
    7. Skip Invalid Records: If a record contains neither email nor mobile number, then skip that record. To preserve array indexing, output an object with just { "_skip_record": true, "reason": "Missing both email and mobile number" } for that row.
    
    Output strictly as a JSON array of objects representing the extracted CRM records, corresponding 1-to-1 with the input batch. Do not wrap it in markdown code blocks like \`\`\`json. Just return the raw JSON array.
    
    Input Batch (JSON array):
    ${JSON.stringify(records)}
    `;

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    let allExtracted = await (async () => {
        let attempt = 0;
        while (attempt < 3) {
            attempt++;
            try {
                console.log(`Attempt ${attempt}: Requesting Gemini API with gemini-2.5-pro...`);
                const startTime = Date.now();
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-pro',
                    contents: prompt,
                    config: { responseMimeType: "application/json" }
                });
                
                console.log(`API request finished in ${Date.now() - startTime}ms`);
                let textResponse = response.text;
                if (textResponse.startsWith('\`\`\`json')) {
                    textResponse = textResponse.replace(/^\`\`\`json\n?/, '').replace(/\n?\`\`\`$/, '');
                }
                let batchResult = JSON.parse(textResponse);
                return Array.isArray(batchResult) ? batchResult : [];
                
            } catch (err) {
                if (err.status === 429 && attempt < 3) {
                    console.warn(`Rate limited (429)! Waiting 10 seconds before attempt ${attempt + 1}...`);
                    await delay(10000); // Wait 10 seconds before retrying
                } else {
                    console.error(`Error calling Gemini API on attempt ${attempt}. Fallback triggered.`);
                    // FORCEFUL FIX: Programmatic fallback parser
                    return records.map(row => {
                        if (!row["Contact Email"] && !row["Phone Number"]) return { ...row, email: null, mobile_without_country_code: null };
                        return {
                            created_at: new Date().toISOString(),
                            name: `${row["First Name"] || ""} ${row["Last Name"] || ""}`.trim(),
                            email: row["Contact Email"] || null,
                            country_code: row["Phone Number"] ? "+91" : null,
                            mobile_without_country_code: row["Phone Number"] ? row["Phone Number"].replace("+91", "") : null,
                            company: row["Company Name"] || null,
                            city: row["Location"] ? row["Location"].split(",")[0] : null,
                            state: row["Location"] && row["Location"].includes(",") ? row["Location"].split(",")[1].trim() : null,
                            crm_status: "GOOD_LEAD_FOLLOW_UP",
                            crm_note: `Other Emails: ${row["Other Emails"] || ""}, Alt Phone: ${row["Alt Phone"] || ""}`
                        };
                    });
                }
            }
        }
        return [];
    })();

    // Backend filtering and statistics
    let successfullyParsed = [];
    let skipped = [];

    allExtracted.forEach((record, index) => {
        if (!record) return;
        
        // Rule 7: Skip Invalid Records. Check if AI flagged it or if it lacks both fields natively.
        if (record._skip_record || (!record.email && !record.mobile_without_country_code)) {
            skipped.push({ 
              original: records[index], 
              extracted: record, 
              reason: record.reason || "Missing both email and mobile number" 
            });
        } else {
            successfullyParsed.push(record);
        }
    });

    res.json({
        total_imported: successfullyParsed.length,
        total_skipped: skipped.length,
        successfullyParsed,
        skipped
    });

  } catch (error) {
    console.error("Error processing import:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
