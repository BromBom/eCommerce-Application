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
    const labelTagParams = {
      tag: 'span' as keyof HTMLElementTagNameMap,
      classNames: ['label-tag'],
      text: '',
      callback: () => null,
    };

    const nameLabelParams = {
      ...labelTagParams,
      text: 'name',
    };
    const nameLabel = new BaseComponent(nameLabelParams);

    const nameParams = {
      tag: 'span' as keyof HTMLElementTagNameMap,
      classNames: ['name'],
      text: `${this.profileCard.name}`,
      callback: () => null,
    };
    const name = new BaseComponent(nameParams);

    const textWrapper = new BaseComponent<HTMLElement>({
      tag: 'div' as keyof HTMLElementTagNameMap,
      classNames: ['text-wrapper'],
      text: '',
      callback: () => null,
    });

    profileDescriptionWrapper.addInnerElement(textWrapper);
    textWrapper.addInnerElement(nameLabel);
    textWrapper.addInnerElement(name);

    //  role
    const roleLabelParams = {
      tag: 'span' as keyof HTMLElementTagNameMap,
      classNames: ['label-tag'],
      text: '',
      callback: () => null,
    };

    const roleLabel = {
      ...roleLabelParams,
      text: 'role',
    };
    const role = new BaseComponent(roleLabel);

    const roleTextParams = {
      tag: 'p' as keyof HTMLElementTagNameMap,
      classNames: ['role'],
      text: `${this.profileCard.role}`,
      callback: () => null,
    };
    const roleText = new BaseComponent(roleTextParams);

    const roleTextWrapper = new BaseComponent<HTMLElement>({
      tag: 'div' as keyof HTMLElementTagNameMap,
      classNames: ['text-wrapper'],
      text: '',
      callback: () => null,
    });
    profileDescriptionWrapper.addInnerElement(roleTextWrapper);
    roleTextWrapper.addInnerElement(role);
    roleTextWrapper.addInnerElement(roleText);

    //  contribution
    const contributionLabelParams = {
      tag: 'span' as keyof HTMLElementTagNameMap,
      classNames: ['label-tag'],
      text: '',
      callback: () => null,
    };

    const contributionLabel = {
      ...contributionLabelParams,
      text: 'contribution',
    };
    const contribution = new BaseComponent(contributionLabel);

    const descriptionTextParams = {
      tag: 'p' as keyof HTMLElementTagNameMap,
      classNames: ['contribution'],
      text: `${this.profileCard.contribution}`,
      callback: () => null,
    };
    const descriptionTextWrapper = new BaseComponent<HTMLElement>({
      tag: 'div' as keyof HTMLElementTagNameMap,
      classNames: ['text-wrapper'],
      text: '',
      callback: () => null,
    });
    const descriptionText = new BaseComponent(descriptionTextParams);
    profileDescriptionWrapper.addInnerElement(descriptionTextWrapper);
    descriptionTextWrapper.addInnerElement(contribution);
    descriptionTextWrapper.addInnerElement(descriptionText);

    // bio
    const bioLabelParams = {
      tag: 'span' as keyof HTMLElementTagNameMap,
      classNames: ['label-tag'],
      text: '',
      callback: () => null,
    };

    const bioLabel = {
      ...bioLabelParams,
      text: 'bio',
    };
    const bio = new BaseComponent(bioLabel);

    const bioTextParams = {
      tag: 'p' as keyof HTMLElementTagNameMap,
      classNames: ['bio'],
      text: `${this.profileCard.bio}`,
      callback: () => null,
    };
    const bioTextWrapper = new BaseComponent<HTMLElement>({
      tag: 'div' as keyof HTMLElementTagNameMap,
      classNames: ['text-wrapper'],
      text: '',
      callback: () => null,
    });
    const bioText = new BaseComponent(bioTextParams);
    profileDescriptionWrapper.addInnerElement(bioTextWrapper);
    bioTextWrapper.addInnerElement(bio);
    bioTextWrapper.addInnerElement(bioText);

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
      text: `${this.profileCard.github}`,
      callback: () => null,
    };
    const github = new BaseComponent(githubParams);
    profileDescriptionWrapper.addInnerElement(github);
  }
}
