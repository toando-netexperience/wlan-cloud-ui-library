import { notification } from 'antd';
import { RADIOS, ROAMING } from '../containers/ProfileDetails/constants/index';

const isBool = value => value === 'true';

export const formatSsidProfileForm = values => {
  const formattedData = {
    radioBasedConfigs: {},
  };
  if (values.wepKey) {
    const wepKeyType = values.wepKey.length === 26 ? 'wep128' : 'wep64';
    const wepConfig = {
      _type: 'WepConfiguration',
      primaryTxKeyId: values.wepDefaultKeyId || 1,
      wepAuthType: 'open',
      wepKeys: [
        {
          _type: 'WepKey',
          txKey: values.wepKey,
          txKeyType: wepKeyType,
        },
        {
          _type: 'WepKey',
          txKey: values.wepKey,
          txKeyType: wepKeyType,
        },
        {
          _type: 'WepKey',
          txKey: values.wepKey,
          txKeyType: wepKeyType,
        },
        {
          _type: 'WepKey',
          txKey: values.wepKey,
          txKeyType: wepKeyType,
        },
      ],
    };
    formattedData.wepConfig = wepConfig;
  }
  formattedData.noLocalSubnets = isBool(values.noLocalSubnets);

  RADIOS.forEach(i => {
    formattedData.radioBasedConfigs[i] = {};
    ROAMING.forEach(j => {
      formattedData.radioBasedConfigs[i][j] =
        values[`${j}${i}`] === 'auto' ? null : isBool(values[`${j}${i}`]);
    });
  });

  return formattedData;
};

export const formatApProfileForm = values => {
  const formattedData = { ...values };

  formattedData.equipmentDiscovery = isBool(values.equipmentDiscovery);
  formattedData.rtlsSettings.enabled = isBool(values.rtlsSettings.enabled);
  formattedData.syntheticClientEnabled = isBool(values.syntheticClientEnabled);
  formattedData.syslogRelay.enabled = isBool(values.syslogRelay.enabled);

  return formattedData;
};

export const formatRadiusForm = values => {
  const formattedData = { ...values, serviceRegionMap: {} };

  values.zones.forEach(i => {
    if (!(i.name in formattedData.serviceRegionMap)) {
      formattedData.serviceRegionMap[i.name] = {
        regionName: i.name,
        serverMap: {},
      };
    }
    values.services.forEach(j => {
      formattedData.serviceRegionMap[i.name].serverMap[j.name] = j.ips;
    });

    if (!i.subnets || i.subnets.length === 0) {
      notification.error({
        message: 'Error',
        description: 'At least 1 Subnet is required.',
      });

      throw Error('missing RADIUS subnet');
    }

    i.subnets.forEach(j => {
      if (!formattedData.subnetConfiguration) {
        formattedData.subnetConfiguration = {};
      }
      formattedData.subnetConfiguration[j.subnetName] = j;
      if (values.probeInterval) {
        formattedData.subnetConfiguration[j.subnetName].probeInterval = values.probeInterval;
      }
    });
  });

  return formattedData;
};

export const formatCaptiveForm = (values, details) => {
  const formattedData = { ...values };

  const getFileType = type => {
    if (type.startsWith('image/')) {
      return type === 'image/png' ? 'PNG' : 'JPG';
    }
    return type;
  };

  if (
    !values.logoFile ||
    (values.logoFile && values.logoFile.fileList && values.logoFile.fileList.length === 0)
  ) {
    // Deleted File
    formattedData.logoFile = null;
  } else if (values.logoFile && values.logoFile.file) {
    // New File
    formattedData.logoFile = {
      apExportUrl: values.logoFile.file.name,
      fileType: getFileType(values.logoFile.file.type),
      fileCategory: 'CaptivePortalLogo',
    };
  } else if (values.logoFile) {
    // Same File
    formattedData.logoFile = details.logoFile;
  }

  if (
    !values.backgroundFile ||
    (values.backgroundFile &&
      values.backgroundFile.fileList &&
      values.backgroundFile.fileList.length === 0)
  ) {
    formattedData.backgroundFile = null;
  } else if (values.backgroundFile && values.backgroundFile.file) {
    formattedData.backgroundFile = {
      apExportUrl: values.backgroundFile.file.name,
      fileType: getFileType(values.backgroundFile.file.type),
      fileCategory: 'CaptivePortalBackground',
    };
  } else if (values.backgroundFile) {
    formattedData.backgroundFile = details.backgroundFile;
  }

  return formattedData;
};