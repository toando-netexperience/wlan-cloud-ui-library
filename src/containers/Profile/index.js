import React from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'antd';
import { DeleteFilled, ReloadOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Container from 'components/Container';
import Header from 'components/Header';

import styles from './index.module.scss';

const Profile = ({ data, onReload, onLoadMore, isLastPage }) => {
  const columns = [
    {
      title: 'NAME',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      render: (_, record) => <Link to={`/profiles/${record.id}`}>{record.name}</Link>,
    },
    {
      title: 'TYPE',
      dataIndex: 'profileType',
      key: 'type',
      width: 250,
      render: (_, record) => <Link to={`/profiles/${record.id}`}>{record.profileType}</Link>,
    },
    {
      title: 'ACCESS POINTS',
      dataIndex: '__typename',
      key: 'access',
      width: 700,
      render: (_, record) => <Link to={`/profiles/${record.id}`}>{record.__typename}</Link>,
    },
    {
      title: '',
      dataIndex: 'delete',
      key: 'delete',
      width: 80,
      render: (_, record) => <Button icon={<DeleteFilled />} onClick={() => console.log(record)} />,
    },
  ];

  return (
    <Container>
      <Header>
        <h1>Profiles</h1>
        <div className={styles.Buttons}>
          <Button onClick={() => {}}>Add Account</Button>
          <Button icon={<ReloadOutlined />} onClick={onReload} />
        </div>
      </Header>
      <Table dataSource={data} columns={columns} pagination={false} />
      {!isLastPage && (
        <div className={styles.LoadMore}>
          <Button onClick={onLoadMore}>Load More</Button>
        </div>
      )}
    </Container>
  );
};

Profile.propTypes = {
  data: PropTypes.instanceOf(Array),
  onReload: PropTypes.func,
  onLoadMore: PropTypes.func,
  isLastPage: PropTypes.bool,
};

Profile.defaultProps = {
  data: [],
  onReload: () => {},
  onLoadMore: () => {},
  isLastPage: true,
};

export default Profile;
