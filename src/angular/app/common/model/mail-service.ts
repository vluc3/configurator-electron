import {DnService} from "./dn-service";

export interface MailService extends DnService {
  defaultPassword: string;
  antivirusInputPort: number;
  antispamInputPort: number;
  antivirusOutputPort: number;
  smtpImapInputPort: number;
}
