export interface ICard {
  id: string;
  name: string;
  description: string;
}

export const cardsData: ICard[] = [
  {
    id: '1',
    name: 'Первая карточка',
    description: 'Полное и очень длинное описание для карточки.',
  },
];
