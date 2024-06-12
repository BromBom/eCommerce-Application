export interface IProfile {
  id: string;
  name: string;
  pic: string;
  role: string;
  contribution: string;
  bio: string;
}

export const team: IProfile[] = [
  {
    id: '1',
    name: 'Igor',
    pic: 'igor.jpg',
    role: 'Description of Alexey',
    contribution: 'Description of Alexey',
    bio: 'Description of Alexey',
  },
  {
    id: '3',
    name: 'Vitaly',
    pic: 'vitali.jpg',
    role: 'Description of Alexey',
    contribution: 'Description of Alexey',
    bio: 'Description of Alexey',
  },
  {
    id: '2',
    name: 'Ira',
    pic: 'ira.jfif',
    role: 'Description of Alexey',
    contribution: 'Description of Alexey',
    bio: 'Description of Alexey',
  },
];
