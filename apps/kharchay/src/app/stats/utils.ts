import { collectionCount, collectionData } from "@angular/fire/firestore";
import { endOfMonth } from "date-fns/endOfMonth";
import { endOfWeek } from "date-fns/endOfWeek";
import { startOfMonth } from "date-fns/startOfMonth";
import { startOfWeek } from "date-fns/startOfWeek";
import { collection, Firestore, getAggregateFromServer, query, where, sum } from "firebase/firestore";

export function getWeeklyQuery(firestore: Firestore, timestamp: Date) {
  const expenseGroup = collection(firestore, 'expense')
  const basicStartMonth = startOfWeek(timestamp);
  const basicEndMonth = endOfWeek(timestamp);
  console.log({ basicStartMonth, basicEndMonth })
  const expenseQuery = query(
    expenseGroup,
    where('date', '>=', basicStartMonth),
    where('date', '<=', basicEndMonth),
  )
  return expenseQuery
}

export function getMonthlyQuery(firestore: Firestore, timestamp: Date) {
  const expenseGroup = collection(firestore, 'expense')
  const basicStartMonth = startOfMonth(timestamp);
  const basicEndMonth = endOfMonth(timestamp);
  console.log({ basicStartMonth, basicEndMonth })
  const expenseQuery = query(
    expenseGroup,
    where('date', '>=', basicStartMonth),
    where('date', '<=', basicEndMonth),
  )
  return expenseQuery
}

//const coll = collection(firestore, 'cities');
//const q = query(coll, where('capital', '==', true));
//const snapshot = await getAggregateFromServer(q, {
//  totalPopulation: sum('population')
//});
//
//console.log('totalPopulation: ', snapshot.data().totalPopulation);


