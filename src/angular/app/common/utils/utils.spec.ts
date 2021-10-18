import {clone, copyEntries, isIpValid, isMaskValid, isNetworkValid} from "./utils";
import {
  dhcpDnsService,
  ejbcaService,
  ipSecService,
  mailService,
  ntpService,
  openVpnService,
  toipWebUiService
} from "./data";
import hosts from "../data/hosts.json";
import {Host} from "../model/host";
import {Subject} from "rxjs";

export const stateService = {
  current: {
    name: "Text Config",
    hosts: clone(hosts) as Host[],
    services: {
      dhcpDnsService,
      ntpService,
      mailService,
      toipWebUiService,
      ejbcaService,
      openVpnService,
      ipSecService
    },
    serviceKeys: [
      dhcpDnsService,
      ntpService,
      mailService,
      toipWebUiService,
      ejbcaService,
      openVpnService,
      ipSecService
    ]
  },
  getCurrent: () => {
    return stateService.current;
  },
  getService: (key: string) => {
    return stateService.current.services[key];
  },
  currentChange$: new Subject()
};

describe('Utils functions', () => {

  it('Test copyEntries', () => {
    let to = null;
    let from = {key1: "Key1", key2: "Key2", key3: "Key3"};
    copyEntries(to, from);
    expect(to).toBeFalsy();

    to = {key2: "Key2 to", key4: "Key4"};
    copyEntries(to, from, {ignore: ["key2", "key3"]});
    expect(to).toEqual({key1: "Key1", key2: "Key2 to", key4: "Key4"});

    copyEntries(to, from);
    expect(to).toEqual({key1: "Key1", key2: "Key2", key3: "Key3", key4: "Key4"});
  });

  it('Test isIpValid', () => {
    expect(isIpValid("192.168.1.2")).toBeTruthy();
    expect(isIpValid(null)).toBeTruthy();
    expect(isIpValid("192.168.1.02")).toBeFalse();
    expect(isIpValid("192.168.1.256")).toBeFalse();
  });

  it('Test isMaskValid', () => {
    expect(isMaskValid("128.0.0.0")).toBeTruthy();
    expect(isMaskValid("128.128.0.0")).toBeFalsy();
    expect(isMaskValid("255.255.255.0")).toBeTruthy();
    expect(isMaskValid("255.255.255.253")).toBeFalsy();
  });

  it('Test isNetworkValid', () => {
    expect(isNetworkValid("192.168.0.10", "255.255.255.248", "192.168.0.11")).toBeTruthy();
    expect(isNetworkValid("192.168.0.10", "255.255.255.0", "192.168.0.11")).toBeTruthy();
    expect(isNetworkValid("192.168.0.10", "255.255.254.0", "192.168.0.11")).toBeTruthy();
    expect(isNetworkValid("192.168.0.10", "255.255.240.0", "192.168.0.11")).toBeTruthy();
    expect(isNetworkValid("192.168.0.10", "255.255.0.0", "192.168.0.11")).toBeTruthy();
    expect(isNetworkValid("192.168.0.10", "255.128.0.0", "192.168.0.11")).toBeTruthy();
    expect(isNetworkValid("192.168.0.10", "128.0.0.0", "192.168.0.11")).toBeTruthy();
    expect(isNetworkValid("192.168.0.10", "255.255.255.0", "192.168.0.11")).toBeTruthy();
    expect(isNetworkValid("192.168.0.10", "255.255.0.0", "192.168.1.11")).toBeTruthy();

    expect(isNetworkValid("192.168.0.10", "255.255.255.252", "192.168.0.11")).toBeFalsy(); // l'adresse de la passerelle est celle du broadcast
    expect(isNetworkValid("192.168.0.10", "255.255.255.252", "192.168.0.8")).toBeFalsy(); // l'adresse de la passerelle est celle du réseau
    expect(isNetworkValid("192.168.0.10", "255.255.255.248", "192.168.0.16")).toBeFalsy(); // l'adresse de la passerelle n'est pas sur le meme sous réseau
    expect(isNetworkValid("192.168.0.10", "255.255.255.0", "192.168.1.11")).toBeFalsy(); // l'adresse de la passerelle n'est pas sur le meme sous réseau
    expect(isNetworkValid("192.168.0.10", "255.255.255.0", "192.167.0.11")).toBeFalsy(); // l'adresse de la passerelle n'est pas sur le meme sous réseau
    expect(isNetworkValid("192.168.0.10", "255.255.255.0", "192.169.0.11")).toBeFalsy(); // l'adresse de la passerelle n'est pas sur le meme sous réseau
    expect(isNetworkValid("192.168.0.10", "255.255.0.0", "92.168.1.11")).toBeFalsy();// l'adresse de la passerelle n'est pas sur le meme sous réseau
    expect(isNetworkValid("192.168.0.10", "255.255.255.253", "192.168.1.11")).toBeFalsy(); // erreur de masque de sous réseau
    expect(isNetworkValid("192.168.0.10", "128.128.0.0", "192.168.1.11")).toBeFalsy(); // erreur de masque de sous réseau
  });
});