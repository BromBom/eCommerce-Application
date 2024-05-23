export const showLoading = (): void => {
  const loadingOverlay = document.getElementById('loading-overlay');
  if (loadingOverlay) {
    loadingOverlay.classList.add('active');
  }
};

export const hideLoading = (): void => {
  const loadingOverlay = document.getElementById('loading-overlay');
  if (loadingOverlay) {
    loadingOverlay.classList.remove('active');
  }
};

export const showMessage = (message: string, callback?: () => void): void => {
  const messageContainer = document.getElementById('message-container');

  if (messageContainer) {
    messageContainer.innerHTML = `
      <div class="message-content">
        <div class="message-text">${message}</div>
        <button id="message-close-button" class="message-close-button">OK</button>
      </div>
    `;
    messageContainer.classList.add('active');

    const closeButton = document.getElementById('message-close-button');
    if (closeButton) {
      const closeOverlay = () => {
        messageContainer.classList.remove('active');
        if (callback) {
          callback();
        }
        hideLoading();
      };

      closeButton.addEventListener('click', closeOverlay);

      setTimeout(closeOverlay, 5000);
    }
  }
};

export function handleError(error: Error, message: string): void {
  // console.error(error);
  showMessage(message, () => {
    hideLoading();
  });
}

// export const redirectUser = (): void => {
//   if (getCartItems().length !== 0) {
//     document.location.hash = '/address';
//   } else {
//     document.location.hash = '/';
//   }
// };
