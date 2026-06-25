import { inject, Injectable } from '@angular/core';
import { AI, getGenerativeModel, Schema } from '@angular/fire/ai';

@Injectable({providedIn: 'root'})
export class CreateAIService {

  ai = inject(AI)

  async fileToGenerativePart(file: Blob) {
    const result = new Promise(resolve => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result ? (reader.result as string).split(',')[1] : '');

      reader.readAsDataURL(file)
    })

    return {
      inlineData: { data: await result, mimeType: file.type }
    }

  }


  async getStructuredJsonReceipt(file: Blob) {
    const parts = await this.fileToGenerativePart(file)

    const recipeScheme = Schema.object({
      properties: {
        date: Schema.string({ format: 'date-time' }),
        totalPrice: Schema.number(),
        note: Schema.string({
          description: `Extract all individual purchased items, capturing the item name, quantity, unit of measurement (such as "G", "kg", or "pieces"), and the individual item price if visible. 3. CRITICAL LANGUAGE RULE: Completely ignore, omit, and do not include any items that are written in the Arabic language. Only extract and list items that are written in English or other Latin-script languages.`
        })
        // ingredients: Schema.array({ items: Schema.string() }),
        // tags: Schema.array({ items: Schema.string() }),
      }
    })

    const model = getGenerativeModel(this.ai, {
      model: 'gemini-3.1-flash-lite',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: recipeScheme
      }
    })

    const prompt = `Analyze this receipt image. Locate the transaction date and the final total price paid.`;

    //@ts-ignore
    return model.generateContent([prompt, parts])
  }
}
