import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, Form, Select, Switch, Table, Spin, Alert } from 'antd';
import { FormOutlined, DeleteFilled } from '@ant-design/icons';

import Button from 'components/Button';
import Container from 'components/Container';
import Modal from 'components/Modal';
import globalStyles from 'styles/index.scss';

import FormModal from './components/FormModal';
import styles from './index.module.scss';

const { Item } = Form;
const { Option } = Select;

const AutoProvision = ({
  data,
  dataLocation,
  dataProfile,
  loadingLoaction,
  loadingProfile,
  errorLocation,
  errorProfile,
  onUpdateCustomer,
}) => {
  const status = data?.details?.autoProvisioning || {};
  const [form] = Form.useForm();
  const [enabled, setEnabled] = useState(status.enabled || false);
  const [equipmentProfileIdPerModel, setEquipmentProfileIdPerModel] = useState(
    data?.details?.autoProvisioning?.equipmentProfileIdPerModel || {}
  );
  const [activeModel, setActiveModel] = useState({});
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 12 },
  };

  const profilesById = useMemo(() => {
    const map = {};
    dataProfile.forEach(i => {
      map[i.id] = i;
    });

    return map;
  }, [dataProfile]);

  const tableData = useMemo(() => {
    return Object.keys(equipmentProfileIdPerModel).map(item => {
      return {
        model: item,
        profileId: equipmentProfileIdPerModel[item],
      };
    });
  }, [equipmentProfileIdPerModel]);

  const usedModels = useMemo(() => {
    return Object.keys(status.equipmentProfileIdPerModel || {});
  }, [data]);

  const { id, email, name, createdTimestamp, lastModifiedTimestamp } = data;

  const addModel = ({ model, profileId }) => {
    const formattedData = { ...equipmentProfileIdPerModel };
    formattedData[model] = profileId;

    setEquipmentProfileIdPerModel(formattedData);
    setAddModal(false);
  };

  const editModel = ({ model, profileId }) => {
    const formattedData = { ...equipmentProfileIdPerModel };
    if (activeModel.model !== model) {
      delete formattedData[activeModel.model];
    }
    formattedData[model] = profileId;

    setEquipmentProfileIdPerModel(formattedData);
    setEditModal(false);
  };

  const deleteModel = () => {
    const formattedData = { ...equipmentProfileIdPerModel };
    delete formattedData[activeModel.model];

    setEquipmentProfileIdPerModel(formattedData);
    setDeleteModal(false);
  };

  const onSubmit = () => {
    const formattedData = { ...data.details };
    form
      .validateFields()
      .then(values => {
        formattedData.autoProvisioning.enabled = values.enabled;
        formattedData.autoProvisioning.locationId = values.locationId;
        formattedData.autoProvisioning.equipmentProfileIdPerModel = equipmentProfileIdPerModel;
        onUpdateCustomer(id, email, name, formattedData, createdTimestamp, lastModifiedTimestamp);
      })
      .catch(() => {});
  };

  const columns = [
    {
      title: 'MODEL',
      dataIndex: 'model',
      key: 'model',
      width: 100,
    },
    {
      title: 'PROFILE',
      dataIndex: 'profileId',
      key: 'profileId',
      width: 700,
      render: i => profilesById[i]?.name || i,
    },
    {
      title: '',
      dataIndex: '',
      key: 'editModel',
      width: 60,
      render: (_, record) => (
        <Button
          title={`edit-model-${record.model}`}
          className={styles.InfoButton}
          type="primary"
          icon={<FormOutlined />}
          onClick={() => {
            setActiveModel({ ...record });
            setEditModal(true);
          }}
        />
      ),
    },
    {
      title: '',
      dataIndex: '',
      key: 'deleteModel',
      width: 60,
      render: (_, record) => {
        return record.model !== 'default' ? (
          <Button
            title={`delete-model-${record.model}`}
            className={styles.InfoButton}
            type="danger"
            icon={<DeleteFilled />}
            onClick={() => {
              setActiveModel({ ...record });
              setDeleteModal(true);
            }}
          />
        ) : null;
      },
    },
  ];

  useEffect(() => {
    form.setFieldsValue({
      enabled,
      locationId: status.locationId ? status.locationId.toString() : '',
    });
  }, [data]);

  return (
    <Container>
      <Modal
        onCancel={() => setDeleteModal(false)}
        onSuccess={deleteModel}
        visible={deleteModal}
        title="Are you sure?"
        buttonText="Delete"
        buttonType="danger"
        content={
          <p>
            Are you sure you want to delete the model: <strong> {activeModel.model} </strong>
          </p>
        }
      />
      <FormModal
        onCancel={() => setAddModal(false)}
        visible={addModal}
        onSubmit={addModel}
        title="Add Model"
        profiles={dataProfile}
        loadingProfile={loadingProfile}
        errorProfile={errorProfile}
        usedModels={usedModels}
      />

      <FormModal
        onCancel={() => setEditModal(false)}
        visible={editModal}
        onSubmit={editModel}
        title="Edit Model"
        profiles={dataProfile}
        {...activeModel}
        loadingProfile={loadingProfile}
        errorProfile={errorProfile}
        usedModels={usedModels}
      />
      <Form {...layout} form={form}>
        <div className={styles.Header}>
          <h1>Auto-Provisioning</h1>
          <Item name="enabled" valuePropName="checked" noStyle>
            <Switch
              className={styles.Toggle}
              defaultChecked={enabled}
              onChange={() => setEnabled(!enabled)}
              checkedChildren="Enabled"
              unCheckedChildren="Disabled"
            />
          </Item>
          <div>
            <Button type="primary" onClick={onSubmit}>
              Save
            </Button>
          </div>
        </div>

        {enabled && (
          <div className={styles.Content}>
            <Card title="Target Location">
              {loadingLoaction && (
                <Spin data-testid="loadingLoaction" className={styles.spinner} size="large" />
              )}
              {errorLocation && (
                <Alert
                  data-testid="errorLocation"
                  message="Error"
                  description="Failed to load location."
                  type="error"
                  showIcon
                />
              )}
              {!loadingLoaction && !errorLocation && (
                <Item
                  label="Auto-Provisioning Location"
                  name="locationId"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your Auto Provision Location',
                    },
                  ]}
                >
                  <Select className={globalStyles.field} placeholder="Select Location">
                    {dataLocation.map(i => (
                      <Option key={i.id} value={i.id}>
                        {i.name}
                      </Option>
                    ))}
                  </Select>
                </Item>
              )}
            </Card>

            <Card
              title="Target Equipment Profiles"
              extra={<Button onClick={() => setAddModal(true)}>Add Model</Button>}
            >
              <div className={styles.Content}>
                <Table rowKey="model" columns={columns} dataSource={tableData} pagination={false} />
              </div>
            </Card>
          </div>
        )}
      </Form>
    </Container>
  );
};

AutoProvision.propTypes = {
  data: PropTypes.instanceOf(Object),
  dataLocation: PropTypes.instanceOf(Array),
  dataProfile: PropTypes.instanceOf(Array),
  loadingLoaction: PropTypes.bool,
  loadingProfile: PropTypes.bool,
  errorLocation: PropTypes.instanceOf(Object),
  errorProfile: PropTypes.instanceOf(Object),
  onUpdateCustomer: PropTypes.func,
};

AutoProvision.defaultProps = {
  data: {},
  dataLocation: [],
  dataProfile: [],
  loadingLoaction: true,
  loadingProfile: true,
  errorLocation: null,
  errorProfile: null,
  onUpdateCustomer: () => {},
};

export default AutoProvision;
