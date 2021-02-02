const defaultRfProfile = {
  is5GHz: {
    model_type: 'RfElementConfiguration',
    radioType: 'is5GHz',
    radioMode: 'modeAC',
    rf: 'SaaS-rf',
    beaconInterval: 100,
    forceScanDuringVoice: 'disabled',
    rtsCtsThreshold: 65535,
    channelBandwidth: 'is80MHz',
    mimoMode: 'twoByTwo',
    maxNumClients: 100,
    autoChannelSelection: false,
    activeScanSettings: {
      model_type: 'ActiveScanSettings',
      enabled: true,
      scanFrequencySeconds: 10,
      scanDurationMillis: 65,
    },
    neighbouringListApConfig: {
      model_type: 'NeighbouringAPListConfiguration',
      minSignal: -85,
      maxAps: 25,
    },
    minAutoCellSize: -65,
    perimeterDetectionEnabled: true,
    channelHopSettings: {
      model_type: 'ChannelHopSettings',
      noiseFloorThresholdInDB: -75,
      noiseFloorThresholdTimeInSeconds: 180,
      nonWifiThresholdInPercentage: 50,
      nonWifiThresholdTimeInSeconds: 180,
      obssHopMode: 'NON_WIFI',
    },
    bestApEnabled: null,
    multicastRate: 'auto',
    managementRate: 'auto',
    rxCellSizeDb: -90,
    probeResponseThresholdDb: -90,
    clientDisconnectThresholdDb: -90,
    eirpTxPower: 18,
    bestApSettings: {
      model_type: 'RadioBestApSettings',
      mlComputed: true,
      dropInSnrPercentage: 30,
      minLoadFactor: 40,
    },
  },
  is2dot4GHz: {
    model_type: 'RfElementConfiguration',
    radioType: 'is2dot4GHz',
    radioMode: 'modeN',
    rf: 'TipWlan-rf',
    beaconInterval: 100,
    forceScanDuringVoice: 'disabled',
    rtsCtsThreshold: 65535,
    channelBandwidth: 'is20MHz',
    mimoMode: 'twoByTwo',
    maxNumClients: 100,
    autoChannelSelection: false,
    activeScanSettings: {
      model_type: 'ActiveScanSettings',
      enabled: true,
      scanFrequencySeconds: 10,
      scanDurationMillis: 65,
    },
    neighbouringListApConfig: {
      model_type: 'NeighbouringAPListConfiguration',
      minSignal: -85,
      maxAps: 25,
    },
    minAutoCellSize: -65,
    perimeterDetectionEnabled: true,
    channelHopSettings: {
      model_type: 'ChannelHopSettings',
      noiseFloorThresholdInDB: -75,
      noiseFloorThresholdTimeInSeconds: 180,
      nonWifiThresholdInPercentage: 50,
      nonWifiThresholdTimeInSeconds: 180,
      obssHopMode: 'NON_WIFI',
    },
    bestApEnabled: null,
    multicastRate: 'auto',
    managementRate: 'auto',
    rxCellSizeDb: -90,
    probeResponseThresholdDb: -90,
    clientDisconnectThresholdDb: -90,
    eirpTxPower: 18,
    bestApSettings: {
      model_type: 'RadioBestApSettings',
      mlComputed: true,
      dropInSnrPercentage: 20,
      minLoadFactor: 50,
    },
  },
  is5GHzU: {
    model_type: 'RfElementConfiguration',
    radioType: 'is5GHzU',
    radioMode: 'modeAC',
    rf: 'TipWlan-rf',
    beaconInterval: 100,
    forceScanDuringVoice: 'disabled',
    rtsCtsThreshold: 65535,
    channelBandwidth: 'is80MHz',
    mimoMode: 'twoByTwo',
    maxNumClients: 100,
    autoChannelSelection: false,
    activeScanSettings: {
      model_type: 'ActiveScanSettings',
      enabled: true,
      scanFrequencySeconds: 10,
      scanDurationMillis: 65,
    },
    neighbouringListApConfig: {
      model_type: 'NeighbouringAPListConfiguration',
      minSignal: -85,
      maxAps: 25,
    },
    minAutoCellSize: -65,
    perimeterDetectionEnabled: true,
    channelHopSettings: {
      model_type: 'ChannelHopSettings',
      noiseFloorThresholdInDB: -75,
      noiseFloorThresholdTimeInSeconds: 180,
      nonWifiThresholdInPercentage: 50,
      nonWifiThresholdTimeInSeconds: 180,
      obssHopMode: 'NON_WIFI',
    },
    bestApEnabled: null,
    multicastRate: 'auto',
    managementRate: 'auto',
    rxCellSizeDb: -90,
    probeResponseThresholdDb: -90,
    clientDisconnectThresholdDb: -90,
    eirpTxPower: 18,
    bestApSettings: {
      model_type: 'RadioBestApSettings',
      mlComputed: true,
      dropInSnrPercentage: 30,
      minLoadFactor: 40,
    },
  },
  is5GHzL: {
    model_type: 'RfElementConfiguration',
    radioType: 'is5GHzL',
    radioMode: 'modeAC',
    rf: 'TipWlan-rf',
    beaconInterval: 100,
    forceScanDuringVoice: 'disabled',
    rtsCtsThreshold: 65535,
    channelBandwidth: 'is80MHz',
    mimoMode: 'twoByTwo',
    maxNumClients: 100,
    autoChannelSelection: false,
    activeScanSettings: {
      model_type: 'ActiveScanSettings',
      enabled: true,
      scanFrequencySeconds: 10,
      scanDurationMillis: 65,
    },
    neighbouringListApConfig: {
      model_type: 'NeighbouringAPListConfiguration',
      minSignal: -85,
      maxAps: 25,
    },
    minAutoCellSize: -65,
    perimeterDetectionEnabled: true,
    channelHopSettings: {
      model_type: 'ChannelHopSettings',
      noiseFloorThresholdInDB: -75,
      noiseFloorThresholdTimeInSeconds: 180,
      nonWifiThresholdInPercentage: 50,
      nonWifiThresholdTimeInSeconds: 180,
      obssHopMode: 'NON_WIFI',
    },
    bestApEnabled: null,
    multicastRate: 'auto',
    managementRate: 'auto',
    rxCellSizeDb: -90,
    probeResponseThresholdDb: -90,
    clientDisconnectThresholdDb: -90,
    eirpTxPower: 18,
    bestApSettings: {
      model_type: 'RadioBestApSettings',
      mlComputed: true,
      dropInSnrPercentage: 30,
      minLoadFactor: 40,
    },
  },
};

const defaultSsidProfile = {
  model_type: 'SsidConfiguration',
  ssid: 'SaaS-cloud-wifi',
  appliedRadios: ['is5GHzU', 'is5GHzL', 'is5GHz', 'is2dot4GHz'],
  ssidAdminState: 'enabled',
  secureMode: 'wpa2OnlyPSK',
  vlanId: 1,
  keyStr: '',
  broadcastSsid: 'enabled',
  keyRefresh: 0,
  noLocalSubnets: false,
  radiusServiceName: null,
  radiusAccountingServiceName: null,
  radiusAcountingServiceInterval: null,
  captivePortalId: null,
  bandwidthLimitDown: 0,
  bandwidthLimitUp: 0,
  clientBandwidthLimitDown: 0,
  clientBandwidthLimitUp: 0,
  videoTrafficOnly: false,
  radioBasedConfigs: {
    is2dot4GHz: {
      model_type: 'RadioBasedSsidConfiguration',
      enable80211r: null,
      enable80211k: null,
      enable80211v: null,
    },
    is5GHz: {
      model_type: 'RadioBasedSsidConfiguration',
      enable80211r: null,
      enable80211k: null,
      enable80211v: null,
    },
    is5GHzU: {
      model_type: 'RadioBasedSsidConfiguration',
      enable80211r: null,
      enable80211k: null,
      enable80211v: null,
    },
    is5GHzL: {
      model_type: 'RadioBasedSsidConfiguration',
      enable80211r: null,
      enable80211k: null,
      enable80211v: null,
    },
  },
  bonjourGatewayProfileId: null,
  enable80211w: null,
  wepConfig: null,
  forwardMode: 'BRIDGE',
  profileType: 'ssid',
  radiusClientConfiguration: {
    model_type: 'RadiusNasConfiguration',
    nasClientId: 'DEFAULT',
    nasClientIp: 'WAN_IP',
    userDefinedNasId: null,
    userDefinedNasIp: null,
    nasOperatorId: null,
  },
};
const defaultApProfile = {
  model_type: 'ApNetworkConfiguration',
  networkConfigVersion: 'AP-1',
  equipmentType: 'AP',
  vlanNative: true,
  vlan: 0,
  ntpServer: {
    model_type: 'AutoOrManualString',
    auto: true,
    value: null,
  },
  syslogRelay: {
    model_type: 'SyslogRelay',
    enabled: false,
    srvHostIp: null,
    srvHostPort: 514,
    severity: 'NOTICE',
  },
  rtlsSettings: {
    model_type: 'RtlsSettings',
    enabled: false,
    srvHostIp: null,
    srvHostPort: 0,
  },
  syntheticClientEnabled: false,
  ledControlEnabled: true,
  equipmentDiscovery: false,
  radioMap: {
    is5GHz: {
      model_type: 'RadioProfileConfiguration',
      bestApEnabled: true,
      bestAPSteerType: 'both',
    },
    is2dot4GHz: {
      model_type: 'RadioProfileConfiguration',
      bestApEnabled: true,
      bestAPSteerType: 'both',
    },
    is5GHzU: {
      model_type: 'RadioProfileConfiguration',
      bestApEnabled: true,
      bestAPSteerType: 'both',
    },
    is5GHzL: {
      model_type: 'RadioProfileConfiguration',
      bestApEnabled: true,
      bestAPSteerType: 'both',
    },
  },
  greTunnelConfigurations: [
    {
      model_type: 'GreTunnelConfiguration',
      greTunnelName: null,
      greParentIfName: null,
      greLocalInetAddr: null,
      greRemoteInetAddr: null,
      greRemoteMacAddr: null,
      vlanIdsInGreTunnel: [],
    },
  ],
  profileType: 'equipment_ap',
};

export { defaultRfProfile, defaultSsidProfile, defaultApProfile };
