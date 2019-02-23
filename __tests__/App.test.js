import React from 'react';
import { mount } from 'enzyme';
import 'react-log-state';

import App from '../src/components/App';

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
    const wrapper = mount(<App />);

    let controls = wrapper.find('li[data-test="tab-control"]');
    const secondTab = controls.at(1);

    secondTab.simulate('click');
    controls = wrapper.find('li[data-test="tab-control"]');

    expect(controls.at(0)).toMatchSelector('[aria-selected="false"]');
    expect(controls.at(1)).toMatchSelector('[aria-selected="true"]');
  });

  it('should add new tab', () => {
    const wrapper = mount(<App />);
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
});
