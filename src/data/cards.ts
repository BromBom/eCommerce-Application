export interface ICard {
  id: string;
  name: string;
  description: string;
}

export const cardsData: ICard[] = Array(10)
  .fill(0)
  .map((_, i) => ({
    id: `${i + 1}`,
    name: `Card ${i + 1}`,
    description: `Description of a card ${i + 1}`,
  }));
