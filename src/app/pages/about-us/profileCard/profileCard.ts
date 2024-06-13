import './profileCard.scss';
import BaseComponent from '../../../components/baseComponent/baseComponent';
import Layout from '../../../layout/layout';
import { IProfile } from '../../../../data/team';

export default class ProfileCard extends Layout {
  profileCard: IProfile;

  constructor(profileCard: IProfile) {
    const params = {
      tag: 'article' as keyof HTMLElementTagNameMap,
      classNames: ['profile-card'],
    };
    super(params);

    this.profileCard = profileCard;
    this.configureView();
  }

  configureView() {
    const profileCard = new BaseComponent<HTMLElement>({
      tag: 'div' as keyof HTMLElementTagNameMap,
      classNames: ['profile-card'],
      text: '',
      callback: () => null,
    });
    this.viewElementCreator.addInnerElement(profileCard);

    const profilePicWrapper = new BaseComponent<HTMLElement>({
      tag: 'div' as keyof HTMLElementTagNameMap,
      classNames: ['profile-pic-wrapper'],
      text: '',
      callback: () => null,
    });

    const profileDescriptionWrapper = new BaseComponent<HTMLElement>({
      tag: 'div' as keyof HTMLElementTagNameMap,
      classNames: ['profile-description-wrapper'],
      text: '',
      callback: () => null,
    });

    profileCard.addInnerElement(profilePicWrapper);
    profileCard.addInnerElement(profileDescriptionWrapper);

    //  name
    const nameLabelParams = {
      tag: 'p' as keyof HTMLElementTagNameMap,
      classNames: ['name'],
      text: `name: ${this.profileCard.name}`,
      callback: () => null,
    };
    const nameLabel = new BaseComponent(nameLabelParams);
    profileDescriptionWrapper.addInnerElement(nameLabel);

    //  role
    const roleLabelParams = {
      tag: 'p' as keyof HTMLElementTagNameMap,
      classNames: ['role'],
      text: `role: ${this.profileCard.role}`,
      callback: () => null,
    };
    const roleLabel = new BaseComponent(roleLabelParams);
    profileDescriptionWrapper.addInnerElement(roleLabel);

    //  contribution
    const descriptionLabelParams = {
      tag: 'p' as keyof HTMLElementTagNameMap,
      classNames: ['contribution'],
      text: `contribution: ${this.profileCard.contribution}`,
      callback: () => null,
    };
    const descriptionLabel = new BaseComponent(descriptionLabelParams);
    profileDescriptionWrapper.addInnerElement(descriptionLabel);

    // bio
    const bioLabelParams = {
      tag: 'p' as keyof HTMLElementTagNameMap,
      classNames: ['bio'],
      text: `bio: ${this.profileCard.bio}`,
      callback: () => null,
    };
    const bioLabel = new BaseComponent(bioLabelParams);
    profileDescriptionWrapper.addInnerElement(bioLabel);

    // pic
    const imgParams = {
      tag: 'img' as keyof HTMLElementTagNameMap,
      classNames: ['profile-pic'],
      attributes: {
        src: this.profileCard.pic,
        alt: `${this.profileCard.name}'s profile`,
      },
      callback: () => null,
    };
    const img = new BaseComponent(imgParams);
    profilePicWrapper.addInnerElement(img);

    // link
    const githubParams = {
      tag: 'a' as keyof HTMLElementTagNameMap,
      classNames: ['github'],
      attributes: {
        href: this.profileCard.github,
        target: '_blank',
      },
      text: `github: ${this.profileCard.github}`,
      callback: () => null,
    };
    const github = new BaseComponent(githubParams);
    profileDescriptionWrapper.addInnerElement(github);
  }
}
