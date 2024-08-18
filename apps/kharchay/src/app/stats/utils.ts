import { collectionData } from "@angular/fire/firestore";
import { endOfMonth } from "date-fns/endOfMonth";
import { endOfWeek } from "date-fns/endOfWeek";
import { startOfMonth } from "date-fns/startOfMonth";
import { startOfWeek } from "date-fns/startOfWeek";
import { collection, Firestore, query, where } from "firebase/firestore";

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
  const expenseQuery = query(
    expenseGroup,
    where('date', '>=', basicStartMonth),
    where('date', '<=', basicEndMonth),
  )
  return expenseQuery
}
