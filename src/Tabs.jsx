import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

class MyTabs extends PureComponent {
  static propTypes = {
    titles: PropTypes.array.isRequired,
    contents: PropTypes.array.isRequired,
  };

  state = {
    titles: [],
    contents: [],
  }

  handleAdd = () => {
    const { titles, contents } = this.state;

    this.setState({
      titles: [...titles, `tab #${titles.length}`],
      contents: [...contents, `tab content #${titles.length}`],
    });
  }

  handleRemove = () => {
    const { titles, contents } = this.state;

    this.setState({
      titles: titles.slice(0, titles.length - 1),
      contents: contents.slice(0, titles.length - 1),
    });
  }

  render() {
    const { titles, contents } = this.props;
    const { titles: stateTitles, contents: stateContents } = this.state;

    return (
      <Fragment>
        <button onClick={this.handleAdd} data-testid="add-tab">Add one tab</button>
        <button onClick={this.handleRemove} data-testid="remove-tab">Remove one tab</button>

        <Tabs>
          <TabList>
            {titles.map((title, i) => <Tab data-testid={`tab-${i}`} key={title}>{title}</Tab>)}
            {stateTitles.map((title, i) => <Tab data-testid={`tab-${i + 2}`} key={title}>{title}</Tab>)}
          </TabList>
          <div data-testid="tabs-content">
            {contents.map((content, i) => <TabPanel data-testid={`tab-panel-${i}`} key={content}>{content}</TabPanel>)}
            {stateContents.map((content, i) => <TabPanel data-testid={`tab-panel-${i + 2}`} key={content}>{content}</TabPanel>)}
          </div>
        </Tabs>
      </Fragment>

    );
  }
}

export default MyTabs;
