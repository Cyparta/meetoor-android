/**
 * @format
 */
import 'react-native-gesture-handler';
import React from 'react';
import { AppRegistry } from 'react-native';
import bgMessaging from './helper/bgMessaging';
import bgActions from './helper/bgActions';
// import ReactNativeForegroundService from "@supersami/rn-foreground-service";
import { name as appName } from './app.json';
/////////////////////////////////////////////
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import rootReducer from './src/reducer/index';
import App from './src/App';
import { EntryMeetoor } from './src/helperapp';
///////////////////////////////////////////////
const store = createStore(rootReducer, applyMiddleware(thunk));
EntryMeetoor(store?.dispatch);
if (process.env.NODE_ENV !== "development") {
    console.log = console.info = console.warn = console.error = console.debug = () => null;
}
///////////////////////////////////////////////
const Main = () => (<Provider store={store}><App /></Provider>);
AppRegistry.registerComponent(appName, () => Main);
///////////////////////////////////////////////
// ReactNativeForegroundService.register();
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgMessaging);
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundNotificationAction', () => bgActions);

// import UIKit
// import Firebase
// content_copy


// @UIApplicationMain
// class AppDelegate: UIResponder, UIApplicationDelegate {

//   var window: UIWindow?

//   func application(_ application: UIApplication,
//     didFinishLaunchingWithOptions launchOptions:
//       [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
//     FirebaseApp.configure()
// content_copy

//     return true
//   }
// }

// @import UIKit;
// @import Firebase;
// content_copy


// @implementation AppDelegate

// - (BOOL)application:(UIApplication *)application
//     didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
//   [FIRApp configure];
// content_copy

//   return YES;
// }
