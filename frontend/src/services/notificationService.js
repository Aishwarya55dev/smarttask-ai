/*export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    return;
  }

  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }
}

export function showNotification(title, body) {
  if (!("Notification" in window)) return;

  if (Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: "/vite.svg",
    });
  }
}
  */
 export async function requestNotificationPermission() {
  if (!("Notification" in window)) return;

  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }
}

export function showNotification(title, body) {
  console.log("showNotification called");

  if (!("Notification" in window)) {
    console.log("Notifications not supported");
    return;
  }

  console.log(Notification.permission);

  if (Notification.permission === "granted") {
    console.log("Creating notification...");

    
    new Notification(title, {
  body,
  requireInteraction: true,
});
  }
}