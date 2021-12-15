/* SystemJS module definition */
declare const nodeModule: NodeModule;

interface NodeModule {
  id: string;
}

interface Window {
  process: any;
  require: any;
}

declare class Vault {

  constructor(config: { password: string });

  decrypt(str: string): Promise<string>;

  encrypt(str: string): Promise<string>;
}

declare namespace bootstrap {
  export class Modal {

    constructor(element: HTMLElement, config: any);

    show(element?: HTMLElement);

    toggle(element?: HTMLElement);

    hide();

    dispose();

    handleUpdate();

    _triggerBackdropTransition();
  }
}




declare namespace nx.ui {
  class Application {
    container(element: HTMLElement): void;
  }
}

declare namespace nx.graphic {
  class Topology {
    constructor(data: any);

    data(data: any): void;

    attach(app: nx.ui.Application): void;

    getLayer(groups: string): any;
  }

  class Icons {
    static registerIcon(name: string, url: string, width: number, height: number): void;

    static registerFontIcon(name: string, fontfamily: string, fontCharacter: string, fontSize: number): void;
  }
}
