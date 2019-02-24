import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import parser from 'xml-js';

import 'react-tabs/style/react-tabs.css';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';

import urls from '../urls';

class MyTabs extends PureComponent {
  static propTypes = {
    titles: PropTypes.array.isRequired,
    contents: PropTypes.array.isRequired,
    storage: PropTypes.shape({
      get: PropTypes.func.isRequired,
      set: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      titles: [],
      contents: [],
      isSubmitting: false,
      tabIndex: Number(props.storage.get('tabIndex') || 0),
    };
  }

  handleAdd = () => {
    const { titles, contents } = this.state;
    const { storage } = this.props;
    const newIndex = this.props.titles.length + titles.length;

    this.setState({
      titles: [...titles, `tab #${newIndex}`],
      contents: [...contents, `tab content #${newIndex}`],
      tabIndex: newIndex,
    }, () => {
      storage.set('tabIndex', newIndex);
    });
  }

  handleRemove = () => {
    const { titles, contents } = this.state;
    const { storage } = this.props;
    const newIndex = this.props.titles.length + (titles.length - 1);

    this.setState({
      titles: titles.slice(0, titles.length - 1),
      contents: contents.slice(0, titles.length - 1),
      tabIndex: newIndex,
    }, () => {
      storage.set('tabIndex', newIndex);
    });
  }

  handleAddFeed = (title, items) => {
    const { titles, contents } = this.state;
    const { storage } = this.props;
    const newIndex = this.props.titles.length + titles.length;

    this.setState({
      titles: [...titles, title],
      contents: [...contents, this.renderFeed(items)],
      tabIndex: newIndex,
      isSubmitting: false,
    }, () => {
      storage.set('tabIndex', newIndex);
    });
  }

  handleSelect = (tabIndex) => {
    const { storage } = this.props;

    this.setState({ tabIndex }, () => {
      storage.set('tabIndex', tabIndex);
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const input = e.target[0];
    const { value } = input;

    this.setState({
      isSubmitting: true,
    }, () => {
      axios.get(new URL(`${urls.corsProxy}/${value}`))
        .then(({ data }) => {
          console.log('data', data);

          const result = JSON.parse(parser.xml2json(data, { compact: true, spaces: 2 }));
          const { rss: { channel: { title: { _text: text }, item } } } = result;
          this.handleAddFeed(text, item);
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            isSubmitting: false,
          });
        });
    });
  }

  renderFeed = items => (
    <ul>
      {items.map(({
        link: { _text: href }, title: { _text: name },
      }, i) => <li key={i}><a href={href}>{name}</a></li>)
      }
    </ul>
  )

  render() {
    const { titles, contents } = this.props;
    const { titles: stateTitles, contents: stateContents } = this.state;

    return (
      <div data-test='tabs'>
        <button onClick={this.handleAdd} data-test="add-tab">Add one tab</button>
        <button onClick={this.handleRemove} data-test="remove-tab">Remove one tab</button>
        <br/>
        <form onSubmit={this.handleSubmit}>
          <input data-test='add-rss-input' disabled={this.state.isSubmitting} type="text"/>
          <button data-test='add-rss-button' disabled={this.state.isSubmitting}>add feed</button>
          {this.state.isSubmitting && 'Loading...'}
        </form>

        <Tabs selectedIndex={this.state.tabIndex} onSelect={this.handleSelect}>
          <TabList>
            {titles.map(title => <Tab data-test="tab-control" key={title}>{title}</Tab>)}
            {stateTitles.map(title => <Tab data-test="tab-control" key={title}>{title}</Tab>)}
          </TabList>
          <div data-test="tabs-content">
            {contents.map(content => <TabPanel data-test="tab-panel" key={content}>{content}</TabPanel>)}
            {stateContents.map(content => <TabPanel data-test="tab-panel" key={content}>{content}</TabPanel>)}
          </div>
        </Tabs>
      </div>

    );
  }
}

export default MyTabs;
