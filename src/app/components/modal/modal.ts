import './style.scss';
import Layout from '../../layout/layout';
import BaseComponent from '../baseComponent/baseComponent';

export default class Modal extends Layout {
  closeButton?: HTMLElement;

  contentImage: HTMLElement | null;

  constructor(contentImage: HTMLElement | null) {
    const params = {
      tag: 'div' as keyof HTMLElementTagNameMap,
      classNames: ['modal'],
    };

    super(params);

    this.contentImage = contentImage;

    this.configureView();
  }

  configureView() {
    const contentParams = {
      tag: 'div' as keyof HTMLElementTagNameMap,
      classNames: ['modal-content'],
      text: '',
      callback: () => null,
    };
    const content = new BaseComponent<HTMLElement>(contentParams);
    this.viewElementCreator.addInnerElement(content);

    const imageContainerParams = {
      tag: 'div' as keyof HTMLElementTagNameMap,
      classNames: ['image-container'],
      callback: () => null,
    };

    const imageContainer = new BaseComponent<HTMLElement>(imageContainerParams);
    content.addInnerElement(imageContainer);

    const buttonParams = {
      tag: 'button' as keyof HTMLElementTagNameMap,
      classNames: ['close'],
      text: 'X',
      callback: () => null,
    };
    const button = new BaseComponent<HTMLElement>(buttonParams);

    content.addInnerElement(button);

    this.closeButton = button.getElement() as HTMLElement | undefined;

    if (this.closeButton !== undefined) {
      this.closeButton.addEventListener('click', () => Modal.closeModal(this.viewElementCreator.getElement()!));
    }
  }

  static closeModal(element: HTMLElement) {
    if (element) {
      element.classList.toggle('active');
      element.firstElementChild!.firstElementChild?.firstElementChild?.remove();
    }
  }

  static openModal(element: HTMLElement) {
    if (element) {
      element.classList.toggle('active');
    }
  }
}
