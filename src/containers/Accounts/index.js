import React, { useState } from 'react';
import { Table, Button, Modal } from 'antd';
import { FormOutlined, DeleteFilled } from '@ant-design/icons';
import PropTypes from 'prop-types';

import styles from './index.module.scss';
import AddModal from './Modals/AddModal/index';
import EditModal from './Modals/EditModal/index';
import DeleteModal from './Modals/DeleteModal/index';

const Accounts = ({ data }) => {
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const hideAddModal = () => {
    setAddModal(false);
  };
  const hideEditModal = () => {
    setEditModal(false);
  };
  const hideDeleteModal = () => {
    setDeleteModal(false);
  };

  const columns = [
    {
      title: 'E-MAIL',
      dataIndex: 'email',
      key: 'email',
      width: 620,
    },
    {
      title: 'ROLE',
      dataIndex: 'role',
      key: 'role',
      width: 120,
    },
    {
      title: '',
      dataIndex: 'edit',
      key: 'edit',
      render: () => (
        <Button
          className={styles.InfoButton}
          type="primary"
          icon={<FormOutlined />}
          onClick={() => setEditModal(true)}
        />
      ),
    },
    {
      title: '',
      dataIndex: 'delete',
      key: 'delete',
      render: () => (
        <Button
          className={styles.InfoButton}
          type="primary"
          icon={<DeleteFilled />}
          onClick={() => setDeleteModal(true)}
        />
      ),
    },
  ];
  // const dataSource = data.map(user => ({ key: user.id, email: user.username, role: user.role }));

  const dataSource = [
    {
      key: 1,
      email: 'support@example.com',
      role: 'Admin',
    },
    {
      key: 2,
      email: 'support@example.com',
      role: 'User',
    },
  ];

  return (
    <div className={styles.Container}>
      <div className={styles.View}>
        <h1>Accounts</h1>
        <Button id={styles.addAccount} type="primary" onClick={() => setAddModal(true)}>
          ADD ACCOUNT
        </Button>
      </div>

      <AddModal hideAddModal={hideAddModal} showAddModal={addModal} />
      <EditModal hideEditModal={hideEditModal} showEditModal={editModal} />
      <DeleteModal hideDeleteModal={hideDeleteModal} showDeleteModal={deleteModal} />

      <Table dataSource={dataSource} columns={columns} />
    </div>
  );
};

Accounts.propTypes = {
  data: PropTypes.isRequired,
};

export default Accounts;
