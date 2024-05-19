import { InputType } from '../types/types';

function creatInputWithLabel(
  element: HTMLInputElement,
  textLabel: string,
  placeholder: string,
  type: InputType = 'text'
) {
  const label = document.createElement('label');
  const span = document.createElement('span');
  label.classList.add('label');
  span.textContent = textLabel;
  element.setAttribute('type', type);
  element.setAttribute('placeholder', placeholder);
  label.append(span, element);

  return label;
}

export default creatInputWithLabel;
