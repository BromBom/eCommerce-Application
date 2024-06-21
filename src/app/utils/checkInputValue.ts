function checkInputValue(
  inputElement: HTMLInputElement,
  massageErrorElement: HTMLParagraphElement,
  min: number,
  regex: string,
  errorText: string
) {
  inputElement.setAttribute('pattern', regex);
  const massageError = massageErrorElement;
  if (inputElement.value.length <= min) {
    massageError.textContent = `Must be > ${min} char`;
  } else if (!inputElement.checkValidity()) {
    massageError.textContent = errorText;
  } else {
    massageError.textContent = '';
  }

  if (inputElement.value.length === 0) {
    massageError.textContent = '';
  }
}

export default checkInputValue;
