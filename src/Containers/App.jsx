import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import { pure, compose } from 'recompose';
import Tabs from './Tabs';

const styles = {
  root: {
    color: 'red',
  },
};

const tabTitles = [
  'first tab',
  'second tab',
];

const tabContents = [
  'first tab content',
  'second tab content',
];

const MyComponent = (props) => {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <p>
        Hello world!
      </p>
      <Tabs
        titles={tabTitles}
        contents={tabContents}
      />
    </div>
  );
};

MyComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  pure,
  withStyles(styles),
)(MyComponent);
