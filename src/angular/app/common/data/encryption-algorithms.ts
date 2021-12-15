import {Option} from "../model/ip-sec-service";

const encryptionAlgorithms: Option[] = [
  {
    name: "AES_CBC_128",
    enabled: false,
    value: `<transform type="ENCR_ALGO" keylength="128">AES_CBC</transform>`
  },
  {
    name: "AES_CBC_192",
    enabled: false,
    value: `<transform type="ENCR_ALGO" keylength="192">AES_CBC</transform>`
  },
  {
    name: "AES_CBC_256",
    enabled: true,
    value: `<transform type="ENCR_ALGO" keylength="256">AES_CBC</transform>`
  },
  {
    name: "CAST_128",
    enabled: false,
    value: `<transform type="ENCR_ALGO" keylength="128">CAST</transform>`
  },
  {
    name: "AES_GCM_16_128",
    enabled: false,
    value: `<transform type="ENCR_ALGO" keylength="128">AES_GCM_16</transform>`
  },
  {
    name: "AES_GCM_16_192",
    enabled: false,
    value: `<transform type="ENCR_ALGO" keylength="192">AES_GCM_16</transform>`
  },
  {
    name: "AES_GCM_16_256",
    enabled: false,
    value: `<transform type="ENCR_ALGO" keylength="256">AES_GCM_16</transform>`
  },
  {
    name: "DES",
    enabled: false,
    value: `<transform type="ENCR_ALGO">DES</transform>`
  },
  {
    name: "3DES_CBC",
    enabled: false,
    value: `<transform type="ENCR_ALGO">3DES</transform>`
  }];

export default encryptionAlgorithms;
