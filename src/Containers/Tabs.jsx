import React from 'react';
import PropTypes from 'prop-types';
import { pure, compose } from 'recompose';
import { map } from 'lodash-fp';

import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const MyTabs = props => (
  <Tabs>
    <TabList>
      {map(title => <Tab key={title}>{title}</Tab>)(props.titles)}
    </TabList>
    {map(content => <TabPanel key={content}>{content}</TabPanel>)(props.contents)}
  </Tabs>
);

MyTabs.propTypes = {
  titles: PropTypes.array.isRequired,
  contents: PropTypes.array.isRequired,
};

export default compose(
  pure,
)(MyTabs);
