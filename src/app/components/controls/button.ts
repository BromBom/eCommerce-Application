import BaseComponent from '../baseComponent';

const Button = (classes: string[], text: string) =>
  new BaseComponent('button', classes, text);

export default Button;