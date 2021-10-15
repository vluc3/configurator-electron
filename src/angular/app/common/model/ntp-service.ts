import {Service} from "./service";

export interface NtpService extends Service{
  defaultNtpServers: string[];
}
