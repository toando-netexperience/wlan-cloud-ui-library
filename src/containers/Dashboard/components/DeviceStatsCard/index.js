import React from 'react';
import PropTypes from 'prop-types';

import Card from '../Card';
import styles from './index.module.scss';

const DeviceStatsCard = ({ title, cardData }) => {
  return (
    <Card title={title}>
      {Object.keys(cardData).map(d => {
        return (
          <div key={d} className={styles.row}>
            <div>{d}</div>
            <div>: {cardData[d]}</div>
          </div>
        );
      })}
    </Card>
  );
};

DeviceStatsCard.propTypes = {
  cardData: PropTypes.instanceOf(Object),
  title: PropTypes.string,
};

DeviceStatsCard.defaultProps = {
  cardData: {},
  title: '',
};

export default DeviceStatsCard;
