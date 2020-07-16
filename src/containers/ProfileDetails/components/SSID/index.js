import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, Form, Input, Tooltip, Checkbox, Radio, Select } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

import Modal from 'components/Modal';

import RadiusForm from '../Radius';
import styles from '../index.module.scss';
import { RADIOS, ROAMING } from '../../constants/index';

const { Item } = Form;
const { Option } = Select;

const SSIDForm = ({ form, details }) => {
  const [mode, setMode] = useState(details.secureMode || 'open');
  const [radiusModal, setRadiusModal] = useState(false);

  const hexadecimalRegex = e => {
    const re = /[0-9A-F:]+/g;
    if (!re.test(e.key)) {
      e.preventDefault();
    }
  };

  const dropdownOptions = (
    <Select className={styles.Field}>
      <Option value="auto">Auto</Option>
      <Option value="true">Enabled</Option>
      <Option value="false">Disabled</Option>
    </Select>
  );

  useEffect(() => {
    const radioBasedValues = {};

    RADIOS.forEach(i => {
      ROAMING.forEach(j => {
        radioBasedValues[`${j}${i}`] =
          (details.radioBasedConfigs && details.radioBasedConfigs[i][j]) || 'auto';
      });
    });

    form.setFieldsValue({
      ssid: details.ssid || '',
      bandwidthLimitDown: details.bandwidthLimitDown || 0,
      bandwidthLimitUp: details.bandwidthLimitUp || 0,
      broadcastSSID: details.broadcastSsid === 'enabled' ? 'showSSID' : 'hideSSID',
      appliedRadios: details.appliedRadios || ['is5GHzU', 'is5GHzL', 'is2dot4GHz'],
      forwardMode: details.forwardMode || 'BRIDGE',
      noLocalSubnets: details.noLocalSubnets ? 'true' : 'false',
      captivePortal:
        details.captivePortalId && details.captivePortalId > 0 ? 'usePortal' : 'notPortal',
      captivePortalId: details.captivePortalId || 'default',
      secureMode: details.secureMode || 'open',
      vlan: details.vlanId > 0 ? 'customVLAN' : 'defaultVLAN',
      keyStr: details.keyStr,
      wepKey: (details.wepConfig && details.wepConfig.wepKeys[0].txKeyConverted) || '',
      wepDefaultKeyId: (details.wepConfig && details.wepConfig.primaryTxKeyId) || 1,
      vlanId: details.vlanId,
      ...radioBasedValues,
    });
  }, [form, details]);

  return (
    <div className={styles.ProfilePage}>
      <Modal
        onCancel={() => setRadiusModal(false)}
        visible={radiusModal}
        onSuccess={() => {}}
        title="Add Radius Profile"
        width={1200}
        content={
          <div>
            <Card title="Create Profile Name">
              <Item
                label="Profile Name"
                rules={[{ required: true, message: 'Please input your new profile name' }]}
              >
                <Input className={styles.Field} placeholder="Enter profile name" />
              </Item>
            </Card>
            <RadiusForm />
          </div>
        }
      />
      <Card title="SSID">
        <Item
          label="SSID Name"
          name="ssid"
          rules={[{ required: true, message: 'Please input your new SSID name' }]}
        >
          <Input className={styles.Field} name="ssidName" placeholder="Enter SSID name" />
        </Item>

        <Item
          label="Broadcast SSID"
          name="broadcastSSID"
          rules={[
            {
              required: true,
              message: 'Please select your SSID visibility setting',
            },
          ]}
        >
          <Radio.Group>
            <Radio value="showSSID">Show SSID</Radio>
            <Radio value="hideSSID">Hide SSID</Radio>
          </Radio.Group>
        </Item>

        <Item label="Bandwidth">
          <div className={styles.InlineDiv}>
            <Item
              name="bandwidthLimitDown"
              rules={[
                {
                  required: true,
                  message: 'Downstream bandwidth limit can be a number between 0 and 100.',
                },
                () => ({
                  validator(_rule, value) {
                    if (!value || value <= 100) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('Downstream bandwidth limit can be a number between 0 and 100.')
                    );
                  },
                }),
              ]}
            >
              <Input
                className={styles.Field}
                placeholder="0-100"
                type="number"
                min={0}
                max={100}
                addonAfter={
                  <div>
                    Down Mbps&nbsp;
                    <Tooltip title="Down Mbps: Limit is 0 - 100 (0 means unlimited)">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </div>
                }
              />
            </Item>

            <Item
              name="bandwidthLimitUp"
              rules={[
                {
                  required: true,
                  message: 'Upstream bandwidth limit can be a number between 0 and 100.',
                },
                () => ({
                  validator(_rule, value) {
                    if (!value || value <= 100) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('Upstream bandwidth limit can be a number between 0 and 100.')
                    );
                  },
                }),
              ]}
            >
              <Input
                className={styles.Field}
                placeholder="0-100"
                type="number"
                min={0}
                max={100}
                addonAfter={
                  <div>
                    Up Mbps&nbsp;
                    <Tooltip title="Up Mbps: Limit is 0 - 100 (0 means unlimited)">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </div>
                }
              />
            </Item>
          </div>
        </Item>

        <Item name="appliedRadios" label="Use On">
          <Checkbox.Group>
            <Checkbox value="is2dot4GHz">2.4 GHz</Checkbox>
            <Checkbox value="is5GHzU">5 GHzU</Checkbox>
            <Checkbox value="is5GHzL">5 GHzL</Checkbox>
          </Checkbox.Group>
        </Item>
      </Card>
      <Card title="Network Connectivity">
        <Item
          name="forwardMode"
          label={
            <span>
              <Tooltip
                title={
                  <div>
                    <div>
                      Bridge:
                      <br />
                      Devices are on the existing network(as specified by VLAN).
                    </div>
                    <br />
                    <div>
                      NAT:
                      <br />
                      Devices are on an isolated network within the SSID in NAT mode.
                    </div>
                  </div>
                }
              >
                <InfoCircleOutlined />
              </Tooltip>
              &nbsp; Mode
            </span>
          }
        >
          <Radio.Group>
            <Radio value="BRIDGE" defaultSelected>
              Bridge
            </Radio>
            <Radio value="NAT">NAT</Radio>
          </Radio.Group>
        </Item>

        <Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.forwardMode !== currentValues.forwardMode
          }
        >
          {({ getFieldValue }) => {
            return (
              <Item
                name="noLocalSubnets"
                label={
                  <span>
                    <Tooltip title="When a wireless network is configured with 'No Local Access', users will have internet access only. Any traffic to internal resources (other than DHCP and DNS) will be denied.">
                      <InfoCircleOutlined />
                    </Tooltip>
                    &nbsp; Local Access
                  </span>
                }
              >
                {getFieldValue('forwardMode') === 'BRIDGE' ? (
                  <Radio.Group>
                    <Radio value="false">Allow Local Access</Radio>
                    <Radio value="true">No Local Access</Radio>
                  </Radio.Group>
                ) : (
                  <span className={styles.Disclaimer}>Not Applicable</span>
                )}
              </Item>
            );
          }}
        </Item>

        <Item label="Captive Portal" name="captivePortal">
          <Radio.Group>
            <Radio value="notPortal">Do Not Use</Radio>
            <Radio value="usePortal">Use</Radio>
          </Radio.Group>
        </Item>
        <Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.captivePortal !== currentValues.captivePortal
          }
        >
          {({ getFieldValue }) => {
            return getFieldValue('captivePortal') === 'usePortal' ? (
              <Item label=" " colon={false}>
                <Item name="captivePortalId" style={{ marginTop: '10px' }}>
                  <Select className={styles.Field} placeholder="Select Captive Portal">
                    <Option value="default">Default</Option>
                  </Select>
                </Item>
              </Item>
            ) : null;
          }}
        </Item>
      </Card>

      <Card title="Security and Encryption">
        <Item
          label="Mode"
          name="secureMode"
          rules={[
            {
              required: true,
              message: 'Please select your security and encryption mode',
            },
          ]}
        >
          <Select
            className={styles.Field}
            onChange={value => setMode(value)}
            placeholder="Select Security and Encryption Mode"
          >
            <Option value="open">Open (No ecryption)</Option>
            <Option value="wpaPSK">WPA Personal</Option>
            <Option value="wpa2PSK">WPA & WPA2 Personal (mixed mode)</Option>
            <Option value="wpa2Radius">WPA & WPA2 Enterprise (mixed mode)</Option>
            <Option value="wpa2OnlyPSK">WPA2 Personal</Option>
            <Option value="wpa2OnlyRadius">WPA2 Enterprise</Option>
            <Option value="wep">WEP</Option>
          </Select>
        </Item>

        {mode === 'wep' && (
          <Item label=" " colon={false}>
            <span className={styles.Disclaimer}>
              When using WEP, high performance features like 11n and 11ac will not work with this
              SSID.
            </span>
          </Item>
        )}

        {(mode === 'wpa2Radius' || mode === 'wpa2OnlyRadius') && details.radiusServiceName && (
          <Item label="RADIUS Service">{details.radiusServiceName}</Item>
        )}

        {(mode === 'wpa' || mode === 'wpa2PSK' || mode === 'wpa2OnlyPSK') && (
          <Item
            label="Security Key"
            name="keyStr"
            rules={[
              {
                required: true,
                message: 'Please input your security key',
                min: 8,
                max: 63,
              },
            ]}
            hasFeedback
          >
            <Input.Password
              visibilityToggle
              className={styles.Field}
              placeholder="8-63 characters"
              maxLength={63}
            />
          </Item>
        )}

        {mode === 'wep' && (
          <>
            <Item
              label="WEP Key"
              name="wepKey"
              rules={[
                {
                  required: true,
                  message:
                    'Please enter exactly 10 or 26 hexadecimal digits representing a 64-bit or 128-bit key',
                },
                () => ({
                  validator(_rule, value) {
                    if (!value || value.length === 10 || value.length === 26) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        'Please enter exactly 10 or 26 hexadecimal digits representing a 64-bit or 128-bit key'
                      )
                    );
                  },
                }),
              ]}
              hasFeedback
            >
              <Input
                className={styles.Field}
                placeholder="Enter WEP key"
                onKeyPress={e => hexadecimalRegex(e)}
                maxLength={26}
              />
            </Item>
            <Item
              label="Default Key ID "
              name="wepDefaultKeyId"
              rules={[
                {
                  required: true,
                  message: 'Please select your default key ID',
                },
              ]}
            >
              <Select className={styles.Field} placeholder="Select vlan key ID">
                <Option value={1}>1</Option>
                <Option value={2}>2</Option>
                <Option value={3}>3</Option>
                <Option value={4}>4</Option>
              </Select>
            </Item>
          </>
        )}
        <Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.forwardMode !== currentValues.forwardMode
          }
        >
          {({ getFieldValue }) => {
            return (
              <Item label="VLAN" name="vlan">
                {getFieldValue('forwardMode') === 'BRIDGE' ? (
                  <Radio.Group>
                    <Radio value="customVLAN">Use Custom VLAN</Radio>
                    <Radio value="defaultVLAN">Use Default VLAN</Radio>
                  </Radio.Group>
                ) : (
                  <span className={styles.Disclaimer}>Not Applicable</span>
                )}
              </Item>
            );
          }}
        </Item>
        <Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.vlan !== currentValues.vlan}
        >
          {({ getFieldValue }) => {
            return getFieldValue('forwardMode') === 'BRIDGE' &&
              getFieldValue('vlan') === 'customVLAN' ? (
              <Item label=" " colon={false}>
                <Item
                  name="vlanId"
                  rules={[
                    {
                      required: getFieldValue('vlan'),
                      message: 'Vlan expected between 1 and 4095',
                    },
                    () => ({
                      validator(_rule, value) {
                        if (
                          !value ||
                          (getFieldValue('vlanId') <= 4095 && getFieldValue('vlanId') > 0)
                        ) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Vlan expected between 1 and 4095'));
                      },
                    }),
                  ]}
                  style={{ marginTop: '10px' }}
                  hasFeedback
                >
                  <Input
                    className={styles.Field}
                    placeholder="2-4095"
                    type="number"
                    min={2}
                    max={4095}
                    maxLength={4}
                  />
                </Item>
              </Item>
            ) : null;
          }}
        </Item>
      </Card>

      {mode !== 'wpaPersonal' && mode !== 'wep' && (
        <Card title="Roaming">
          <Item label="Advanced Settings" colon={false}>
            <div className={styles.InlineDiv}>
              <span>2.4GHz</span>
              <span>5GHz</span>
              <span>5GHzU</span>
              <span>5GHzL</span>
            </div>
          </Item>

          {mode !== 'open' && (
            <Item
              label={
                <span style={{ marginTop: '5px' }}>
                  <Tooltip title="When a wireless network is configured with 'Fast BSS Transitions', hand-offs from one base station to another are managed seamlessly.">
                    <InfoCircleOutlined />
                  </Tooltip>
                  &nbsp; Fast BSS
                  <br />
                  Transition (802.11r)
                </span>
              }
            >
              <div className={styles.InlineDiv}>
                {RADIOS.map(i => (
                  <Item key={i} name={`enable80211r${i}`}>
                    {dropdownOptions}
                  </Item>
                ))}
              </div>
            </Item>
          )}

          <Item label="802.11k">
            <div className={styles.InlineDiv}>
              {RADIOS.map(i => (
                <Item key={i} name={`enable80211k${i}`}>
                  {dropdownOptions}
                </Item>
              ))}
            </div>
          </Item>

          <Item label="802.11v">
            <div className={styles.InlineDiv}>
              {RADIOS.map(i => (
                <Item key={i} name={`enable80211v${i}`}>
                  {dropdownOptions}
                </Item>
              ))}
            </div>
          </Item>
        </Card>
      )}
    </div>
  );
};

SSIDForm.propTypes = {
  form: PropTypes.instanceOf(Object),
  details: PropTypes.instanceOf(Object),
};

SSIDForm.defaultProps = {
  form: null,
  details: {},
};

export default SSIDForm;