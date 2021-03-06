import React from 'react';
import PropTypes from 'prop-types';
import Tabs from './Tabs';

const tabTitles = [
  'first tab',
  'second tab',
];

const tabContents = [
  'first tab content',
  'second tab content',
];

const App = ({ titles = tabTitles, contents = tabContents, storage }) => (
  <div>
    <p>
      Hello world!
    </p>
    <Tabs
      storage={storage}
      titles={titles}
      contents={contents}
    />
  </div>
);

App.propTypes = {
  titles: PropTypes.array,
  contents: PropTypes.array,
  storage: PropTypes.shape({
    get: PropTypes.func.isRequired,
    set: PropTypes.func.isRequired,
  }).isRequired,
};


export default App;
