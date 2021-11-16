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
