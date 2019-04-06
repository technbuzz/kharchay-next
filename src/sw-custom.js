(function () {
  'use strict';
  
  self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    console.log('notification details: ', event.notification);
  });
}());