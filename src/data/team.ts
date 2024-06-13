export interface IProfile {
  id: string;
  name: string;
  pic: string;
  role: string;
  contribution: string;
  bio: string;
  github: string;
}

export const team: IProfile[] = [
  {
    id: '1',
    name: 'Igor',
    pic: 'igor.jpg',
    role: 'Team Leader',
    contribution: 'Description',
    bio: 'At the moment, I want to become a good programmer, a professional in my field. I persistently study the basics of programming and strive to improve my skills and horizons. I compensate for the lack of programming experience with perseverance and a technical mindset.',
    github: 'https://github.com/brombom',
  },
  {
    id: '3',
    name: 'Vitaly',
    pic: 'vitali.jpg',
    role: 'Team Member',
    contribution: 'Description',
    bio: 'I’m very interested in the idea of working and learning distance in teams with the another learners, school teachers and people who have a knowledge of coding and web developing. I believe my knowledge and skills will serve to allow me new experience with Java Script, HTML, CSS. My strengths are: creative disciplined/focused self-control continuous Learning ',
    github: 'https://github.com/kvaker',
  },
  {
    id: '2',
    name: 'Irina',
    pic: 'ira.jfif',
    role: 'Team Member',
    contribution: 'Description',
    bio: 'Develop web-interfaces using JavaScript, Typescript, React, Redux. I have experience working in an agile IT team. Previously worked as a marketing specialist in various companies. But I wanted not only to promote the product, but also to create it. Therefore, I decided to switch to frontend development where I constantly expand the stack and deepen my knowledge.',
    github: 'https://github.com/myr-irina',
  },
];
