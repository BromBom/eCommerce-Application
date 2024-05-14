import Layout from '../../layout/layout';
import State from '../../state/state';
import Input from '../../components/controls/input/input';
import { Params } from '../../components/baseComponent/baseComponent';

const FIELD_USERNAME = 'Поле для ввода имени';
const FIELD_USERSURNAME = 'Поле для ввода фамилии';

export default class Registration extends Layout {
  state: State;

  constructor(state: State) {
    const params = {
      tag: 'section' as keyof HTMLElementTagNameMap,
      classNames: ['registration'],
    };
    super(params);
    this.state = state;
    this.configureView(state);
  }

  configureView(state: State) {
    let inputParams: Params = {
      tag: 'input',
      classNames: [],
      text: FIELD_USERNAME,
      callback: (event) => this.keyupHandler(event, FIELD_USERNAME),
    };
    let creatorInput = new Input(inputParams);
    creatorInput.createElement(inputParams);
    creatorInput.setValue(state.getField(FIELD_USERNAME));
    this.viewElementCreator.addInnerElement(creatorInput);

    inputParams = {
      tag: 'input',
      classNames: [],
      text: FIELD_USERSURNAME,
      callback: (event) => this.keyupHandler(event, FIELD_USERSURNAME),
    };
    creatorInput = new Input(inputParams);
    creatorInput.createElement(inputParams);
    creatorInput.setValue(state.getField(FIELD_USERSURNAME));
    this.viewElementCreator.addInnerElement(creatorInput);
  }

  keyupHandler(event: MouseEvent, fieldName: string) {
    if (event.target instanceof HTMLInputElement) {
      this.state.setField(fieldName, event.target.value);
    }
  }
}
