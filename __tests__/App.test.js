import React from 'react';
import { mount } from 'enzyme';
import 'react-log-state';

import App from '../src/App';

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
    const wrapper = mount(<App />);
    const $content = wrapper.find('[data-testid="tabs-content"]');
    const $firstTab = wrapper.find('[data-testid="tab-0"]').at(0);
    const $secondTab = wrapper.find('[data-testid="tab-1"]').at(0);

    expect($content).toHaveText(tabContents[0]);
    $secondTab.simulate('click');
    expect($content).toHaveText(tabContents[1]);
    $firstTab.simulate('click');
    expect($content).toHaveText(tabContents[0]);
  });

  it('should add new tab', () => {
    const wrapper = mount(<App />);
    let $contents = wrapper.find('[data-testid="tabs-content"]').children();

    const $addBtn = wrapper.find('button[data-testid="add-tab"]');
    const $removeBtn = wrapper.find('button[data-testid="remove-tab"]');

    expect($contents).toHaveLength(tabContents.length);
    $addBtn.simulate('click');
    $contents = wrapper.find('[data-testid="tabs-content"]').children();
    expect($contents).toHaveLength(tabContents.length + 1);

    $removeBtn.simulate('click');
    $contents = wrapper.find('[data-testid="tabs-content"]').children();
    expect($contents).toHaveLength(tabContents.length);
  });
});
