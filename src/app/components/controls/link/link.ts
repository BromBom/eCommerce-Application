import './link.scss';

export default class Link {
  linkElements: any;
  constructor(pageParam, linkElements) {
    this.linkElements = linkElements;
    this.configureView(pageParam);
  }

  setSelectedStatus() {
    this.linkElements.forEach((linkElement) => linkElement.setNotSelectedStatus());

    const element = document.createElement('div');
    element.classList.add('nav-item__selected');
  }

  setNotSelectedStatus() {
    const element = document.createElement('div');
    element.classList.remove('nav-item__selected');
  }

  configureView(pageParam) {
    const element = document.createElement('div');
    element.textContent = pageParam.name;
    element.addEventListener('click', this.setSelectedStatus.bind(this));
  }
}
