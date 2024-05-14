interface RequestParams {
  path: string;
  resource: string;
}

export default class HistoryRouterHandler {
  private history: string[] = [];

  params: {
    nameEvent: string;
    locationField: string;
  };

  callback: (params: RequestParams) => void;

  handler: (event: Event) => void;

  constructor(callback: (params: RequestParams) => void) {
    this.params = {
      nameEvent: 'popstate',
      locationField: 'pathname',
    };
    this.callback = callback;
    this.handler = this.navigate.bind(this);

    window.addEventListener(
      this.params.nameEvent as keyof WindowEventMap,
      this.handler as EventListenerOrEventListenerObject
    );
  }

  navigate(url: Event | null) {
    if (url === null) {
      return;
    }

    if (typeof url === 'string') {
      this.setHistory(url);
    }

    const urlString = ((window.location as Location)[this.params.locationField as keyof Location] as string).slice(1);

    const result: RequestParams = {
      path: '',
      resource: '',
    };
    const path = urlString.split('/');
    [result.path = '', result.resource = ''] = path;

    this.callback(result);
  }

  disable() {
    window.removeEventListener(this.params.nameEvent, this.handler);
  }

  setHistory(url: string) {
    this.history.push(url);
    window.history.pushState(null, '', `/${url}`);
  }
}
