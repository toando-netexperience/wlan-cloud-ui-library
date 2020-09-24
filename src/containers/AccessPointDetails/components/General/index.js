import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Form, Input, Table, Collapse, Select, Tooltip, notification, Alert } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import _ from 'lodash';

import Loading from 'components/Loading';
import Button from 'components/Button';
import styles from '../../index.module.scss';

const { Item } = Form;
const { Option } = Select;
const { Panel } = Collapse;

const General = ({
  data,
  profiles,
  handleOnEquipmentSave,
  handleOnFormChange,
  loadingProfiles,
  errorProfiles,
  onFetchMoreProfiles,
}) => {
  const [form] = Form.useForm();
  const columns = [
    {
      title: 'Wireless Network',
      dataIndex: 'name',
      key: 'network',
    },
    {
      title: 'SSID',
      dataIndex: ['details', 'ssid'],
      key: 'ssid',
    },
    {
      title: 'Security Mode',
      dataIndex: ['details', 'secureMode'],
      key: 'security',
    },
    {
      title: 'Radio(s)',
      dataIndex: ['details', 'appliedRadios'],
      key: 'radios',
      render: appliedRadios => appliedRadios.join(',  '),
    },
  ];

  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 14 },
  };

  const [selectedProfile, setSelectedProfile] = useState(data.profile);

  const handleProfileChange = value => {
    const i = profiles.find(o => {
      return o.id === value;
    });
    setSelectedProfile(i);
  };

  const {
    id,
    equipmentType,
    inventoryId,
    customerId,
    locationId,
    latitude,
    longitude,
    serial,
    lastModifiedTimestamp,
  } = data;

  const handleOnSave = () => {
    form
      .validateFields()
      .then(values => {
        const formattedData = _.cloneDeep(data.details);

        Object.keys(formattedData.radioMap).forEach(radio => {
          Object.keys(formattedData.radioMap[radio]).forEach(field => {
            if (field === 'neighbouringListApConfig') {
              if (`maxAps${radio}` in values) {
                formattedData.radioMap[radio].neighbouringListApConfig.maxAps =
                  values[`maxAps${radio}`];
              }
              if (`minSignal${radio}` in values) {
                formattedData.radioMap[radio].neighbouringListApConfig.minSignal =
                  values[`minSignal${radio}`];
              }
            } else if (`${field}${radio}` in values) {
              if (field === 'perimeterDetectionEnabled') {
                formattedData.radioMap[radio][field] = values[`${field}${radio}`] === 'enabled';
              } else if (field === 'deauthAttackDetection') {
                formattedData.advancedRadioMap[radio][field] =
                  values[`${field}${radio}`] === 'enabled';
              } else {
                formattedData.radioMap[radio][field] = values[`${field}${radio}`];
              }
            }
          });
        });

        Object.keys(formattedData.advancedRadioMap).forEach(radio => {
          Object.keys(formattedData.advancedRadioMap[radio]).forEach(field => {
            if (field === 'channelHopSettings') {
              if (`noiseFloorThresholdInDB${radio}` in values) {
                formattedData.advancedRadioMap[radio].channelHopSettings.noiseFloorThresholdInDB =
                  values[`noiseFloorThresholdInDB${radio}`];
              }
              if (`noiseFloorThresholdTimeInSeconds${radio}` in values) {
                formattedData.advancedRadioMap[
                  radio
                ].channelHopSettings.noiseFloorThresholdTimeInSeconds =
                  values[`noiseFloorThresholdTimeInSeconds${radio}`];
              }
              if (`obssHopMode${radio}` in values) {
                formattedData.advancedRadioMap[radio].channelHopSettings.obssHopMode =
                  values[`obssHopMode${radio}`];
              }
            } else if (field === 'bestApSettings') {
              if (`dropInSnrPercentage${radio}` in values) {
                formattedData.advancedRadioMap[radio].bestApSettings.dropInSnrPercentage =
                  values[`dropInSnrPercentage${radio}`];
              }
              if (`minLoadFactor${radio}` in values) {
                formattedData.advancedRadioMap[radio].bestApSettings.minLoadFactor =
                  values[`minLoadFactor${radio}`];
              }
            } else if (`${field}${radio}` in values) {
              if (field === 'deauthAttackDetection') {
                formattedData.advancedRadioMap[radio][field] =
                  values[`${field}${radio}`] === 'enabled';
              } else {
                formattedData.advancedRadioMap[radio][field] = values[`${field}${radio}`];
              }
            }
          });
        });

        handleOnEquipmentSave({
          id,
          equipmentType,
          inventoryId,
          customerId,
          profileId: selectedProfile?.id,
          locationId,
          name: values.access,
          latitude,
          longitude,
          serial,
          lastModifiedTimestamp,
          formattedData,
        });
      })
      .catch(() => {
        notification.error({
          message: 'Error',
          description: 'Equipment settings could not be updated.',
        });
      });
  };

  const defaultOptions = (
    <Select className={styles.Field}>
      <Option value="enabled">enabled</Option>
      <Option value="disabled">disabled</Option>
    </Select>
  );

  const setInitialValue = (obj = {}, dataIndex, key, options = {}) => {
    const val = options.value ? obj[key][options.value][dataIndex] : obj[key][dataIndex];
    if (val === undefined || val === null) {
      return 'disabled';
    }
    if (val === true) {
      return 'enabled';
    }
    if (val === false) {
      return 'disabled';
    }

    return val;
  };

  const renderItem = (label, obj = {}, dataIndex, renderInput, options = {}) => (
    <Item label={label} colon={false}>
      <div className={styles.InlineDiv}>
        {Object.keys(obj).map(i =>
          renderInput ? (
            renderInput(obj, dataIndex, i, label, options)
          ) : (
            <span key={i} className={styles.spanStyle}>
              {dataIndex ? obj[i][dataIndex] : obj[i]}
            </span>
          )
        )}
      </div>
    </Item>
  );

  const renderOptionItem = (obj = {}, dataIndex, key, label, options = {}) => (
    <Item
      name={dataIndex + key}
      initialValue={setInitialValue(obj, dataIndex, key, options)}
      rules={[
        {
          required: true,
          message: `Enter ${label} for ${key}`,
        },
      ]}
    >
      {typeof options.dropdown === 'function' ? options.dropdown(key) : options.dropdown}
    </Item>
  );

  const renderInputItem = (obj = {}, dataIndex, key, label, options = {}) => (
    <Item
      name={dataIndex + key}
      initialValue={setInitialValue(obj, dataIndex, key, options)}
      rules={[
        { required: true, message: options.error },
        ({ getFieldValue }) => ({
          validator(_rule, value) {
            if (
              !value ||
              (getFieldValue(dataIndex + key) <= options.max &&
                getFieldValue(dataIndex + key) >= options.min)
            ) {
              return Promise.resolve();
            }
            return Promise.reject(new Error(options.error));
          },
        }),
      ]}
    >
      <Input
        className={styles.Field}
        placeholder={`Enter ${label} for ${key}`}
        type="number"
        min={options.min}
        max={options.max}
      />
    </Item>
  );

  if (loadingProfiles) {
    return <Loading data-testid="loadingProfiles" />;
  }

  if (errorProfiles) {
    return (
      <Alert
        message="Error"
        description="Failed to load Access Point profiles."
        type="error"
        showIcon
        data-testid="errorProfiles"
      />
    );
  }

  return (
    <Form {...layout} form={form} onValuesChange={handleOnFormChange}>
      <div className={styles.InlineEndDiv}>
        <Button className={styles.saveButton} onClick={handleOnSave} type="primary" name="save">
          Save
        </Button>
      </div>
      <Card title="Identity">
        <Item
          label="Access Point Name"
          name="access"
          initialValue={data.name}
          rules={[
            {
              required: true,
              message: 'Enter the Access Point name',
            },
          ]}
        >
          <Input className={styles.Field} placeholder="Enter Access Point Name" />
        </Item>
        <Item label="Model"> {data.model}</Item>
        <Item label="Serial Number">{data.serial} </Item>
        <Item label="SKU"> {data.status.protocol.reportedSku}</Item>
        <Item label="Country Code"> {data.status.protocol.countryCode}</Item>
        <Item label="Ethernet MAC Address"> {data.status.protocol.reportedMacAddr}</Item>
        <Item label="Manufacturer"> {data.status.protocol.manufacturer}</Item>
        <Item label="Asset ID"> {data.inventoryId}</Item>
      </Card>

      <Card title="Profile">
        <Item
          label="Access Point Profile"
          name="apProfile"
          initialValue={data.profile.name}
          rules={[
            {
              required: true,
              message: 'Please select your Access Point Profile city.',
            },
          ]}
        >
          <Select
            className={styles.Field}
            onChange={handleProfileChange}
            placeholder="Select access point profile..."
            onPopupScroll={onFetchMoreProfiles}
          >
            {profiles.map(i => (
              <Option key={i.id} value={i.id}>
                {i.name}
              </Option>
            ))}
          </Select>
        </Item>

        <Item label="Summary">
          <Item>
            <Table
              rowKey="id"
              scroll={{ x: true }}
              dataSource={selectedProfile?.childProfiles}
              columns={columns}
              pagination={false}
            />
          </Item>
        </Item>
      </Card>
      <Collapse expandIconPosition="right">
        <Panel header="Advanced Settings" name="settings">
          {renderItem(' ', data.details.radioMap, 'radioType')}
          <p>Radio Specific Parameters:</p>
          {renderItem(
            'Enable Radio',
            data.details.advancedRadioMap,
            'radioAdminState',
            renderOptionItem,
            { dropdown: defaultOptions }
          )}
          {renderItem(
            <span>
              <Tooltip title="TU (Time Unit) is 1.024ms ">
                <InfoCircleOutlined />
              </Tooltip>
              &nbsp; Beacon Interval
            </span>,
            data.details.advancedRadioMap,
            'beaconInterval',
            renderOptionItem,
            {
              dropdown: (
                <Select className={styles.Field}>
                  <Option value={100}>100</Option>
                  <Option value={200}>200</Option>
                  <Option value={300}>300</Option>
                  <Option value={400}>400</Option>
                  <Option value={500}>500</Option>
                </Select>
              ),
            }
          )}
          {renderItem(
            'Deauth Attack Detection',
            data.details.advancedRadioMap,
            'deauthAttackDetection',
            renderOptionItem,
            { dropdown: defaultOptions }
          )}
          {renderItem(
            'RTS/CTS threshold',
            data.details.advancedRadioMap,
            'rtsCtsThreshold',
            renderInputItem,
            { min: 0, max: 65535, error: '0 - 65535 (Bytes)' }
          )}
          {renderItem('Radio Mode', data.details.advancedRadioMap, 'radioMode', renderOptionItem, {
            dropdown: (
              <Select className={styles.Field}>
                <Option value="modeBGN">BGN</Option>
                <Option value="modeN">N</Option>
                <Option value="modeAC">AC</Option>
              </Select>
            ),
          })}
          {renderItem('Mimo Mode', data.details.advancedRadioMap, 'mimoMode')}
          {renderItem('UAPSD', data.details.advancedRadioMap, 'uapsdState', renderOptionItem, {
            dropdown: defaultOptions,
          })}
          {renderItem(
            'SMPS Power Save Mode',
            data.details.advancedRadioMap,
            'smps',
            renderOptionItem,
            { dropdown: defaultOptions }
          )}
          {renderItem(
            'Maximum Devices',
            data.details.advancedRadioMap,
            'maxNumClients',
            renderInputItem,
            { min: 0, max: 100, error: '0 - 100' }
          )}
          {renderItem('Active Channel', data.details.radioMap, 'activeChannel')}
          {renderItem('Backup Channel', data.details.radioMap, 'backupChannelNumber')}
          {renderItem(
            'Channel Bandwidth',
            data.details.radioMap,
            'channelBandwidth',
            renderOptionItem,
            {
              dropdown: (key) => {
                return (
                <Select className={styles.Field}>
                  <Option value="is20MHz">is20MHz</Option>
                  <Option value="is40MHz">is40MHz</Option>
                  {key === 'is2dot4GHz' ? null : <Option value="is80MHz">is80MHz</Option>}
                </Select>
                );
              },
            },
          )}
          <p>Radio Resource Management:</p>

          {renderItem(
            'Perimeter Detection',
            data.details.radioMap,
            'perimeterDetectionEnabled',
            renderOptionItem,
            { dropdown: defaultOptions }
          )}
          <p>Neighbouring AP List:</p>
          {renderItem('Minimum Signal', data.details.radioMap, 'minSignal', renderInputItem, {
            min: -90,
            max: -50,
            error: '-90 - -50 dB',
            value: 'neighbouringListApConfig',
          })}
          {renderItem('Maximum APs', data.details.radioMap, 'maxAps', renderInputItem, {
            min: 0,
            max: 512,
            error: '0 - 512 APs',
            value: 'neighbouringListApConfig',
          })}

          <p>Channel Hop Configuration:</p>
          {renderItem(
            'Noise Floor (db)',
            data.details.advancedRadioMap,
            'noiseFloorThresholdInDB',
            renderInputItem,
            { min: -90, max: -10, error: '-90 - -10 dB', value: 'channelHopSettings' }
          )}
          {renderItem(
            'Noise Floor Time (secs)',
            data.details.advancedRadioMap,
            'noiseFloorThresholdTimeInSeconds',
            renderInputItem,
            { min: 120, max: 600, error: '120 - 600 seconds', value: 'channelHopSettings' }
          )}
          {renderItem(
            'DFS on/off',
            data.details.advancedRadioMap,
            'obssHopMode',
            renderOptionItem,
            {
              dropdown: defaultOptions,
              value: 'channelHopSettings',
            }
          )}
          <p>Steering Threshold:</p>
          {renderItem(
            'SNR (% Drop)',
            data.details.advancedRadioMap,
            'dropInSnrPercentage',
            renderInputItem,
            {
              min: 0,
              max: 100,
              error: '0 - 100%',
              value: 'bestApSettings',
            }
          )}
          {renderItem(
            'Min Load (%)',
            data.details.advancedRadioMap,
            'minLoadFactor',
            renderInputItem,
            {
              min: 0,
              max: 100,
              error: '0 - 100%',
              value: 'bestApSettings',
            }
          )}
        </Panel>
      </Collapse>
    </Form>
  );
};

General.propTypes = {
  data: PropTypes.instanceOf(Object),
  profiles: PropTypes.instanceOf(Array),
  handleOnEquipmentSave: PropTypes.func,
  handleOnFormChange: PropTypes.func,
  loadingProfiles: PropTypes.bool,
  errorProfiles: PropTypes.instanceOf(Object),
  onFetchMoreProfiles: PropTypes.func,
};

General.defaultProps = {
  data: {},
  profiles: [],
  handleOnFormChange: () => {},
  handleOnEquipmentSave: () => {},
  loadingProfiles: true,
  errorProfiles: null,
  onFetchMoreProfiles: () => {},
};

export default General;
