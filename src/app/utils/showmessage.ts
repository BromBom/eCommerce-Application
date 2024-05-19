import './showmessage.scss';

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
  const messageOverlay = document.getElementById('message-overlay');
  if (messageOverlay) {
    messageOverlay.innerHTML = `
            <div class="card m-5">
                <div id="message-overlay-content" class="card-body font-weight-bold">${message}</div>
                <a id="message-overlay-close-button" class="btn btn-primary">OK</a>
            </div>
        `;
    messageOverlay.classList.add('active');
    const closeButton = document.getElementById('message-overlay-close-button');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        messageOverlay.classList.remove('active');
        if (callback) {
          callback();
        }
      });
    }
  }
};

export function handleError(error: Error, message: string): void {
  console.error(error);
  showMessage(message);
}

// export const redirectUser = (): void => {
//   if (getCartItems().length !== 0) {
//     document.location.hash = '/address';
//   } else {
//     document.location.hash = '/';
//   }
// };
