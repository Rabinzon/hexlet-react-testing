import React from 'react';
import { mount } from 'enzyme';
import nock from 'nock';
import 'react-log-state';

import App from '../src/components/App';
import urls from '../src/urls';

const tabContents = [
  'first tab content',
  'second tab content',
];

describe('application', () => {
  beforeAll(() => {
    global.ReactLogState.logAll();
  });
  /* it('should render components tree', () => {
    const wrapper = render(<App contents={tabContents} />);
    expect(wrapper).toMatchSnapshot();
  }); */

  it('should change tab', () => {
    const storage = {
      get: () => 0,
      set: () => {},
    };

    const wrapper = mount(<App storage={storage} />);

    let controls = wrapper.find('li[data-test="tab-control"]');
    const secondTab = controls.at(1);

    secondTab.simulate('click');
    controls = wrapper.find('li[data-test="tab-control"]');

    expect(controls.at(0)).toHaveProp('aria-selected', 'false');
    expect(controls.at(1)).toHaveProp('aria-selected', 'true');
  });

  it('should add new tab', () => {
    const storage = {
      get: () => 0,
      set: () => {},
    };

    const wrapper = mount(<App storage={storage} />);
    const addBtn = wrapper.find('[data-test="add-tab"]');
    const removeBtn = wrapper.find('[data-test="remove-tab"]');
    let tabsBox = wrapper.find('[data-test="tabs"]');

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
    let controls = wrapper.find('li[data-test="tab-control"]');
    const secondTab = controls.at(1);
    expect(controls.at(0)).toMatchSelector('[aria-selected="true"]');
    expect(controls.at(1)).toMatchSelector('[aria-selected="false"]');

    secondTab.simulate('click');

    wrapper = mount(<App storage={customStorage} />);
    controls = wrapper.find('li[data-test="tab-control"]');

    expect(controls.at(0)).toMatchSelector('[aria-selected="false"]');
    expect(controls.at(1)).toMatchSelector('[aria-selected="true"]');
  });

  it('should add rss feed', () => {
    const storage = {
      get: () => 0,
      set: () => {},
    };
    
    nock(urls.corsProxy)
      .get('/rss-feed')
      .reply(200, 'domain matched');

    let wrapper = mount(<App storage={storage} />);
    let controls = wrapper.find('[data-test="tab-control"]');
    const input = wrapper.find('[data-test="add-rss-input"]');
    const button = wrapper.find('[data-test="add-rss-button"]');
    const secondTab = controls.at(1);

    input.simulate('change', { target: { value: 'rss-feed' } });
    button.simulate('click');

    wrapper = mount(<App storage={storage} />);
    controls = wrapper.find('li[data-test="tab-control"]');
  });
});
