import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Firestore, collection, collectionData, firestoreInstance$, query, where } from '@angular/fire/firestore';
// import { AngularFireFunctions } from "@angular/fire/functions";
import { concatMap, first, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class EventService {

  // eventsCollectionRef: AngularFirestoreCollection<any>
  // constructor(private afs: Firestore, private fireFunctions: AngularFireFunctions) {}
  constructor(private afs: Firestore) {}

  getEvents(): Observable<any[]> {
    return firestoreInstance$.pipe(
      first(),
      concatMap(firestore => collectionData(collection(firestore, 'events')))
    ) 
    
    
    // this.afs.collection('events', ref => ref.orderBy('date')).valueChanges()
  }



  /**
   * Providing the arguments, this function searches the Events Collection 
   * reference, whether a month is prepared for Events. If a month is prepared
   * this means we have root Collection for a month in question.
   * @param start Start Date
   * @param end End Date
   */
  searchAndRetriveEventByMonth(start: Date, end: Date) {
    // this.eventsCollectionRef = this.afs.collection(
    //   'events',
    //   ref => ref.where('date', '>=', start).where('date', '<=', end)
    // )

    // return this.eventsCollectionRef.valueChanges()
    const ref = collection(this.afs, 'events');
    return query(ref, 
      where('date', '>=', start),
      where('date', '<=', end )
    )
  }

  /**
   * If root collection for the month is not set, or the month is not prepared
   * for events that this function does that exact job.
   * @param monthYear Month Year as 4-2020
   * @param selectedMonth Selected month from Ionic date selector
   */
  // addNewCollectionMonthRoot(monthYear: string, selectedMonth: Date) {
  //   const id = this.afs.createId()
  //   return this.eventsCollectionRef.doc(id).set({
  //     id,
  //     date: new Date(selectedMonth),
  //     name: monthYear,
  //     events: []
  //   })
  // }

  // createEventList(month, name: string) {
  //   const uniqueId = this.afs.createId()
  //   const newEventRef = this.eventsCollectionRef.doc(month.id)
  //   const subCollectionRef = newEventRef.collection(uniqueId)
    
  //   return {
  //     execute: from(newEventRef.update({
  //       events: [...month.events, {
  //         id: uniqueId,
  //         name,
  //         month: month.date,
  //         subCollectionRef: subCollectionRef.ref.path
  //       }]
  //     })),
  //     data: {
  //       uniqueId,
  //       subCollectionRef
  //     }
  //   }
  // }

  /**
   * @description It creates the collection and first document inside it
   * @param ref A reference to the collection
   * @param uniqueId A uniqueId for the collection name and first Document
   */
  // addSubCollection(ref: AngularFirestoreCollection, data = {}): void {
  //   const id = this.afs.createId()
  //   ref.doc(id).set({
  //     id,
  //     price: '$2222',
  //     subCollectionRef: ref.ref.path,
  //     ...data
  //   }).then(resp => {
  //     console.log(resp)
  //   }).catch(error => console.log(error))
  // }

  // removeEventList(month, event) {
  //   const newArray = month.events.filter(me => me.id !== event.id)
  //   from(this.afs.doc(`events/${month.id}`).update({
  //     events: newArray
  //   })).subscribe()

  //   this.deleteCollectionByPath(event.subCollectionRef)
  // }

  // private deleteCollectionByPath(path) {
  //   var deleteFn = this.fireFunctions.httpsCallable('recursiveDelete')
  //   deleteFn({ path }).pipe(take(1)).subscribe(result => {
  //     console.log('Delete success: ' + JSON.stringify(result));
  //   }, error => {
  //     console.log('Delete failed, see console,');
  //     console.warn(error);
  //   })
  // }
  
}