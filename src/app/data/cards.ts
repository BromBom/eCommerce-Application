export interface ICard {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  stock: number;
}

export const cardsData: ICard[] = Array(10)
  .fill(0)
  .map((_, i) => ({
    id: `${i + 1}`,
    name: `Card ${i + 1}`,
    image: `https://example.com/image${i + 1}.jpg`,
    price: (i + 1) * 10,
    stock: (i + 1) * 5,
    description: `Description of a card ${i + 1}`,
  }));
