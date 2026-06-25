import { inject, Injectable } from '@angular/core';
import { AI } from '@angular/fire/ai';
import { getGenerativeModel, ResponseModality, Schema } from 'firebase/ai';

@Injectable({providedIn: 'root'})
export class AILabService {
  ai = inject(AI)

  getStructuredJsonRecipe(ingredients: string, cuisine: string) {
    const recipeScheme = Schema.object({
      properties: {
        title: Schema.string(),
        ingredients: Schema.array({ items: Schema.string() }),
        tags: Schema.array({ items: Schema.string() }),
        // instructions: Schema.string({ description: 'Markdown-formatted recipe instructions' }),
        instructions: Schema.array({ items: Schema.string() }),
        prepTime: Schema.string(),
        cookTime: Schema.string(),
        servings: Schema.string(),
      }
    })

    const model = getGenerativeModel(this.ai, {
      model: 'gemini-3.1-flash-lite',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: recipeScheme
      }
    })

    const prompt = `Using the following list of ingredints, create a recipt
    in the ${cuisine} cuisine: ${ingredients} keep it shorter`

    return model.generateContent(prompt)
  }



  genRecipeImage(title: string) {
    const model = getGenerativeModel(this.ai, {
      model: 'gemini-2.5-flash-image',
      generationConfig: {
        responseModalities: [ResponseModality.TEXT, ResponseModality.IMAGE]
      }
    })

    const prompt = `Generate a high quality recipe image for ${title}. It should be well lit and look delicious`

    return model.generateContent(prompt)
  }

}
