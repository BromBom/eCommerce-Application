This project is an online portal for purchasing branded clothing and accessories, which provides users with ample opportunities, from searching for products to placing an order. The application provides interactivity, engagement and ease of use.

Users can choose from a wide range of clothing presented, view their detailed descriptions, add the items they like to the cart and proceed to checkout.

The project includes features such as user registration and login, product search and sorting.

The application is responsive and displays correctly on various devices with a minimum resolution of 390 pixels. This feature makes the shopping experience enjoyable, regardless of the user's device.

## Technology stack

The application is developed in a static modular builder [`Wabpack`](https://webpack.js.org/) in a strongly typed programming language [`TypeScript`](https://www.typescriptlang.org/), with connection of a standard set of auxiliary tools:
 - [`Sass`](https://sass-lang.com/) - preprocessor for simplified work with CSS files.
 - [`ESLint`](https://eslint.org/) - JavaScript programming language linter designed to parse and evaluate patterns in code.
 - [`Prettier`](https://prettier.io/) - tool for auto-formatting code, aimed at using strictly defined rules for program design.
 - [`Husky`](https://typicode.github.io/husky/) - automatically lint your commit messages, code, and run tests upon committing or pushing.
 - [`Jest`](https://jestjs.io/) - JavaScript testing framework designed to ensure correctness of any JavaScript codebase.

 ### Available scripts

 - `npm run start` - launch `Webpack` server in development mode.
 - `npm run build` - launch `Webpack` to collect production bundle.
 - `npm run lint` - start `ESlint` checks.
 - `npm run ci:format` - start `Prettier` checking issues.
 - `npm run format` - start `Prettier` auto-formatting.
 - `npm run test` - start `Jest` testing.

 ## Setup instructions

 1. Install `Node.js`.
 2. Clone this repository: `git clone https://github.com/BromBom/eCommerce-Application.git`.
 3. Go to folder `eCommerce-Application`.
 4. To install all dependencies use `npm install`.
