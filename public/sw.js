self.addEventListener("push", (event) => {
  const data = event.data.json();

  if (data.type === "incoming_call") {
    event.waitUntil(
      self.registration.showNotification(`${data.fromUser.name} is calling`, {
        body: data.callType === "audio" ? "Voice Call" : "Video Call",
        icon: data.fromUser.avatar,
        badge: "/icons/call-badge.png",
        vibrate: [200, 100, 200],
        data,
        actions: [
          { action: "accept", title: "Accept" },
          { action: "reject", title: "Reject" }
        ]
      })
    );
  }
});

self.addEventListener("notificationclick", (event) => {
  const data = event.notification.data;

  if (event.action === "accept") {
    clients.openWindow(`/call/${data.callId}`);
  }

  if (event.action === "reject") {
    fetch("/api/calls/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ callId: data.callId }),
    });
  }

  event.notification.close();
});
