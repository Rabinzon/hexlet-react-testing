import React from 'react';
import PropTypes from 'prop-types';

import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const MyTabs = props => (
  <Tabs>
    <TabList>
      {props.titles.map((title) => <Tab data-test={`tab-control`} key={title}>{title}</Tab>)}
    </TabList>
    <div data-test="tabs-content">
      {props.contents.map(content => <TabPanel data-test={'tab-panel'} key={content}>{content}</TabPanel>)}
    </div>
  </Tabs>
);

MyTabs.propTypes = {
  titles: PropTypes.array.isRequired,
  contents: PropTypes.array.isRequired,
};

export default MyTabs;
