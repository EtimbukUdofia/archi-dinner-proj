function showNotification(message, type = 'success', duration = 8000) {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  requestAnimationFrame(() => {
      notification.classList.add("show");
  });

  setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
          notification.remove();
      }, 500);
  }, duration);
}


  