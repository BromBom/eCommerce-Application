import './style.scss';
import Layout from '../../layout/layout';
import BaseComponent from '../baseComponent/baseComponent';

const MESSAGE_DEFAULT = 'Default message';

export default class Modal extends Layout {
  contentType: string;

  closeButton?: HTMLElement;

  constructor(contentType: string = MESSAGE_DEFAULT) {
    const params = {
      tag: 'div' as keyof HTMLElementTagNameMap,
      classNames: ['modal'],
    };

    super(params);

    this.contentType = contentType;

    this.configureView();
  }

  configureView() {
    const contentParams = {
      tag: 'div' as keyof HTMLElementTagNameMap,
      classNames: ['modal-content'],
      text: this.contentType,
      callback: () => null,
    };
    const content = new BaseComponent<HTMLElement>(contentParams);
    this.viewElementCreator.addInnerElement(content);

    const buttonParams = {
      tag: 'button' as keyof HTMLElementTagNameMap,
      classNames: ['close'],
      text: 'Close',
      callback: () => this.closeModal(),
    };
    const button = new BaseComponent<HTMLElement>(buttonParams);
    content.addInnerElement(button);

    this.closeButton = button.getElement() as HTMLElement | undefined;

    if (this.closeButton !== undefined) {
      this.closeButton.addEventListener('click', () => this.closeModal());
    }
  }

  closeModal() {
    this.viewElementCreator.getElement()!.style.display = 'none';
  }

  openModal() {
    const element = this.viewElementCreator.getElement();
    if (element !== null) {
      element.style.display = 'block';
    }
  }
}
