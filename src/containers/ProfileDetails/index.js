import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Card } from 'antd';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Container from 'components/Container';
import Header from 'components/Header';

import styles from './index.module.scss';

const ProfileDetails = ({ name }) => {
  const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 12 },
  };

  const [form] = Form.useForm();
  const { Item } = Form;

  return (
    <Container>
      <Header>
        <Link to="/profiles">
          <Button className={styles.backButton}> BACK </Button>
        </Link>
        <div>
          <Button type="danger" onClick={() => {}}>
            Delete
          </Button>
          <Button onClick={() => {}}>Save</Button>
        </div>
      </Header>
      <Card className={styles.Card}>
        <Form {...layout} form={form}>
          <Item
            name="name"
            label="Profile Name"
            rules={[{ required: true, message: 'Please input your new profile name' }]}
          >
            <Input className={styles.Field} defaultValue={name} />
          </Item>
        </Form>
      </Card>
    </Container>
  );
};

ProfileDetails.propTypes = {
  name: PropTypes.string,
};

ProfileDetails.defaultProps = {
  name: null,
};

export default ProfileDetails;
