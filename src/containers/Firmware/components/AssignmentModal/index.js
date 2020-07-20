import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Select, Spin } from 'antd';

import Modal from 'components/Modal';
import styles from 'styles/index.scss';

const { Item } = Form;
const { Option } = Select;

const AssignmentModal = ({
  onCancel,
  onSubmit,
  visible,
  title,
  firmwareVersionRecordId,
  modelId,
  filteredModels,
  handleSearchFirmware,
  firmwareVersionData,
  firmwareVersionLoading,
}) => {
  const [form] = Form.useForm();
  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({ modelId, firmwareVersionRecordId });
    handleSearchFirmware(modelId);
  }, [visible]);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
  };

  const onModelChange = value => {
    handleSearchFirmware(value);
    form.setFieldsValue({ firmwareVersionRecordId: '' });
  };

  const content = (
    <Form {...layout} form={form}>
      <Item
        label="Model ID"
        name="modelId"
        rules={[
          {
            required: true,
            message: 'Please input your Model ID',
          },
        ]}
      >
        <Select
          className={styles.field}
          placeholder="Select Model ID"
          onChange={onModelChange}
          disabled={modelId !== ' '}
        >
          {Object.keys(filteredModels).map(i => (
            <Option key={filteredModels[i]} value={filteredModels[i]}>
              {filteredModels[i]}
            </Option>
          ))}
        </Select>
      </Item>

      <Item
        label="Firmware Version"
        name="firmwareVersionRecordId"
        rules={[
          {
            required: true,
            message: 'Please select your firmware version',
          },
        ]}
      >
        {firmwareVersionLoading ? (
          <Spin size="large" />
        ) : (
          <Select className={styles.field} placeholder="Select Firmware Version">
            {Object.keys(firmwareVersionData).map(i => (
              <Option key={firmwareVersionData[i].id} value={firmwareVersionData[i].id}>
                {firmwareVersionData[i].versionName}
              </Option>
            ))}
          </Select>
        )}
      </Item>
    </Form>
  );

  const handleOnSuccess = () => {
    form
      .validateFields()
      .then(values => {
        form.resetFields();
        onSubmit(values);
      })
      .catch(() => {});
  };

  return (
    <Modal
      onCancel={onCancel}
      visible={visible}
      onSuccess={handleOnSuccess}
      title={title}
      content={content}
    />
  );
};

AssignmentModal.propTypes = {
  onCancel: PropTypes.func,
  visible: PropTypes.bool,
  onSubmit: PropTypes.func,
  title: PropTypes.string,
  firmwareVersionRecordId: PropTypes.string,
  modelId: PropTypes.string,
  filteredModels: PropTypes.instanceOf(Object),
  handleSearchFirmware: PropTypes.func,
  firmwareVersionData: PropTypes.instanceOf(Object),
  firmwareVersionLoading: PropTypes.bool,
};

AssignmentModal.defaultProps = {
  onCancel: () => {},
  visible: () => {},
  onSubmit: () => {},
  handleSearchFirmware: () => {},
  title: '',
  firmwareVersionRecordId: '',
  modelId: ' ',
  filteredModels: {},
  firmwareVersionData: {},
  firmwareVersionLoading: false,
};

export default AssignmentModal;
