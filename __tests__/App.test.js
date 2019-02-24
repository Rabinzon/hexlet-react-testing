import React from 'react';
import { mount } from 'enzyme';
import nock from 'nock';
import { promises as fs } from 'fs';
import path from 'path';
import axios from 'axios';
import 'react-log-state';
import 'babel-polyfill';
import httpAdapter from 'axios/lib/adapters/http';

import parser from 'xml-js';
import App from '../src/components/App';
import urls from '../src/urls';

axios.defaults.host = urls.corsProxy;
axios.defaults.adapter = httpAdapter;

const tabContents = [
  'first tab content',
  'second tab content',
];

const delay = t => new Promise((resolve) => {
  setTimeout(() => resolve(), t);
});

const buidSelectors = wrapper => ({
  tabs: () => wrapper.find('[data-test="tabs"]'),
  addTabBtn: () => wrapper.find('[data-test="add-tab"]'),
  tabControls: () => wrapper.find('li[data-test="tab-control"]'),
  removeTabBtn: () => wrapper.find('[data-test="remove-tab"]'),
  rssInput: () => wrapper.find('[data-test="add-rss-input"]'),
  rssForm: () => wrapper.find('[data-test="add-rss-form"]'),
});

const readFixture = async fixtureFileName => fs.readFile(path.resolve(__dirname, '../__fixtures__', fixtureFileName), 'utf8');

describe('application', () => {
  beforeAll(() => {
    global.ReactLogState.logAll();
  });

  it('should change tab', () => {
    const storage = {
      get: () => 0,
      set: () => {},
    };

    const wrapper = mount(<App storage={storage} />);
    const s = buidSelectors(wrapper);
    let controls = s.tabControls();
    const secondTab = controls.at(1);

    secondTab.simulate('click');
    controls = s.tabControls();

    expect(controls.at(0)).toHaveProp('aria-selected', 'false');
    expect(controls.at(1)).toHaveProp('aria-selected', 'true');
  });

  it('should add new tab', () => {
    const storage = {
      get: () => 0,
      set: () => {},
    };

    const wrapper = mount(<App storage={storage} />);
    const s = buidSelectors(wrapper);

    const addBtn = s.addTabBtn();
    const removeBtn = s.removeTabBtn();
    let tabsBox = s.tabs();

    expect(tabsBox).toContainMatchingElements(tabContents.length, 'li[data-test="tab-control"]');

    addBtn.simulate('click');
    tabsBox = wrapper.find('[data-test="tabs"]');

    expect(tabsBox).toContainMatchingElements(tabContents.length + 1, 'li[data-test="tab-control"]');

    removeBtn.simulate('click');
    tabsBox = wrapper.find('[data-test="tabs"]');

    expect(tabsBox).toContainMatchingElements(tabContents.length, 'li[data-test="tab-control"]');
  });

  it('should remember last opened tab', () => {
    const storedData = {};

    const customStorage = {
      get: key => storedData[key],
      set: (key, value) => {
        storedData[key] = value;
      },
    };

    let wrapper = mount(<App storage={customStorage} />);
    let s = buidSelectors(wrapper);
    let controls = s.tabControls();
    const secondTab = controls.at(1);

    expect(controls.at(0)).toHaveProp('aria-selected', 'true');
    expect(controls.at(1)).toHaveProp('aria-selected', 'false');

    secondTab.simulate('click');

    wrapper = mount(<App storage={customStorage} />);
    s = buidSelectors(wrapper);
    controls = s.tabControls();

    expect(controls.at(0)).toHaveProp('aria-selected', 'false');
    expect(controls.at(1)).toHaveProp('aria-selected', 'true');
  });

  it('should add rss feed', async () => {
    const storage = {
      get: () => 0,
      set: () => {},
    };

    const fixture = await readFixture('nasa.xml');

    nock(urls.corsProxy)
      .get('/rss-feed')
      .reply(200, fixture);

    const data = JSON.parse(parser.xml2json(fixture, { compact: true, spaces: 2 }));

    const wrapper = mount(<App storage={storage} />);
    const s = buidSelectors(wrapper);

    let controls = s.tabControls();
    const input = s.rssInput();
    const form = s.rssForm();

    input.simulate('change', { target: { value: 'rss-feed' } });
    form.simulate('submit');

    await delay(100);
    wrapper.update();
    controls = s.tabControls();
    expect(s.tabs()).toContainMatchingElements(3, 'li[data-test="tab-control"]');
    expect(controls.at(2)).toHaveProp('aria-selected', 'true');
    const { rss: { channel: { title: { _text: text } } } } = data;

    expect(controls.at(2)).toHaveText(text);
  });
});
