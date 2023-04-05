export interface Firewall {
  name?: string;
  inputIp: string;
  inputInterfaceDescription?: string;
  inputInterfaceName?: string;
  outputIp: string;
  outputInterfaceDescription?: string;
  outputInterfaceName?: string;
  username?: string;
  password?: string;
}
