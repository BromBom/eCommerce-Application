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

    //  name
    const nameLabelParams = {
      tag: 'label' as keyof HTMLElementTagNameMap,
      classNames: ['name'],
      text: this.profileCard.name,
      callback: () => null,
    };
    const nameLabel = new BaseComponent(nameLabelParams);
    profileCard.addInnerElement(nameLabel);

    //  role
    const roleLabelParams = {
      tag: 'p' as keyof HTMLElementTagNameMap,
      classNames: ['role'],
      text: this.profileCard.role,
      callback: () => null,
    };
    const roleLabel = new BaseComponent(roleLabelParams);
    profileCard.addInnerElement(roleLabel);

    //  contribution
    const descriptionLabelParams = {
      tag: 'p' as keyof HTMLElementTagNameMap,
      classNames: ['contribution'],
      text: this.profileCard.contribution,
      callback: () => null,
    };
    const descriptionLabel = new BaseComponent(descriptionLabelParams);
    profileCard.addInnerElement(descriptionLabel);

    // bio
    const bioLabelParams = {
      tag: 'p' as keyof HTMLElementTagNameMap,
      classNames: ['bio'],
      text: this.profileCard.bio,
      callback: () => null,
    };
    const bioLabel = new BaseComponent(bioLabelParams);
    profileCard.addInnerElement(bioLabel);

    // image
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
    profileCard.addInnerElement(img);
  }
}
