package com.cgs.teamworkar;

import android.util.Log;

import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

public class ARViewManager extends SimpleViewManager<ARView> {
    public ARView arView;
    public static final String REACT_CLASS = "ARViewManager";
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected ARView createViewInstance(ThemedReactContext reactContext) {
        arView = new ARView(reactContext);
        return arView;
    }

    @Override
    public Map<String, String> getNativeProps() {
        return super.getNativeProps();
    }

    @ReactProp(name = "")
    public void setObject(ARView view, double chart_wh) {

    }

    @ReactMethod
    public void sufaceObject() {
        Log.d("Hello", "Shahid");
       // Toast.makeText(mContext,"Hello in ARView",Toast.LENGTH_SHORT).show();
    }

}
