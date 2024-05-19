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

  handler: (event: PopStateEvent | null) => void;

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

  navigate(url: PopStateEvent | string | null) {
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
    window.removeEventListener(
      this.params.nameEvent as keyof WindowEventMap,
      this.handler as EventListenerOrEventListenerObject
    );
  }

  setHistory(url: string) {
    this.history.push(url);
    window.history.pushState(null, '', `/${url}`);
  }
}
