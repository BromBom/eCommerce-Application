export interface IProfile {
  name: string;
  pic: string;
  role: string;
  contribution: string;
  bio: string;
  github: string;
}

export const team: IProfile[] = [
  {
    name: 'Igor',
    pic: '../img/igor.jpg',
    role: 'Team Leader, Main Motivator',
    contribution:
      'Created project task board and distributed tasks among team members. Developed Registration page. Developed User Profile Page.',
    bio: 'At the moment, I want to become a good programmer, a professional in my field. I persistently study the basics of programming and strive to improve my skills and horizons. I compensate for the lack of programming experience with perseverance and a technical mindset.',
    github: 'https://github.com/brombom',
  },
  {
    name: 'Vitaly',
    pic: '../img/vitali.jpg',
    role: 'Team Member, Main Contributor and A Hard Worker',
    contribution:
      'Developed product list page. Added product filtering, sorting and searching. Added interactive to product cards. Developed Product Details Page and Navigation to it.',
    bio: 'I’m very interested in the idea of working and learning distance in teams with the another learners, school teachers and people who have a knowledge of coding and web developing. I believe my knowledge and skills will serve to allow me new experience with Java Script, HTML, CSS. My strengths are: creative disciplined/focused self-control continuous Learning ',
    github: 'https://github.com/kvaker',
  },
  {
    name: 'Irina',
    pic: '../img/ira.jfif',
    role: 'Team Member, Loves Beautiful Code',
    contribution:
      'Added routing, navigation between login, registration, main page. Added logout, back/forward navigation. Added About Us page. Developed modal template.',
    bio: 'Develop web-interfaces using JavaScript, Typescript, React, Redux. I have experience working in an agile IT team. Previously worked as a marketing specialist in various companies. But I wanted not only to promote the product, but also to create it. Therefore, I decided to switch to frontend development where I constantly expand the stack and deepen my knowledge.',
    github: 'https://github.com/myr-irina',
  },
];
