import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Form, Input, Select, Table, Upload, message } from 'antd';
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';

import globalStyles from 'styles/index.scss';

import styles from '../index.module.scss';
import FormModal from './components/FormModal';

const { Item } = Form;
const { Option } = Select;

const formatFile = file => {
  return {
    uid: file.apExportUrl,
    name: file.apExportUrl,
    type: file.fileType,
  };
};

const PasspointProfileForm = ({
  form,
  details,
  venueProfiles,
  operatorProfiles,
  ssidProfiles,
  childProfiles,
  idProviderProfiles,
  fileUpload,
  onFetchMoreProfiles,
  onFetchMoreVenueProfiles,
  onFetchMoreOperatorProfiles,
  onFetchMoreIdProviderProfiles,
}) => {
  const [termsAndConditionsFileList, setTermsAndConditionsFileList] = useState(
    (details?.termsAndConditionsFile && [formatFile(details?.termsAndConditionsFile)]) || []
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [connectionCapabilitySetList, setConnectionCapabilitySetList] = useState(
    details?.connectionCapabilitySet || []
  );

  const [selectedChildSsids, setSelectedChildSsids] = useState(
    childProfiles.filter(i => i.profileType === 'ssid') || []
  );

  useEffect(() => {
    form.setFieldsValue({
      passpointVenueProfileId: details?.passpointVenueProfileId?.toString(),
      passpointOperatorProfileId: details?.passpointOperatorProfileId?.toString(),
      passpointOsuProviderProfileIds:
        details?.passpointOsuProviderProfileIds?.map(i => i?.toString()) || [],
      enableInterworkingAndHs20: details?.enableInterworkingAndHs20 ? 'true' : 'false',
      hessid: {
        addressAsString: details?.hessid?.addressAsString || null,
      },
      accessNetworkType: details?.accessNetworkType || 'private_network',
      networkAuthenticationType:
        details?.networkAuthenticationType || 'acceptance_of_terms_and_conditions',
      termsAndConditionsFile:
        details?.termsAndConditionsFile && formatFile(details?.termsAndConditionsFile),
      emergencyServicesReachable: details?.emergencyServicesReachable ? 'true' : 'false',
      unauthenticatedEmergencyServiceAccessible: details?.unauthenticatedEmergencyServiceAccessible
        ? 'true'
        : 'false',
      internetConnectivity: details?.internetConnectivity ? 'true' : 'false',
      ipAddressTypeAvailability: details?.ipAddressTypeAvailability || 'address_type_not_available',
      anqpDomainId: details?.anqpDomainId ? details?.anqpDomainId?.toString() : '0',
      gasAddr3Behaviour: details?.gasAddr3Behaviour || 'p2pSpecWorkaroundFromRequest',
      disableDownstreamGroupAddressedForwarding: details?.disableDownstreamGroupAddressedForwarding
        ? 'true'
        : 'false',
      childProfileIds: [],
    });
  }, [form, details]);

  useEffect(() => {
    form.setFieldsValue({ connectionCapabilitySet: connectionCapabilitySetList });
  }, [connectionCapabilitySetList]);

  useEffect(() => {
    form.setFieldsValue({ associatedAccessSsidProfileIds: selectedChildSsids.map(i => i.id) });
  }, [selectedChildSsids]);

  const validateFile = (file, showMessages = false) => {
    const isJpgOrPng =
      file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJpgOrPng) {
      if (showMessages) message.error('You can only upload JPG/PNG file!');
      return false;
    }

    const isValidSize = file.size / 1024 < 400;

    if (!isValidSize) {
      if (showMessages) message.error('Image must smaller than 400KB!');
      return false;
    }

    return true;
  };

  const handleOnFileChange = (file, fileList) => {
    if (validateFile(file)) {
      let list = [...fileList];

      list = list.slice(-1);
      list = list.map(i => ({ ...i, url: i.response && i.response.url }));

      return list;
    }
    return false;
  };

  const handleOnChangeTermsAndConditions = ({ file, fileList }) => {
    if (fileList.length === 0) {
      setTermsAndConditionsFileList([]);
    }
    const list = handleOnFileChange(file, fileList);
    if (list) setTermsAndConditionsFileList(list);
  };

  const handleFileUpload = file => {
    if (validateFile(file, true)) {
      fileUpload(file.name, file);
    }
    return false;
  };

  const handlCancelConnectionModal = () => {
    setModalVisible(false);
  };

  const handleSaveConnection = newConnection => {
    setConnectionCapabilitySetList([...connectionCapabilitySetList, newConnection]);
  };

  const handleConnectionRemove = item => {
    setConnectionCapabilitySetList(
      connectionCapabilitySetList.filter(
        i => i.connectionCapabilitiesPortNumber !== item.connectionCapabilitiesPortNumber
      )
    );
  };

  const columns = [
    {
      title: 'Status',
      dataIndex: 'connectionCapabilitiesStatus',
      width: 300,
    },
    {
      title: 'Protocol',
      dataIndex: 'connectionCapabilitiesIpProtocol',
      width: 300,
    },
    {
      title: 'Port',
      dataIndex: 'connectionCapabilitiesPortNumber',
      width: 300,
    },
    {
      title: '',
      width: 80,
      render: (_, record) => (
        <Button
          title="removeConnection"
          icon={<DeleteOutlined />}
          className={styles.iconButton}
          onClick={() => handleConnectionRemove(record)}
        />
      ),
    },
  ];

  const defaultOptions = (
    <Select className={styles.Field}>
      <Option value="true">Enabled</Option>
      <Option value="false">Disabled</Option>
    </Select>
  );

  const handleOnChangeSsid = selectedItem => {
    setSelectedChildSsids([...selectedChildSsids, ssidProfiles.find(i => i.id === selectedItem)]);
  };

  const handleRemoveSsid = id => {
    setSelectedChildSsids(selectedChildSsids.filter(i => parseInt(i.id, 10) !== parseInt(id, 10)));
  };

  const columnsSsid = [
    {
      title: 'Profile Name',
      dataIndex: 'name',
    },
    {
      title: 'SSID',
      dataIndex: ['details', 'ssid'],
    },
    {
      title: 'Security Mode',
      dataIndex: ['details', 'secureMode'],
    },
    {
      title: 'Radio',
      dataIndex: ['details', 'appliedRadios'],
      render: appliedRadios => appliedRadios?.join(',  '),
    },
    {
      title: '',
      width: 80,
      render: (_, record) => (
        <Button
          title="removeSsid"
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveSsid(record.id)}
        />
      ),
    },
  ];

  const filteredOptions = ssidProfiles.filter(
    i => !selectedChildSsids.map(ssid => parseInt(ssid.id, 10)).includes(parseInt(i.id, 10))
  );

  return (
    <div className={styles.ProfilePage}>
      <Card title="General">
        <Item label="Venue" name="passpointVenueProfileId">
          <Select
            onPopupScroll={onFetchMoreVenueProfiles}
            data-testid="venueProfile"
            showSearch
            placeholder="Select a Venue Profile"
          >
            {venueProfiles.map(i => (
              <Option key={i.id} value={i.id}>
                {i.name}
              </Option>
            ))}
          </Select>
        </Item>
        <Item label="Operator" name="passpointOperatorProfileId">
          <Select
            onPopupScroll={onFetchMoreOperatorProfiles}
            data-testid="operatorProfile"
            showSearch
            placeholder="Select an Operator Profile"
          >
            {operatorProfiles.map(i => (
              <Option key={i.id} value={i.id}>
                {i.name}
              </Option>
            ))}
          </Select>
        </Item>
        <Item label="ID Provider" name="passpointOsuProviderProfileIds">
          <Select
            onPopupScroll={onFetchMoreIdProviderProfiles}
            data-testid="idProviderProfiles"
            showSearch
            mode="multiple"
            allowClear
            placeholder="Select ID Providers (check to select)"
            className={styles.MultipleSelection}
          >
            {idProviderProfiles.map(i => (
              <Option key={i.id} value={i.id}>
                {i.name}
              </Option>
            ))}
          </Select>
        </Item>
        <Item label="Interworking Hot 2.0" name="enableInterworkingAndHs20">
          {defaultOptions}
        </Item>
        <Item
          label="HESSID"
          name={['hessid', 'addressAsString']}
          rules={[
            {
              required: true,
              message: 'Mac Address cannot be empty',
            },
            ({ getFieldValue }) => ({
              validator(_rule, value) {
                if (
                  !value ||
                  getFieldValue(['hessid', 'addressAsString']).match(
                    /^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$/
                  )
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('Incorrect MAC Address format e.g. 0A:0B:0C:0D:0E:0F')
                );
              },
            }),
          ]}
        >
          <Input placeholder="Enter MAC Address" className={globalStyles.field} />
        </Item>
      </Card>
      <Card title="Access Network">
        <Item label="Access Network Type" name="accessNetworkType">
          <Select>
            <Option value="private_network">Private Network</Option>
            <Option value="private_network_guest_access">Private Network Guest Access</Option>
            <Option value="changeable_public_network">Changeable Public Network</Option>
            <Option value="free_public_network">Free Public Network</Option>
            <Option value="person_device_network">Personal Device Network</Option>
            <Option value="emergency_services_only_network">Emergency Services Only Network</Option>
            <Option value="test_or_experimental">Test or Experimental</Option>
            <Option value="wildcard">Wildcard</Option>
          </Select>
        </Item>
        <Item label="Authentication Type" name="networkAuthenticationType">
          <Select>
            <Option value="acceptance_of_terms_and_conditions">
              Acceptance of Terms & Conditions
            </Option>
            <Option value="online_enrollment_supported">Online Enrollment Supported</Option>
            <Option value="http_https_redirection">HTTP HTTPS Redirection</Option>
            <Option value="dns_redirection">DNS Redirection</Option>
          </Select>
        </Item>
        <Item label="Terms & Conditions" name="termsAndConditionsFile">
          <Upload
            accept="image/*"
            data-testid="termsAndConditionsUpload"
            fileList={termsAndConditionsFileList}
            beforeUpload={handleFileUpload}
            onChange={handleOnChangeTermsAndConditions}
          >
            <Button icon={<UploadOutlined />}>File Upload</Button>
          </Upload>
        </Item>
        <Item label="Emergency Services Reachable" name="emergencyServicesReachable">
          {defaultOptions}
        </Item>
        <Item
          label="Unauthenticated Emergency Service Accessible"
          name="unauthenticatedEmergencyServiceAccessible"
        >
          {defaultOptions}
        </Item>
      </Card>
      <Card title="IP Connectivity">
        <Item label="Internet Connectivity" name="internetConnectivity">
          {defaultOptions}
        </Item>
        <Item label="IP Address Type" name="ipAddressTypeAvailability">
          <Select>
            <Option value="address_type_not_available">Address Type Not Available</Option>
            <Option value="address_type_available">Address Type Available</Option>
            <Option value="public_IPv4_address_available">Public IPv4 Address Available</Option>
            <Option value="port_restricted_IPv4_address_available">
              Port Restricted IPv4 Address Available
            </Option>
            <Option value="single_NATed_private_IPv4_address_available">
              Single NATed private IPv4 Address Available
            </Option>
            <Option value="double_NATed_private_IPv4_address_available">
              Double NATed private IPv4 Address Available
            </Option>
            <Option value="port_restricted_IPv4_address_and_single_NATed_IPv4_address_available">
              Port Restricted IPv4 Address and Single NATed IPv4 Address Available
            </Option>
            <Option value="port_restricted_IPv4_address_and_double_NATed_IPv4_address_available">
              Port Restricted IPv4 Address and Double NATed IPv4 Address Available
            </Option>
            <Option value="availability_of_the_address_type_is_unknown">
              Availablity of the Address Type is Unknown
            </Option>
          </Select>
        </Item>
        <Item label="Connection Capability">
          <Button type="solid" onClick={() => setModalVisible(true)}>
            Add
          </Button>
        </Item>
        <Table
          dataSource={connectionCapabilitySetList}
          columns={columns}
          pagination={false}
          rowKey="connectionCapabilitiesPortNumber"
        />
      </Card>

      <Card title="Wireless Networks (SSIDs) Enabled on This Profile">
        <Item>
          <Select
            onPopupScroll={onFetchMoreProfiles}
            data-testid="ssidProfile"
            showSearch
            placeholder="Select a SSID Profile"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onChange={handleOnChangeSsid}
            value="Select a SSID Profile"
          >
            {filteredOptions.map(i => (
              <Option key={i.id} value={i.id}>
                {i.name}
              </Option>
            ))}
          </Select>
        </Item>
        <Table
          dataSource={selectedChildSsids}
          columns={columnsSsid}
          pagination={false}
          rowKey="id"
        />
        <Item name="childProfileIds" style={{ display: 'none' }}>
          <Input />
        </Item>
      </Card>

      <Card title="Advanced">
        <Item
          label="ANQP Domain ID"
          name="anqpDomainId"
          rules={[
            {},
            ({ getFieldValue }) => ({
              validator(_rule, value) {
                if (
                  !value ||
                  (getFieldValue('anqpDomainId') <= 65535 && getFieldValue('anqpDomainId') >= 0)
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Enter an ANQP Domain ID between 0 and 65535'));
              },
            }),
          ]}
        >
          <Input type="number" min={0} max={65535} />
        </Item>
        <Item label="GAS Address 3 Behaviour" name="gasAddr3Behaviour">
          <Select>
            <Option value="p2pSpecWorkaroundFromRequest">P2P Spec Workaround From Request</Option>
            <Option value="ieee80211StandardCompliantOnly">
              IEEE 80211 Standard Compliant Only
            </Option>
            <Option value="forceNonCompliantBehaviourFromRequest">
              Force Non-Compliant Behaviour From Request
            </Option>
          </Select>
        </Item>
        <Item label="Disable DGAF" name="disableDownstreamGroupAddressedForwarding">
          <Select>
            <Option value="true">True</Option>
            <Option value="false">False</Option>
          </Select>
        </Item>

        <Item name="childProfileIds" style={{ display: 'none' }}>
          <Input />
        </Item>
        <Item name="associatedAccessSsidProfileIds" style={{ display: 'none' }}>
          <Input />
        </Item>
      </Card>

      <Item name="connectionCapabilitySet">
        <FormModal
          visible={modalVisible}
          onCancel={handlCancelConnectionModal}
          onSubmit={handleSaveConnection}
          currentPortList={connectionCapabilitySetList}
          title="Add Connection Capability"
        />
      </Item>
    </div>
  );
};

PasspointProfileForm.propTypes = {
  form: PropTypes.instanceOf(Object),
  details: PropTypes.instanceOf(Object),
  venueProfiles: PropTypes.instanceOf(Array),
  operatorProfiles: PropTypes.instanceOf(Array),
  ssidProfiles: PropTypes.instanceOf(Array),
  childProfiles: PropTypes.instanceOf(Array),
  idProviderProfiles: PropTypes.instanceOf(Array),
  fileUpload: PropTypes.func,
  onFetchMoreProfiles: PropTypes.func,
  onFetchMoreVenueProfiles: PropTypes.func,
  onFetchMoreOperatorProfiles: PropTypes.func,
  onFetchMoreIdProviderProfiles: PropTypes.func,
};

PasspointProfileForm.defaultProps = {
  form: {},
  details: {},
  venueProfiles: [],
  operatorProfiles: [],
  ssidProfiles: [],
  childProfiles: [],
  idProviderProfiles: [],
  fileUpload: () => {},
  onFetchMoreProfiles: () => {},
  onFetchMoreVenueProfiles: () => {},
  onFetchMoreOperatorProfiles: () => {},
  onFetchMoreIdProviderProfiles: () => {},
};

export default PasspointProfileForm;