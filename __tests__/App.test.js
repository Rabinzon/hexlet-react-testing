import React from 'react';
import { mount } from 'enzyme';
import 'react-log-state';

import App from '../src/components/App';

const tabContents = [
  'first tab content',
  'second tab content',
];

describe('application', () => {
  /* it('should render components tree', () => {
    const wrapper = render(<App contents={tabContents} />);
    expect(wrapper).toMatchSnapshot();
  }); */

  it('should change tab', () => {
    let content;

    const wrapper = mount(<App />);

    const controls = wrapper.find('[data-test="tab-control"]').hostNodes();
    const firstTab = controls.at(0);
    const secondTab = controls.at(1);

    content = wrapper.find('[data-test="tabs-content"]');
  
    expect(content).toHaveText(tabContents[0]);
    secondTab.simulate('click');
    expect(content).toHaveText(tabContents[1]);
    firstTab.simulate('click');
    expect(content).toHaveText(tabContents[0]);
  });

  it('should add new tab', () => {
    const wrapper = mount(<App />);
    let $contents = wrapper.find('[data-test="tabs-content"]').children();

    const $addBtn = wrapper.find('button[data-test="add-tab"]');
    const $removeBtn = wrapper.find('button[data-test="remove-tab"]');

    expect($contents).toHaveLength(tabContents.length);
    $addBtn.simulate('click');
    $contents = wrapper.find('[data-test="tabs-content"]').children();
    expect($contents).toHaveLength(tabContents.length + 1);

    $removeBtn.simulate('click');
    $contents = wrapper.find('[data-test="tabs-content"]').children();
    expect($contents).toHaveLength(tabContents.length);
  });
});
