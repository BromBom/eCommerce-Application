import App from './app/app';
import { queryProduct } from './api/project';
import './style.scss';

const app = new App();

app.createView();
queryProduct();
