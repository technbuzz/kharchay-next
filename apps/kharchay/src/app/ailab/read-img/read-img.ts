import { Component, inject, output, signal } from '@angular/core';
import { AI, getGenerativeModel } from '@angular/fire/ai';
import { Camera } from '@capacitor/camera';
import { IonButton, IonLabel, IonImg, IonItem, IonProgressBar } from '@ionic/angular/standalone';

@Component({
  selector: 'read-img',
  imports: [IonLabel, IonProgressBar, IonButton, IonItem, IonImg],
  template: `
    <ion-item>
      <ion-label for="ing">Take a picture of ingredients</ion-label>
      <ion-button (click)="takePicture()">Take Picture</ion-button>
      <ion-img [src]="photo()" />
    </ion-item>
      @if(loading()) {
        <ion-progress-bar type="indeterminate"></ion-progress-bar>
      }
  `
})

export class ReadIMG {

  ai = inject(AI)
  model = getGenerativeModel(this.ai, { model: 'gemini-3.1-flash-lite'})

  photo = signal<undefined | string>(undefined)
  ingredients = output<string>({ alias: 'newIngredients'})
  loading = signal(false)

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

  async takePicture() {
    const capturedPhoto = await Camera.takePhoto({
      quality: 90,
    })

    this.photo.set(capturedPhoto.webPath)

    if(!capturedPhoto.webPath) return

    this.loading.set(true)


    const response = await fetch(capturedPhoto.webPath)
    const blob = await response.blob()

    const parts = await this.fileToGenerativePart(blob)

    const prompt = `Please analyze the image, list all the formatted comma-separated ingredients, give
    me ingredients only nothing else`
    console.log({ parts })

    //@ts-ignore
    const result = await this.model.generateContent([prompt, parts])
    const ing = result.response.text()
    console.log(ing)
    this.ingredients.emit(ing)

    this.loading.set(false)
  }
}
