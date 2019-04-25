package com.cgs.teamworkar;

import android.util.Log;
import android.view.View;
import android.widget.Toast;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.NativeViewHierarchyManager;
import com.facebook.react.uimanager.UIBlock;
import com.facebook.react.uimanager.UIManagerModule;


public class ARModule extends ReactContextBaseJavaModule {

    public class MyViewHandler {
        public void handle(ARView view) {

        }
    }

    ReactApplicationContext reactApplicationContext;


    public ARModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactApplicationContext = reactContext;
    }

    @Override
    public String getName() {
        return "ARModule";
    }



    @ReactMethod
    public void joinRoom(String role, String twilioId, String twilioToken, final int viewId, final Promise promise) {
        withMyView(viewId, promise, new MyViewHandler() {
            @Override
            public void handle(ARView view) {
                view.joinRoom(role, twilioId, twilioToken);
                promise.resolve("Called");
            }
        });
    }


    @ReactMethod
    public void toggleMute(boolean isMute, final int viewId, final Promise promise) {
        withMyView(viewId, promise, new MyViewHandler() {
            @Override
            public void handle(ARView view) {
                view.toggleMute(isMute);
                promise.resolve("Called");
            }
        });
    }

    @ReactMethod
    public void videoCapture(final int viewId, final Promise promise) {
        withMyView(viewId, promise, new MyViewHandler() {
            @Override
            public void handle(ARView view) {
                view.videoCapture();
                promise.resolve("Called");
            }
        });
    }

    @ReactMethod
    public void setToolWithCoordinate(double posX, double posY, String toolName, final int viewId, final Promise promise) {
        withMyView(viewId, promise, new MyViewHandler() {
            @Override
            public void handle(ARView view) {
                view.sufaceObject();
                promise.resolve("Called");
            }
        });

    }

    @ReactMethod
    public void placeObj(float x, float y, final int viewId, final Promise promise) {
        withMyView(viewId, promise, new MyViewHandler() {
            @Override
            public void handle(ARView view) {
                view.placeObj(x, y);
                promise.resolve("Called");
            }
        });

    }

    @ReactMethod
    public void changeObjectModel(String name, final int viewId, final Promise promise) {
        withMyView(viewId, promise, new MyViewHandler() {
            @Override
            public void handle(ARView view) {
                view.changeObjectModel(name);
                promise.resolve("Called");
            }
        });
    }

    @ReactMethod
    public void setMinMaxScale(String toolName,float min,float max, final int viewId, final Promise promise) {
        withMyView(viewId, promise, new MyViewHandler() {
            @Override
            public void handle(ARView view) {
                view.setMinMaxScale(toolName, min, max);
                promise.resolve("Called");
            }
        });
    }

    @ReactMethod
    public void undoAnchor(final int viewId, final Promise promise) {
        withMyView(viewId, promise, new MyViewHandler() {
            @Override
            public void handle(ARView view) {
                view.undoAnchor();
                promise.resolve("Called");
            }
        });
    }

    @ReactMethod
    public void redoAnchor(final int viewId, final Promise promise) {
        withMyView(viewId, promise, new MyViewHandler() {
            @Override
            public void handle(ARView view) {
                view.redoAnchor();
                promise.resolve("Called");
            }
        });
    }


    @ReactMethod
    public void changeDefaultColor(int r,int g, int b, final int viewId, final Promise promise) {
        withMyView(viewId, promise, new MyViewHandler() {
            @Override
            public void handle(ARView view) {
                view.changeDefaultColor(r,g,b);
                promise.resolve("Called");
            }
        });
    }

    @ReactMethod
    public void changeDefaultColor(String hex, final int viewId, final Promise promise) {
        withMyView(viewId, promise, new MyViewHandler() {
            @Override
            public void handle(ARView view) {
                view.changeDefaultColor(hex);
                promise.resolve("Called");
            }
        });
    }

    private void showToast(){
        Toast.makeText(reactApplicationContext,"Hello",Toast.LENGTH_SHORT).show();
    }

    private void withMyView(final int viewId, final Promise promise, final MyViewHandler handler) {
        UIManagerModule uiManager = getReactApplicationContext().getNativeModule(UIManagerModule.class);
        uiManager.addUIBlock(new UIBlock() {
            @Override
            public void execute(NativeViewHierarchyManager nativeViewHierarchyManager) {
                View view = nativeViewHierarchyManager.resolveView(viewId);
                if (view instanceof ARView) {
                    ARView myView = (ARView) view;
                    handler.handle(myView);
                }
                else {
                    Log.e("Hello", "Expected view to be instance of MyView, but found: " + view);
                    promise.reject("my_view", "Unexpected view type");
                }
            }
        });
    }

}
