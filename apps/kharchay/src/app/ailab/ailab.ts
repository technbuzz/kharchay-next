import { Component, effect, inject, OnInit, signal, viewChild } from '@angular/core';
import { IonContent, IonItem, IonList, IonSelect, IonTextarea, IonSelectOption, IonButton, IonLoading, IonLabel, IonImg, IonIcon } from '@ionic/angular/standalone';
import { getGenerativeModel, AI  } from '@angular/fire/ai'
import { FormsModule, NgForm  } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { marked } from 'marked'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ReadIMG } from './read-img/read-img';
import { addIcons } from 'ionicons';
import { playOutline, stopOutline } from 'ionicons/icons';

import { SpeakResult, SpeechSynthesis } from '@capgo/capacitor-speech-synthesis';
import { AILabService } from './ailabService';
import { Recipe, RecipeDetails } from './recipe/recipe';


@Component({
  standalone: true,
  imports: [IonContent, IonIcon, RecipeDetails, ReadIMG, IonLoading, IonImg, IonLabel, FormsModule, JsonPipe, IonTextarea, IonButton, IonList, IonItem, IonSelect, IonSelectOption],
  templateUrl: './ailab.html'
})

export class AILab {

  domSanitizer = inject(DomSanitizer)
  loading = viewChild.required(IonLoading)
  ai = inject(AI)

  service = inject(AILabService)

  ingredients = signal('onion, potato, tomato')
  utterReady = signal(true)
  uttering = signal(false)

  speechSynthesis = SpeechSynthesis

  constructor() {
    addIcons({ playOutline, stopOutline })
  }

  model = getGenerativeModel(this.ai, { model: 'gemini-3.1-flash-lite'})
  // result = signal<SafeHtml>('')
  result = signal<string | SafeHtml>('<p>With these three staple ingredients, the best Pakistani dish you can make is <strong>Aloo Tamatar ki Bhujia</strong> (Potato and Tomato Curry). This is a quintessential "comfort food" dish in Pakistan, often served with hot <em>roti</em> or <em>paratha</em>.</p>')
  // result = signal< Recipe | undefined>(undefined)

  async getRecipe(form: NgForm) {
    this.loading().present()
    const prompt = `Using the following list of ingredints, create a recipt
    in the ${form.value.cuisine} cuisine: ${form.value.ingredients}.
      Provide the final output strictly in ${form.value.language}`

    try {
      const result = await this.model.generateContent(prompt)
      const htmlString = await marked(result.response.text())
      const safeHTML = this.domSanitizer.bypassSecurityTrustHtml(htmlString)
      this.result.set(safeHTML)
      console.log({ response: result })
    } catch (error) {
      console.log(error)
    }

    this.loading().dismiss()

    this.utterReady.set(true)
    this.utteranceId.set(undefined)

  }

  async getStructuredRecipe(form: NgForm) {
    const result = await this.service.getStructuredJsonRecipe(form.value.ingredients, form.value.cuisine)
    const { title, ...rest } = JSON.parse(result.response.text())
    this.result.set({ title, ...rest })

    const genImage = await this.service.genRecipeImage(title)
    console.log({ img: genImage.response.text() })

    console.log({ result: JSON.parse(result.response.text()) })
  }



  utteranceId = signal<SpeakResult | undefined>(undefined)

  async utterRecipe(el: HTMLElement, language: string = 'en-US') {
    console.log({language})
    this.uttering.set(true)
    console.log({ langs: this.speechSynthesis.getLanguages() })
    console.log({ voices: this.speechSynthesis.getVoices() })
    // console.log({ languages: getLang })

    if(this.utteranceId()) {
      await this.speechSynthesis.resume()
    } else {
      this.utteranceId.set(await this.speechSynthesis.speak({
        text: el.innerText,
        language
      }))

      this.speechSynthesis.addListener('end', event => {
        this.uttering.set(false)
        this.utteranceId.set(undefined)
      })

      // SpeechSynthesis.addListener('boundary', event => {
      //   const range = document.createRange()
      //   range.setStart(el.childNodes[0], event.charIndex)
      //   const end = event.charLength ? event.charLength : 1
      //   range.setEnd(el.childNodes[0], event.charIndex + end)
      //   const highlight = new Highlight(range)
      //   console.log(event.charIndex, event.charLength)
      // })
    }



  }

  #effectuttering = effect(() => {
    console.log("uttering", this.uttering())
  })

  async stopUtter() {
    await this.speechSynthesis.pause()
    this.uttering.set(false)
  }




}
