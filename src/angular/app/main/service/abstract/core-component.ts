import {Directive, OnInit} from '@angular/core';

import {
  intRegex,
  ipRegex,
  keypressRegex,
  intAlphaSeparatorRegex,
  alphaSeparatorRegex
} from "../../../common/utils/utils";

@Directive()
export abstract class CoreComponent implements OnInit {

  protected constructor() {
  }

  ngOnInit(): void {
  }

  keypress(event: KeyboardEvent, regex: string): boolean {
    return keypressRegex(event, regex);
  }

  intKeypress(event: KeyboardEvent): boolean {
    return keypressRegex(event, intRegex);
  }

  intAlphaSeparatorKeypress(event: KeyboardEvent): boolean {
    return keypressRegex(event, intAlphaSeparatorRegex);
  }

  alphaSeparatorKeypress(event: KeyboardEvent): boolean {
    return keypressRegex(event, alphaSeparatorRegex);
  }

  ipKeypress(event: KeyboardEvent): boolean {
    return keypressRegex(event, ipRegex);
  }
}
