import React from 'react';
import { render, mount } from 'enzyme';

import App from '../src/App';

const tabContents = [
  'first tab content',
  'second tab content',
];

describe('application', () => {
  it('should render components tree', () => {
    const wrapper = render(<App contents={tabContents} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should change tab', () => {
    const wrapper = mount(<App />);
    const $content = wrapper.find('[data-testid="tabs-content"]');
    const $firstTab = wrapper.find('li[data-testid="tab-0"]');
    const $secondTab = wrapper.find('li[data-testid="tab-1"]');

    expect($content).toHaveText(tabContents[0]);
    $secondTab.simulate('click');
    expect($content).toHaveText(tabContents[1]);
    $firstTab.simulate('click');
    expect($content).toHaveText(tabContents[0]);
  });
});
