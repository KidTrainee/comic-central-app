// @flow

import { StyleSheet } from 'react-native';
import { StackNavigator } from 'react-navigation';
import * as Pages from 'comicCentral/src/pages';
import { colors } from 'comicCentral/src/appStyle';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.navBar.background,
  },
  title: {
    color: colors.navBar.title,
  },
});

export default StackNavigator(
  {
    home: {
      screen: Pages.Home,
    },
  },
  {
    initialRouteName: 'home',
    navigationOptions: {
      header: {
        backTitle: null,
        style: styles.container,
        titleStyle: styles.title,
        tintColor: colors.navBar.title,
      },
    },
  }
);
