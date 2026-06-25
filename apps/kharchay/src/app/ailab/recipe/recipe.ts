import { Component, input } from '@angular/core';

export type Recipe = {
  title: string,
  ingredients: string[],
  instructions: string[],
  prepTime: string,
  cookTime: string,
  servings: string,
  tags: string[]
}

@Component({
  selector: 'recipe',
  templateUrl: './recipe.html'
})

export class RecipeDetails {

  value = input<Recipe>()
}
