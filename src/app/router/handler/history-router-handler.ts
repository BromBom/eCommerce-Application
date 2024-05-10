interface RequestParams {
  path: string;
  resource: string;
}

export default class HistoryRouterHandler {
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

  navigate(event: Event) {
    if (event instanceof PopStateEvent) {
      const url = event.state as string;
      this.setHistory(url);
    }

    const urlString = String(window.location[this.params.locationField as keyof Location]).slice(1);

    const result: RequestParams = { path: '', resource: '' };
    const path = urlString.split('/');
    [result.path = '', result.resource = ''] = path;

    this.callback(result);
  }

  disable() {
    window.removeEventListener(this.params.nameEvent, this.handler);
  }

  setHistory(url: string) {
    window.history.pushState(null, '', `/${url}`);
  }
}
