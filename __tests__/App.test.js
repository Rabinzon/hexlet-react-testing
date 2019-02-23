import React from 'react';
import { mount } from 'enzyme';

import App from '../src/Containers/App';

describe('application', () => {
  it('should render components tree', () => {
    const wrapper = mount(<App />);
    expect(wrapper).toMatchSnapshot();
  });
});
