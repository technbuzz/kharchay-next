import { Component } from '@angular/core';
import { getStorage, ref } from 'firebase/storage'

@Component({
  selector: 'receipt-upload',
  templateUrl: 'receipt-upload.html'
})

export class ReceiptUpload {
  storage = getStorage();
  expenseRef = ref(this.storage, 'expenseupload')

}
