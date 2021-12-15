import {Component, HostBinding, ViewEncapsulation} from '@angular/core';
import {StateService} from "../common/service/state.service";
import {ModalService} from "../common/component/modal/modal.service";
import {home} from "../common/utils/utils";
import {secretPassword, secretVars} from "../common/data/ansible";
import {ElectronService} from "../common/service/electron.service";
import {ExportComponent} from "./export/export.component";
import {esxVars, getVault, globalVars} from "../common/utils/ansible-esx";

@Component({
  selector: 'div[topNav]',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TopNavComponent {

  @HostBinding("class") clazz = "top-nav bg-dark";

  constructor(
    private stateService: StateService,
    private modalService: ModalService,
    private electronService: ElectronService
  ) {
  }

  home() {
    home(this.modalService).subscribe(close => {
      if (!close.cancel && close.data) {
      }
    });
  }

  export() {
    if (this.electronService.isElectron) {
      this.electronService.dialog.showOpenDialog({
        properties: ['openDirectory']
      }).then(result => {
        if (result.canceled) {
          return;
        }
        this.modalService.open<any>({
          title: "Mot de passe de chiffrement du fichier ansible_secret_vars.yml",
          component: ExportComponent,
          width: 600,
          data: {}
        }).subscribe(close => {
          if (close.cancel) {
            return;
          }
          const dir = result.filePaths[0];
          let vault = new this.electronService.Vault({password: secretPassword});
          this.stateService.getCurrent().hosts.forEach((host, index) => {
            host.id = `ext${index + 1}`;
          })
          vault.decrypt(secretVars).then(decrypt => {
            const secretVars = `${decrypt}${getVault(this.stateService.getCurrent())}`;
            vault = new this.electronService.Vault({password: close.data.password});
            // console.log(secretVars);
            vault.encrypt(secretVars).then(async encrypt => {
              this.electronService.fs.writeFileSync(
                `${dir}/${ExportComponent.ANSIBLE_SECRET_VARS}`,
                encrypt
              );
            });
            this.electronService.fs.writeFileSync(
              `${dir}/${ExportComponent.ANSIBLE_ESX_VARS}`,
              esxVars(this.stateService.getCurrent().hosts)
            );

            this.electronService.fs.writeFileSync(
              `${dir}/${ExportComponent.ANSIBLE_GLOBAL_VARS}`,
              globalVars(this.stateService.getCurrent())
            );
          });
        });
      });
    }
  }

  save() {
    this.stateService.save();
  }
}
