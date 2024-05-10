import BaseComponent from '../baseComponent';

const Button = (classes: string[], text: string) => new BaseComponent<HTMLButtonElement>('button', classes, text);

export default Button;
