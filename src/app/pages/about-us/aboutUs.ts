import { team } from '../../../data/team';
import BaseComponent from '../../components/baseComponent/baseComponent';
import Layout from '../../layout/layout';
import Router from '../../router/router';
import './aboutUs.scss';
import ProfileCard from './profileCard/profileCard';

export default class AboutUs extends Layout {
  router: Router;

  constructor(router: Router) {
    const params = {
      tag: 'section' as keyof HTMLElementTagNameMap,
      classNames: ['about-us'],
    };
    super(params);

    this.router = router;

    this.configureView();
  }

  configureView() {
    const logoParams = {
      tag: 'a' as keyof HTMLElementTagNameMap,
      classNames: ['rs-logo'],
      text: '',
      attributes: {
        target: '_blank',
        href: 'https://rs.school/',
      },
      callback: () => null,
    };
    const logoCreator = new BaseComponent<HTMLElement>(logoParams);

    const logoContainer = new BaseComponent<HTMLElement>({
      tag: 'div' as keyof HTMLElementTagNameMap,
      classNames: ['logo-container'],
      text: '',
      callback: () => null,
    });
    logoContainer.addInnerElement(logoCreator);

    const mainContainer = new BaseComponent<HTMLElement>({
      tag: 'div' as keyof HTMLElementTagNameMap,
      classNames: ['main-container'],
      text: '',
      callback: () => null,
    });

    this.viewElementCreator.addInnerElement(logoContainer);
    this.viewElementCreator.addInnerElement(mainContainer);

    const titleWrapper = new BaseComponent<HTMLElement>({
      tag: 'div' as keyof HTMLElementTagNameMap,
      classNames: ['title-wrapper'],
      text: '',
      callback: () => null,
    });
    mainContainer.addInnerElement(titleWrapper);

    const teamPic = new BaseComponent<HTMLElement>({
      tag: 'div' as keyof HTMLElementTagNameMap,
      classNames: ['team-pic'],
      text: '',
      callback: () => null,
    });

    titleWrapper.addInnerElement(teamPic);

    const title = new BaseComponent<HTMLElement>({
      tag: 'h1' as keyof HTMLElementTagNameMap,
      classNames: ['about-us-title'],
      text: 'OUR TEAM',
      callback: () => null,
    });
    titleWrapper.addInnerElement(title);

    const profileCards = AboutUs.addProfilesToView();

    profileCards.forEach((card) => {
      mainContainer.addInnerElement(card.getHtmlElement());
    });

    const collaborationSection = new BaseComponent<HTMLElement>({
      tag: 'div' as keyof HTMLElementTagNameMap,
      classNames: ['collaboration-section'],
      text: '',
      callback: () => null,
    });

    const collabTitle = new BaseComponent<HTMLElement>({
      tag: 'p' as keyof HTMLElementTagNameMap,
      classNames: ['collab-title'],
      text: 'COLLABORATION',
      callback: () => null,
    });

    const collabInfo = new BaseComponent<HTMLElement>({
      tag: 'p' as keyof HTMLElementTagNameMap,
      classNames: ['collab-info'],
      text: 'Our team succeeded because we worked well together. We talked every other day on Discord to share ideas, make plans, and divide work evenly. Regularly talking things over helped us solve problems quickly and decide what steps to take next. This teamwork kept everyone motivated and led to a great project outcome.',
      callback: () => null,
    });

    collaborationSection.addInnerElement(collabTitle);
    collaborationSection.addInnerElement(collabInfo);
    mainContainer.addInnerElement(collaborationSection);
  }

  static addProfilesToView(): ProfileCard[] {
    const profileCards: ProfileCard[] = [];
    team.forEach((card) => {
      const cardComponent = new ProfileCard(card);
      profileCards.push(cardComponent);
    });
    return profileCards;
  }
}
