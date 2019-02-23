import React from 'react';
import { mount } from 'enzyme';

import App from '../src/components/App';

const tabContents = [
  'first tab content',
  'second tab content',
];

describe('application', () => {
  it('should render components tree', () => {
    const wrapper = mount(<App contents={tabContents} />);
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('should change tab', () => {
    let content;

    const wrapper = mount(<App />);
    const firstTab = wrapper.find('[data-testid="tab-0"]').at(0);
    const secondTab = wrapper.find('[data-testid="tab-1"]').at(0);

    content = wrapper.find('[data-testid="tabs-content"]');

    expect(content.render()).toMatchSnapshot();
    secondTab.simulate('click');
    content = wrapper.find('[data-testid="tabs-content"]');
    expect(wrapper.render()).toMatchSnapshot();
    firstTab.simulate('click');
    content = wrapper.find('[data-testid="tabs-content"]');
    expect(content.render()).toMatchSnapshot();
  });
});
