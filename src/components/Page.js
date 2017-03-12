// @flow

import React, { PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';
import appStyle from 'comicCentral/src/appStyle';

const styles = StyleSheet.create({
  page: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
});

const Page = props => (
  <View
    style={[
      styles.page,
      {
        paddingHorizontal: props.noPadding ? 0 : appStyle.grid.x3,
        backgroundColor: props.backgroundColor,
      },
    ]}
  >
    {props.children}
  </View>
);

Page.propTypes = {
  children: PropTypes.node.isRequired,
  noPadding: PropTypes.bool,
  backgroundColor: PropTypes.string,
};

Page.defaultProps = {
  children: null,
  noPadding: false,
  backgroundColor: appStyle.colors.color,
};

export default Page;
