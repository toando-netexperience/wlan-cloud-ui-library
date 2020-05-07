import React from 'react';
import { Card, Form, Input, Button } from 'antd';
import styles from './index.module.scss';

const { Item } = Form;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 7 },
};

const EditAccount = ({ onSubmit, email }) => {
  const handleSubmit = values => {
    onSubmit(values.newPassword, values.confirmedPassword);
  };

  return (
    <div className={styles.Container}>
      <Card className={styles.Card}>
        <h1>Edit Account</h1>

        <Form {...layout} name="editAccount" data-testid="editAccount" onFinish={handleSubmit}>
          <Item label="E-mail">
            <span className={styles.Email}>{email}</span>
          </Item>

          <Item
            label="New Password"
            name="newPassword"
            rules={[
              {
                required: true,
                message: 'Please input your new password',
              },
            ]}
          >
            <Input.Password className={styles.Field} visibilityToggle />
          </Item>

          <Item
            label="Confirm Password"
            name="confirmedPassword"
            rules={[
              {
                required: true,
                message: 'Please confirm your password',
              },
            ]}
          >
            <Input.Password className={styles.Field} visibilityToggle />
          </Item>
          <Button className={styles.Save} type="primary" htmlType="submit" data-testid="saveButton">
            SAVE CHANGES
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default EditAccount;
