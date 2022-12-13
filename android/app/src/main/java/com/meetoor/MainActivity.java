package com.meetoor;
import android.os.Bundle;
////////////////////////////////////////
import android.util.Log;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
// import android.content.Intent;
// import com.facebook.react.bridge.Arguments;
// import com.facebook.react.bridge.WritableMap;
// import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "meetoor";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);
  }

  // Add from here down to the end of your MainActivity
  // public boolean isOnNewIntent = false;

  // @Override
  // public void onNewIntent(Intent intent) {
  //   super.onNewIntent(intent);
  //   isOnNewIntent = true;
  //   ForegroundEmitter(intent);
  // }

  // @Override
  // protected void onStart() {
  //   super.onStart();
  //   if (isOnNewIntent != true) {
  //     ForegroundEmitter(getIntent());
  //   }
  // }

  // public void ForegroundEmitter(Intent intent) {
  //   String main = intent.getStringExtra("mainOnPress");
  //   String btn = intent.getStringExtra("buttonOnPress");
  //   WritableMap map = Arguments.createMap();

  //   if (main != null) {
  //     map.putString("main", main);
  //   }
  //   if (btn != null) {
  //     map.putString("button", btn);
  //   }
  //   try {
  //     getReactInstanceManager()
  //       .getCurrentReactContext()
  //       .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
  //       .emit("notificationClickHandle", map);
  //   } catch (Exception e) {
  //     Log.e("SuperLog", "Caught Exception: " + e.getMessage());
  //   }
  // }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected ReactRootView createRootView() {
        return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }
    };
  }
}
