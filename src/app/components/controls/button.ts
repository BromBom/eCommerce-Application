import SimpleComponent from '../simpleComponent';

const Button = (classes: string[], text: string) => new SimpleComponent<HTMLButtonElement>('button', classes, text);

export default Button;
