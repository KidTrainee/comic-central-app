import { StackNavigator } from 'react-navigation';

import * as Pages from 'comicCentral/src/pages';

export default StackNavigator({
  home: {
    screen: Pages.Home,
  },
}, {
  initialRouteName: 'home',
});
