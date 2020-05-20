import React from 'react';
import PropTypes from 'prop-types';
import LocationsTree from 'components/LocationsTree';
import ToggleButton from 'components/ToggleButton';
import ReloadButton from 'components/ReloadButton';
import styles from './index.module.scss';

const Network = ({ locations, checkedLocations, onSelect, onCheck, activeTab, children }) => {
  const onReload = () => {
    // console.log('Reload Button Clicked');
  };
  return (
    <div className={styles.clientDevices}>
      <div className={styles.mainWrapper}>
        <LocationsTree
          locations={locations}
          onSelect={onSelect}
          onCheck={onCheck}
          checkedLocations={checkedLocations}
        />
        <div className={styles.mainContent}>
          <div className={styles.headerContent}>
            <ToggleButton activeTab={activeTab} />
            <ReloadButton onReload={onReload} />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

Network.propTypes = {
  locations: PropTypes.instanceOf(Array).isRequired,
  checkedLocations: PropTypes.instanceOf(Array).isRequired,
  onSelect: PropTypes.func.isRequired,
  onCheck: PropTypes.func.isRequired,
  activeTab: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Network;
