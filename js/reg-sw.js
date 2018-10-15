// Register service worker 
if (navigator.serviceWorker) {
    navigator.serviceWorker.register('/sw.js').then(function(reg) {
      console.log("Service Worker registered!");
    }).catch((e) => {
      console.log("Unable to register service worker, check logs... \n", e);
    });
  }