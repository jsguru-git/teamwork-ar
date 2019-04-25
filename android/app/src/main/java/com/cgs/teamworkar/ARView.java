package com.cgs.teamworkar;

import android.Manifest;
import android.app.Activity;
import android.app.ActivityManager;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.media.AudioAttributes;
import android.media.AudioFocusRequest;
import android.media.AudioManager;
import android.os.Build;
import android.os.Handler;
import android.os.HandlerThread;
import android.preference.PreferenceManager;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v4.app.Fragment;
import android.support.v4.content.ContextCompat;
import android.util.AttributeSet;
import android.util.Base64;
import android.util.Log;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.PixelCopy;
import android.view.SurfaceView;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.google.ar.core.Anchor;
import com.google.ar.core.Frame;
import com.google.ar.core.HitResult;
import com.google.ar.core.Plane;
import com.google.ar.sceneform.AnchorNode;
import com.google.ar.sceneform.Node;
import com.google.ar.sceneform.math.Quaternion;
import com.google.ar.sceneform.math.Vector3;
import com.google.ar.sceneform.rendering.Color;
import com.google.ar.sceneform.rendering.Material;
import com.google.ar.sceneform.rendering.MaterialFactory;
import com.google.ar.sceneform.rendering.ModelRenderable;
import com.google.ar.sceneform.rendering.Renderable;
import com.google.ar.sceneform.ux.TransformableNode;
import com.twilio.video.AudioCodec;
import com.twilio.video.CameraCapturer;
import com.twilio.video.ConnectOptions;
import com.twilio.video.EncodingParameters;
import com.twilio.video.LocalAudioTrack;
import com.twilio.video.LocalParticipant;
import com.twilio.video.LocalVideoTrack;
import com.twilio.video.RemoteAudioTrack;
import com.twilio.video.RemoteAudioTrackPublication;
import com.twilio.video.RemoteDataTrack;
import com.twilio.video.RemoteDataTrackPublication;
import com.twilio.video.RemoteParticipant;
import com.twilio.video.RemoteVideoTrack;
import com.twilio.video.RemoteVideoTrackPublication;
import com.twilio.video.Room;
import com.twilio.video.TwilioException;
import com.twilio.video.Video;
import com.twilio.video.VideoCodec;
import com.twilio.video.VideoRenderer;
import com.twilio.video.VideoTrack;
import com.twilio.video.VideoView;
import com.twilio.video.Vp8Codec;
import com.twilio.video.OpusCodec;

import java.io.ByteArrayOutputStream;
import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.concurrent.CompletableFuture;

public class ARView extends LinearLayout implements ModelLoader.ModelLoaderCallbacks, OnBitmapCapture {
    /*
     * Android shared preferences used for settings
     */
    private SharedPreferences preferences;
    private AudioManager audioManager;
    private int previousAudioMode;
    private boolean previousMicrophoneMute;
    /*
     * AudioCodec and VideoCodec represent the preferred codec for encoding and decoding audio and
     * video.
     */
    private AudioCodec audioCodec;
    private VideoCodec videoCodec;
    private String accessToken;
    /*
     * A Room represents communication between a local participant and one or more participants.
     */
    private Room room;
    private LocalParticipant localParticipant;
    private boolean disconnectedFromOnDestroy;
    private String remoteParticipantIdentity;
    private LocalVideoTrack localVideoTrack;
    private LocalAudioTrack localAudioTrack;

    private static final String LOCAL_AUDIO_TRACK_NAME = "mic";
    private static final String LOCAL_VIDEO_TRACK_NAME = "camera__ar";
    public static final int CAMERA_MIC_PERMISSION_REQUEST_CODE = 1;
    private static final String TAG = "VideoActivity";

    /*
     * Encoding parameters represent the sender side bandwidth constraints.
     */
    private EncodingParameters encodingParameters;
    public static ARView arView;
    public static boolean IS_ARCORE_VIEW = false;
    private CameraCapturerCompat cameraCapturerCompat;
    private ViewCapturer viewCapturer;

    private Context mContext;

    private static final double MIN_OPENGL_VERSION = 3.0;

    private WritingArFragment arFragment;
    private ModelRenderable andyRenderable;
    // Model loader class to avoid leaking the activity context.
    private ModelLoader modelLoader;
    private Color nodeColor = null;
    TransformableNode selectedNode = null;
    MainActivity mainActivity;
    private ToolBean circleToolBean, arrowToolBean;
    private int currentToolId = -1;
    List<Node> removedAnchors = new ArrayList<>();

    public ARView(Context context) {
        super(context);
        init(context);
    }

    public void sufaceObject() {
        Toast.makeText(mContext, "Hello in ARView", Toast.LENGTH_SHORT).show();
    }

    public void changeObjectModel(String name) {
        if (modelLoader != null) {
            if (name.equalsIgnoreCase("circle")) {
                currentToolId = ToolBean.TOOL_CIRCLE;
                modelLoader.loadModel(mContext, R.raw.circle);
            } else if (name.equalsIgnoreCase("arrow")) {
                currentToolId = ToolBean.TOOL_ARROW;
                modelLoader.loadModel(mContext, R.raw.arrow);
            } else {
                currentToolId = ToolBean.TOOL_NONE;
                andyRenderable = null;
            }
        }
    }

    public void setMinMaxScale(String tool, float min, float max) {
        if (min >= max || tool == null) {
            Utill.showToast(mContext, "Invalid parameter");
            return;
        }
        if (tool.equalsIgnoreCase("circle")) {
            circleToolBean.setMinScale(min);
            circleToolBean.setMaxScale(max);
        } else if (tool.equalsIgnoreCase("arrow")) {
            arrowToolBean.setMinScale(min);
            arrowToolBean.setMaxScale(max);
        }
    }

    public void undoAnchor() {
        List<Node> nodeList = arFragment.getArSceneView().getScene().getChildren();
        boolean shouldStop = false;
        for (int i=nodeList.size()-1; i>=0; i--) {
            Node node = nodeList.get(i);
            if (node instanceof AnchorNode) {
                List<Node> list = node.getChildren();
                if(list.size()>0)
                for (int j=list.size()-1; j>=0; j--) {
                    Node innderNode = list.get(j);
                    if (innderNode instanceof TransformableNode) {
                        arFragment.getArSceneView().getScene().removeChild(node);
                        removedAnchors.add(node);
                        shouldStop = true;
                        break;
                    }
                }
                if(shouldStop){
                    break;
                }
            }
        }
    }

    public void redoAnchor() {
        if(removedAnchors.size()>=1) {
            Node node = removedAnchors.get(removedAnchors.size()-1);
            arFragment.getArSceneView().getScene().addChild(node);
            removedAnchors.remove(node);
        } else{
            Utill.showToast(getContext(),"No redo");
        }
    }

    private void sendCordinates(MotionEvent motionEvent, Integer maxX, Integer maxY) {
        WritableMap params = Arguments.createMap();
        params.putDouble("x", motionEvent.getRawX());
        params.putDouble("y", motionEvent.getRawY());
        params.putDouble("maxX", (double)maxX);
        params.putDouble("maxY", (double)maxY);

        mainActivity.mReactInstanceManager.getCurrentReactContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("onTapCords", params);
    }

    private void resetTool() {
        WritableMap params = Arguments.createMap();
        // add here the data you want to send
        mainActivity.mReactInstanceManager.getCurrentReactContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("reset_tool", params);
        andyRenderable = null;
    }

    public void toggleMute(boolean isMute) {
        if (audioManager != null)
            audioManager.setMicrophoneMute(isMute);
    }

    public void videoCapture() {
        if(IS_ARCORE_VIEW){
            String encImage = encodeImage(viewCapturer.getLastFrame());
            mainActivity.mReactInstanceManager.getCurrentReactContext()
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("onScreenshot", encImage);
        }else{
            captureCollaboratorView();
        }
    }

    private void captureCollaboratorView() {
        Bitmap viewBitmap = Bitmap.createBitmap(primaryVideoView.getWidth(), primaryVideoView.getHeight(),
                Bitmap.Config.ARGB_8888);
        // Create a handler thread to offload the processing of the image.
        final HandlerThread handlerThread = new HandlerThread("PixelCopier");
        handlerThread.start();
        SurfaceView sv= primaryVideoView;
        // Make the request to copy.
        PixelCopy.request(sv, viewBitmap, (copyResult) -> {

            if (copyResult == PixelCopy.SUCCESS) {

                int bytes = viewBitmap.getByteCount();
                ByteBuffer buffer = ByteBuffer.allocate(bytes);
                viewBitmap.copyPixelsToBuffer(buffer);
                onGetBitmap(viewBitmap);
            }
            handlerThread.quitSafely();
        }, new Handler(handlerThread.getLooper()));
        //this could be used if their is a requirnment to capture collaborators own view.
        //cameraCapturerCompat.takeScreenShot();
    }

    private String encodeImage(Bitmap bm) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        bm.compress(Bitmap.CompressFormat.PNG,100,baos);
        byte[] b = baos.toByteArray();
        String encImage = Base64.encodeToString(b, Base64.DEFAULT);

        return encImage;
    }

    private void onDisconnected() {
        ReactContext rc = (ReactContext) mContext;

        rc.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("onSessionDisconnect", null);
    }

    public void joinRoom(String role, String twilioId, String twilioToken) {
        //requestPermissionForCameraAndMicrophone();

        preferences = PreferenceManager.getDefaultSharedPreferences(mContext);
        this.accessToken = twilioToken;
        audioCodec = getAudioCodecPreference();
        videoCodec = getVideoCodecPreference();

        RelativeLayout rl;
        if(role.equalsIgnoreCase("collaborator")){
            IS_ARCORE_VIEW = false;
            inflate(this.mContext, R.layout.twilio_video, this);
            primaryVideoView = findViewById(R.id.primary_video_view);
            rl = findViewById(R.id.rl);
            configureVideo();
            rl.setOnTouchListener(new OnTouchListener() {
                @Override
                public boolean onTouch(View view, MotionEvent motionEvent) {
                    switch (motionEvent.getAction()){
                        case MotionEvent.ACTION_UP:
                            sendCordinates(motionEvent, rl.getWidth(), rl.getHeight());
                            break;
                        case MotionEvent.ACTION_DOWN:
                            return true;
                    }
                    return false;
                }
            });
        } else {
            IS_ARCORE_VIEW = true;
            inflate(mainActivity, R.layout.ar_core, this);
            primaryVideoView = findViewById(R.id.primary_video_view);
            rl = findViewById(R.id.rl);
            initARCore();
            configureVideo();
        }
        connectToRoom(twilioId);


        rl.setFocusableInTouchMode(true);
        rl.requestFocus();
        rl.setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View v, int keyCode, KeyEvent event) {

                if (event.getAction() == KeyEvent.ACTION_UP && keyCode == KeyEvent.KEYCODE_BACK) {

                    android.support.v4.app.FragmentManager f = mainActivity.getSupportFragmentManager();
                    Fragment fragment = f.findFragmentById(R.id.ux_fragment);
                    if (fragment != null) {
                        arFragment.getArSceneView().pause();
                        //arFragment.getArSceneView().destroy();
                        mainActivity.getSupportFragmentManager().beginTransaction().remove(fragment).commit();
                        primaryVideoView.release();
                    }

                    onDestroy();
                    ARView.arView = null;
                    onDisconnected();

                    return true;
                } else {
                    return true;
                }
            }
        });

    }

    public ARView(Context context, AttributeSet attrs, int defStyleAttr, int defStyleRes) {
        super(context, attrs, defStyleAttr, defStyleRes);
        init(context);
    }

    private void init(Context context) {
        this.mContext = context;
        this.mainActivity = (MainActivity) ((ThemedReactContext) mContext).getCurrentActivity();
        this.circleToolBean = new ToolBean(ToolBean.TOOL_CIRCLE);
        this.arrowToolBean = new ToolBean(ToolBean.TOOL_ARROW);
        nodeColor = new Color(0, 210, 255);
        arView = this;
    }

    private VideoView primaryVideoView;

    public void placeObj(Float x, Float y) {
        RelativeLayout rl = findViewById(R.id.rl);

        Frame frame = arFragment.getArSceneView().getArFrame();
        List<HitResult> hrs = frame.hitTest(x * rl.getWidth(), y * rl.getHeight());

        if (hrs.size() > 0) {
            placeObj(hrs.get(0));
        }  
    }

    public void placeObj(HitResult hitResult) {
            if (andyRenderable == null) {
                Utill.showToast(mContext, "Please select an object tool");
                return;
            }
            // Create the Anchor.
            Anchor anchor = hitResult.createAnchor();
            AnchorNode anchorNode = new AnchorNode(anchor);
            anchorNode.setParent(arFragment.getArSceneView().getScene());

            // Create the transformable andy and add it to the anchor.
            TransformableNode andy = new TransformableNode(arFragment.getTransformationSystem());
            // Here we are setting the default scale to the Model
            andy.setWorldScale(new Vector3(0.1f, 0.1f, 0.1f));
            andy.setLocalRotation(Quaternion.axisAngle(new Vector3(0, 1f, 0), 90f));
            if (currentToolId == ToolBean.TOOL_CIRCLE) {
                andy.getScaleController().setMinScale(circleToolBean.getMinScale());
                andy.getScaleController().setMaxScale(circleToolBean.getMaxScale());
            } else if (currentToolId == ToolBean.TOOL_ARROW) {
                andy.getScaleController().setMinScale(arrowToolBean.getMinScale());
                andy.getScaleController().setMaxScale(arrowToolBean.getMaxScale());
            }
            andy.setParent(anchorNode);
            andy.setRenderable(andyRenderable);
            setColorToNode(andy);
            andy.select();
            selectedNode = andy;
            resetTool();
    }


    private void initARCore() {
        if (!checkIsSupportedDeviceOrFinish(mainActivity)) {
            return;
        }
        arFragment = (WritingArFragment) mainActivity.getSupportFragmentManager().findFragmentById(R.id.ux_fragment);
        modelLoader = new ModelLoader(this);

        arFragment.setOnTapArPlaneListener(
                (HitResult hitResult, Plane plane, MotionEvent motionEvent) -> {
                    if (andyRenderable == null) {
                        Utill.showToast(mContext, "Please select an object tool");
                        return;
                    }
                    // Create the Anchor.
                    Anchor anchor = hitResult.createAnchor();
                    AnchorNode anchorNode = new AnchorNode(anchor);
                    anchorNode.setParent(arFragment.getArSceneView().getScene());

                    // Create the transformable andy and add it to the anchor.
                    TransformableNode andy = new TransformableNode(arFragment.getTransformationSystem());
                    // Here we are setting the default scale to the Model
                    andy.setWorldScale(new Vector3(0.1f, 0.1f, 0.1f));
                    andy.setLocalRotation(Quaternion.axisAngle(new Vector3(0, 1f, 0), 90f));
                    if (currentToolId == ToolBean.TOOL_CIRCLE) {
                        andy.getScaleController().setMinScale(circleToolBean.getMinScale());
                        andy.getScaleController().setMaxScale(circleToolBean.getMaxScale());
                    } else if (currentToolId == ToolBean.TOOL_ARROW) {
                        andy.getScaleController().setMinScale(arrowToolBean.getMinScale());
                        andy.getScaleController().setMaxScale(arrowToolBean.getMaxScale());
                    }
                    andy.setParent(anchorNode);
                    andy.setRenderable(andyRenderable);
                    setColorToNode(andy);
                    andy.select();
                    selectedNode = andy;
                    resetTool();
                });
    }


    TransformableNode getSelectedNode() {
        return selectedNode;
    }

    public void changeDefaultColor(int r, int g, int b) {
        if (nodeColor != null)
            nodeColor.set(r, g, b);
        else
            nodeColor = new Color(r, g, b);
    }

    public void changeDefaultColor(String hexColor) {
        if (nodeColor != null)
            nodeColor.set(android.graphics.Color.parseColor(hexColor));
        else
            nodeColor = new Color(android.graphics.Color.parseColor(hexColor));
    }

    public void setColorToNode(TransformableNode andy) {
        if (andy == null) {
            Toast.makeText(mContext, "No node selected", Toast.LENGTH_SHORT).show();
        }
        CompletableFuture<Material> materialCompletableFuture =
                MaterialFactory.makeOpaqueWithColor(mContext, nodeColor);
        materialCompletableFuture.thenAccept(material -> {
            Renderable r2 = andy.getRenderable().makeCopy();
            r2.setMaterial(material);
            andy.setRenderable(r2);
        });
    }

    // This method could be used for the change color for the selected node.
    public void onChangeColor() {
        TransformableNode andy = getSelectedNode();
        if (andy == null) {
            Toast.makeText(mContext, "No node selected", Toast.LENGTH_SHORT).show();
        }
        CompletableFuture<Material> materialCompletableFuture =
                MaterialFactory.makeOpaqueWithColor(mContext, getRandomColor());

        materialCompletableFuture.thenAccept(material -> {
            Renderable r2 = andy.getRenderable().makeCopy();
            r2.setMaterial(material);
            andy.setRenderable(r2);
        });
    }

    Color getRandomColor() {
        Random rnd = new Random();
        int no = rnd.nextInt(4);
        switch (no) {
            case 1:
                return new Color(255, 0, 0);
            case 2:
                return new Color(0, 255, 0);
            case 3:
                return new Color(0, 0, 255);
            case 4:
                return new Color(255, 0, 255);
            default:
                return new Color(0, 0, 0);
        }
    }

    private void configureVideo() {
        /*
         * Get shared preferences to read settings
         */
        preferences = PreferenceManager.getDefaultSharedPreferences(mContext);

        /*
         * Enable changing the volume using the up/down keys during a conversation
         */
        mainActivity.setVolumeControlStream(AudioManager.STREAM_VOICE_CALL);

        /*
         * Needed for setting/abandoning audio focus during call
         */
        audioManager = (AudioManager) mContext.getSystemService(Context.AUDIO_SERVICE);
        audioManager.setSpeakerphoneOn(true);

        /*
         * Check camera and microphone permissions. Needed in Android M.
         */
        if (!checkPermissionForCameraAndMicrophone()) {
            requestPermissionForCameraAndMicrophone();
        } else {
            createAudioAndVideoTracks();
        }

        /*
         * Set the initial state of the UI
         */
    }

    @Override
    public void setRenderable(ModelRenderable modelRenderable) {
        andyRenderable = modelRenderable;
    }

    @Override
    public void onLoadException(Throwable throwable) {
        Toast toast = Toast.makeText(getContext(), "Unable to load andy renderable", Toast.LENGTH_LONG);
        toast.setGravity(Gravity.CENTER, 0, 0);
        toast.show();
        Log.e(TAG, "Unable to load andy renderable", throwable);
    }


    public void onRequestPermissionsResult(int requestCode,
                                           @NonNull String[] permissions,
                                           @NonNull int[] grantResults) {
        if (requestCode == CAMERA_MIC_PERMISSION_REQUEST_CODE) {
            boolean cameraAndMicPermissionGranted = true;

            for (int grantResult : grantResults) {
                cameraAndMicPermissionGranted &= grantResult == PackageManager.PERMISSION_GRANTED;
            }

            if (cameraAndMicPermissionGranted && checkPermissionForCameraAndMicrophone()) {
                createAudioAndVideoTracks();
            } else {
                showToast("Permission needed");
            }
        }
    }

    protected void onResume() {

        try {
            /*
             * Update preferred audio and video codec in case changed in settings
             */
            audioCodec = getAudioCodecPreference();
            videoCodec = getVideoCodecPreference();

            /*
             * Get latest encoding parameters
             */
            final EncodingParameters newEncodingParameters = getEncodingParameters();

            /*
             * If the local video track was released when the app was put in the background, recreate.
             */
            if (localVideoTrack == null && checkPermissionForCameraAndMicrophone()) {

                if (IS_ARCORE_VIEW) {
                    viewCapturer = new ViewCapturer(arFragment.getArSceneView(), mainActivity);
                    localVideoTrack = LocalVideoTrack.create(mContext,
                            true,
                            viewCapturer,
                            LOCAL_VIDEO_TRACK_NAME);

                    localVideoTrack.addRenderer(primaryVideoView);
                } else {
                    localVideoTrack = LocalVideoTrack.create(mContext,
                            true,
                            cameraCapturerCompat.getVideoCapturer(),
                            LOCAL_VIDEO_TRACK_NAME);
                    localVideoTrack.addRenderer(primaryVideoView);
                }


                /*
                 * If connected to a Room then share the local video track.
                 */
                if (localParticipant != null) {
                    localParticipant.publishTrack(localVideoTrack);

                    /*
                     * Update encoding parameters if they have changed.
                     */
                    if (!newEncodingParameters.equals(encodingParameters)) {
                        localParticipant.setEncodingParameters(newEncodingParameters);
                    }
                }
            }

            /*
             * Update encoding parameters
             */
            encodingParameters = newEncodingParameters;
        } catch (Exception e) {
            System.out.println("Exeption " + e.getMessage());
        }

    }

    protected void onPause() {
        /*
         * Release the local video track before going in the background. This ensures that the
         * camera can be used by other applications while this app is in the background.
         */
        if (localVideoTrack != null) {
            /*
             * If this local video track is being shared in a Room, unpublish from room before
             * releasing the video track. Participants will be notified that the track has been
             * unpublished.
             */
            if (localParticipant != null) {
                localParticipant.unpublishTrack(localVideoTrack);
            }

            localVideoTrack.release();
            localVideoTrack = null;
        }
    }

    protected void onDestroy() {

        /*
         * Always disconnect from the room before leaving the Activity to
         * ensure any memory allocated to the Room resource is freed.
         */
        if (room != null && room.getState() != Room.State.DISCONNECTED) {
            room.disconnect();
            disconnectedFromOnDestroy = true;
        }

        /*
         * Release the local audio and video tracks ensuring any memory allocated to audio
         * or video is freed.
         */
        if (localAudioTrack != null) {
            //localAudioTrack.release();
            localAudioTrack = null;
        }
        if (localVideoTrack != null) {
            // localVideoTrack.release();
            localVideoTrack = null;
        }

    }

    private boolean checkPermissionForCameraAndMicrophone() {
        int resultCamera = ContextCompat.checkSelfPermission(mContext, Manifest.permission.CAMERA);
        int resultMic = ContextCompat.checkSelfPermission(mContext, Manifest.permission.RECORD_AUDIO);
        return resultCamera == PackageManager.PERMISSION_GRANTED &&
                resultMic == PackageManager.PERMISSION_GRANTED;
    }

    private void requestPermissionForCameraAndMicrophone() {
        if (ActivityCompat.shouldShowRequestPermissionRationale(mainActivity, Manifest.permission.CAMERA) &&
                ActivityCompat.shouldShowRequestPermissionRationale(mainActivity,
                        Manifest.permission.RECORD_AUDIO)) {
            //showToast("Permission granted");
        } else {
            ActivityCompat.requestPermissions(
                    mainActivity,
                    new String[]{Manifest.permission.RECORD_AUDIO, Manifest.permission.CAMERA},
                    CAMERA_MIC_PERMISSION_REQUEST_CODE);
        }
    }

    private void createAudioAndVideoTracks() {
        // Share your microphone
        localAudioTrack = LocalAudioTrack.create(mContext, true, LOCAL_AUDIO_TRACK_NAME);

        // Share your camera
        if (IS_ARCORE_VIEW) {
            viewCapturer = new ViewCapturer(this.arFragment.getArSceneView(), mainActivity);
            localVideoTrack = LocalVideoTrack.create(mContext,
                    true,
                    viewCapturer,
                    LOCAL_VIDEO_TRACK_NAME);

            localVideoTrack.addRenderer(primaryVideoView);
        } else {
            cameraCapturerCompat = new CameraCapturerCompat(mContext, getAvailableCameraSource(),this);
            localVideoTrack = LocalVideoTrack.create(mContext,
                    true,
                    cameraCapturerCompat.getVideoCapturer(),
                    LOCAL_VIDEO_TRACK_NAME);
            localVideoTrack.addRenderer(primaryVideoView);
        }

    }

    private CameraCapturer.CameraSource getAvailableCameraSource() {
        return (CameraCapturer.isSourceAvailable(CameraCapturer.CameraSource.FRONT_CAMERA)) ?
                (CameraCapturer.CameraSource.BACK_CAMERA) :
                (CameraCapturer.CameraSource.FRONT_CAMERA);
    }


    private void connectToRoom(String roomName) {
//        configureAudio(true);
        ConnectOptions.Builder connectOptionsBuilder = new ConnectOptions.Builder(accessToken)
                .roomName(roomName);

        /*
         * Add local audio track to connect options to share with participants.
         */
//        if (localAudioTrack != null) {
//            connectOptionsBuilder
//                    .audioTracks(Collections.singletonList(localAudioTrack));
//        }

        /*
         * Add local video track to connect options to share with participants.
         */
        if (localVideoTrack != null) {
            connectOptionsBuilder.videoTracks(Collections.singletonList(localVideoTrack));
        }

        /*
         * Set the preferred audio and video codec for media.
         */
        connectOptionsBuilder.preferAudioCodecs(Collections.singletonList(audioCodec));
        connectOptionsBuilder.preferVideoCodecs(Collections.singletonList(videoCodec));

        /*
         * Set the sender side encoding parameters.
         */
        connectOptionsBuilder.encodingParameters(encodingParameters);

        room = Video.connect(mContext, connectOptionsBuilder.build(), roomListener());
    }


    /*
     * Get the preferred audio codec from shared preferences
     */
    private AudioCodec getAudioCodecPreference() {
        return new OpusCodec();
    }

    /*
     * Get the preferred video codec from shared preferences
     */
    private VideoCodec getVideoCodecPreference() {
        return new Vp8Codec();
    }

    private EncodingParameters getEncodingParameters() {
        final int maxAudioBitrate = 128000; //128Kbps
        final int maxVideoBitrate = 2000000; //2Mbps

        return new EncodingParameters(maxAudioBitrate, maxVideoBitrate);
    }

    /*
     * Called when remote participant joins the room
     */
    private void addRemoteParticipant(RemoteParticipant remoteParticipant) {

        remoteParticipantIdentity = remoteParticipant.getIdentity();
        showToast("RemoteParticipant " + remoteParticipantIdentity + " joined");

        /*
         * Add remote participant renderer
         */
        if (remoteParticipant.getRemoteVideoTracks().size() > 0) {
            RemoteVideoTrackPublication remoteVideoTrackPublication =
                    remoteParticipant.getRemoteVideoTracks().get(0);

            /*
             * Only render video tracks that are subscribed to
             */
            if (remoteVideoTrackPublication.isTrackSubscribed()) {
                addRemoteParticipantVideo(remoteVideoTrackPublication.getRemoteVideoTrack());
            }
        }

        /*
         * Start listening for participant events
         */
        remoteParticipant.setListener(remoteParticipantListener());
    }

    /*
     * Set primary view as renderer for participant video track
     */
    private void addRemoteParticipantVideo(VideoTrack videoTrack) {
        primaryVideoView.setMirror(false);

        if (localVideoTrack != null) {
            localVideoTrack.removeRenderer(primaryVideoView);
        }

        videoTrack.addRenderer(primaryVideoView);
    }


    /*
     * Called when remote participant leaves the room
     */
    private void removeRemoteParticipant(RemoteParticipant remoteParticipant) {
        showToast("RemoteParticipant " + remoteParticipant.getIdentity() +
                " left.");
        if (!remoteParticipant.getIdentity().equals(remoteParticipantIdentity)) {
            return;
        }

        /*
         * Remove remote participant renderer
         */
        if (!remoteParticipant.getRemoteVideoTracks().isEmpty()) {
            RemoteVideoTrackPublication remoteVideoTrackPublication =
                    remoteParticipant.getRemoteVideoTracks().get(0);

            /*
             * Remove video only if subscribed to participant track
             */
            if (remoteVideoTrackPublication.isTrackSubscribed()) {
                removeParticipantVideo(remoteVideoTrackPublication.getRemoteVideoTrack());
            }
        }
        moveLocalVideoToPrimaryView();
    }

    private void removeParticipantVideo(VideoTrack videoTrack) {
        videoTrack.removeRenderer(primaryVideoView);
    }

    private void moveLocalVideoToPrimaryView() {
        if (localVideoTrack != null) {
            localVideoTrack.addRenderer(primaryVideoView);
        }
    }

    /*
     * Room events listener
     */
    private Room.Listener roomListener() {
        return new Room.Listener() {
            @Override
            public void onConnected(Room room) {
                localParticipant = room.getLocalParticipant();
                showToast("Connected to " + room.getName());

                for (RemoteParticipant remoteParticipant : room.getRemoteParticipants()) {
                    addRemoteParticipant(remoteParticipant);
                    break;
                }

            }

            @Override
            public void onConnectFailure(Room room, TwilioException e) {
                showToast("Failed to connect");
                Log.e("TeamworkAR", "Exception:", e);
                configureAudio(false);
            }

            @Override
            public void onDisconnected(Room _room, TwilioException e) {
                localParticipant = null;
                ARView.this.room = null;
                // Only reinitialize the UI if disconnect was not called from onDestroy()
                if (!disconnectedFromOnDestroy) {
                    configureAudio(false);
                    moveLocalVideoToPrimaryView();
                }

                showToast("Disconnected from " + _room.getName());
            }

            @Override
            public void onReconnecting(@NonNull Room room, @NonNull TwilioException twilioException) {

            }

            @Override
            public void onReconnected(@NonNull Room room) {

            }

            @Override
            public void onParticipantConnected(Room room, RemoteParticipant remoteParticipant) {
                addRemoteParticipant(remoteParticipant);
            }

            @Override
            public void onParticipantDisconnected(Room room, RemoteParticipant remoteParticipant) {
                removeRemoteParticipant(remoteParticipant);
            }

            @Override
            public void onRecordingStarted(Room room) {
                /*
                 * Indicates when media shared to a Room is being recorded. Note that
                 * recording is only available in our Group Rooms developer preview.
                 */
                Log.d(TAG, "onRecordingStarted");
            }

            @Override
            public void onRecordingStopped(Room room) {
                /*
                 * Indicates when media shared to a Room is no longer being recorded. Note that
                 * recording is only available in our Group Rooms developer preview.
                 */
                Log.d(TAG, "onRecordingStopped");
            }
        };
    }

    private RemoteParticipant.Listener remoteParticipantListener() {
        return new RemoteParticipant.Listener() {
            @Override
            public void onAudioTrackPublished(RemoteParticipant remoteParticipant,
                                              RemoteAudioTrackPublication remoteAudioTrackPublication) {
                Log.i(TAG, String.format("onAudioTrackPublished: " +
                                "[RemoteParticipant: identity=%s], " +
                                "[RemoteAudioTrackPublication: sid=%s, enabled=%b, " +
                                "subscribed=%b, name=%s]",
                        remoteParticipant.getIdentity(),
                        remoteAudioTrackPublication.getTrackSid(),
                        remoteAudioTrackPublication.isTrackEnabled(),
                        remoteAudioTrackPublication.isTrackSubscribed(),
                        remoteAudioTrackPublication.getTrackName()));
                showToast("onAudioTrackPublished");

            }

            @Override
            public void onAudioTrackUnpublished(RemoteParticipant remoteParticipant,
                                                RemoteAudioTrackPublication remoteAudioTrackPublication) {
                Log.i(TAG, String.format("onAudioTrackUnpublished: " +
                                "[RemoteParticipant: identity=%s], " +
                                "[RemoteAudioTrackPublication: sid=%s, enabled=%b, " +
                                "subscribed=%b, name=%s]",
                        remoteParticipant.getIdentity(),
                        remoteAudioTrackPublication.getTrackSid(),
                        remoteAudioTrackPublication.isTrackEnabled(),
                        remoteAudioTrackPublication.isTrackSubscribed(),
                        remoteAudioTrackPublication.getTrackName()));
                showToast("onAudioTrackUnpublished");

            }

            @Override
            public void onDataTrackPublished(RemoteParticipant remoteParticipant,
                                             RemoteDataTrackPublication remoteDataTrackPublication) {
                Log.i(TAG, String.format("onDataTrackPublished: " +
                                "[RemoteParticipant: identity=%s], " +
                                "[RemoteDataTrackPublication: sid=%s, enabled=%b, " +
                                "subscribed=%b, name=%s]",
                        remoteParticipant.getIdentity(),
                        remoteDataTrackPublication.getTrackSid(),
                        remoteDataTrackPublication.isTrackEnabled(),
                        remoteDataTrackPublication.isTrackSubscribed(),
                        remoteDataTrackPublication.getTrackName()));
                showToast("onDataTrackPublished");

            }

            @Override
            public void onDataTrackUnpublished(RemoteParticipant remoteParticipant,
                                               RemoteDataTrackPublication remoteDataTrackPublication) {
                Log.i(TAG, String.format("onDataTrackUnpublished: " +
                                "[RemoteParticipant: identity=%s], " +
                                "[RemoteDataTrackPublication: sid=%s, enabled=%b, " +
                                "subscribed=%b, name=%s]",
                        remoteParticipant.getIdentity(),
                        remoteDataTrackPublication.getTrackSid(),
                        remoteDataTrackPublication.isTrackEnabled(),
                        remoteDataTrackPublication.isTrackSubscribed(),
                        remoteDataTrackPublication.getTrackName()));
                showToast("onDataTrackUnpublished");

            }

            @Override
            public void onVideoTrackPublished(RemoteParticipant remoteParticipant,
                                              RemoteVideoTrackPublication remoteVideoTrackPublication) {
                Log.i(TAG, String.format("onVideoTrackPublished: " +
                                "[RemoteParticipant: identity=%s], " +
                                "[RemoteVideoTrackPublication: sid=%s, enabled=%b, " +
                                "subscribed=%b, name=%s]",
                        remoteParticipant.getIdentity(),
                        remoteVideoTrackPublication.getTrackSid(),
                        remoteVideoTrackPublication.isTrackEnabled(),
                        remoteVideoTrackPublication.isTrackSubscribed(),
                        remoteVideoTrackPublication.getTrackName()));
                showToast("onVideoTrackPublished");

            }

            @Override
            public void onVideoTrackUnpublished(RemoteParticipant remoteParticipant,
                                                RemoteVideoTrackPublication remoteVideoTrackPublication) {
                Log.i(TAG, String.format("onVideoTrackUnpublished: " +
                                "[RemoteParticipant: identity=%s], " +
                                "[RemoteVideoTrackPublication: sid=%s, enabled=%b, " +
                                "subscribed=%b, name=%s]",
                        remoteParticipant.getIdentity(),
                        remoteVideoTrackPublication.getTrackSid(),
                        remoteVideoTrackPublication.isTrackEnabled(),
                        remoteVideoTrackPublication.isTrackSubscribed(),
                        remoteVideoTrackPublication.getTrackName()));
                showToast("onVideoTrackUnpublished");

            }

            @Override
            public void onAudioTrackSubscribed(RemoteParticipant remoteParticipant,
                                               RemoteAudioTrackPublication remoteAudioTrackPublication,
                                               RemoteAudioTrack remoteAudioTrack) {
                Log.i(TAG, String.format("onAudioTrackSubscribed: " +
                                "[RemoteParticipant: identity=%s], " +
                                "[RemoteAudioTrack: enabled=%b, playbackEnabled=%b, name=%s]",
                        remoteParticipant.getIdentity(),
                        remoteAudioTrack.isEnabled(),
                        remoteAudioTrack.isPlaybackEnabled(),
                        remoteAudioTrack.getName()));
                showToast("onAudioTrackSubscribed");

            }

            @Override
            public void onAudioTrackUnsubscribed(RemoteParticipant remoteParticipant,
                                                 RemoteAudioTrackPublication remoteAudioTrackPublication,
                                                 RemoteAudioTrack remoteAudioTrack) {
                Log.i(TAG, String.format("onAudioTrackUnsubscribed: " +
                                "[RemoteParticipant: identity=%s], " +
                                "[RemoteAudioTrack: enabled=%b, playbackEnabled=%b, name=%s]",
                        remoteParticipant.getIdentity(),
                        remoteAudioTrack.isEnabled(),
                        remoteAudioTrack.isPlaybackEnabled(),
                        remoteAudioTrack.getName()));
                showToast("onAudioTrackUnsubscribed");

            }

            @Override
            public void onAudioTrackSubscriptionFailed(RemoteParticipant remoteParticipant,
                                                       RemoteAudioTrackPublication remoteAudioTrackPublication,
                                                       TwilioException twilioException) {
                Log.i(TAG, String.format("onAudioTrackSubscriptionFailed: " +
                                "[RemoteParticipant: identity=%s], " +
                                "[RemoteAudioTrackPublication: sid=%b, name=%s]" +
                                "[TwilioException: code=%d, message=%s]",
                        remoteParticipant.getIdentity(),
                        remoteAudioTrackPublication.getTrackSid(),
                        remoteAudioTrackPublication.getTrackName(),
                        twilioException.getCode(),
                        twilioException.getMessage()));
                showToast("onAudioTrackSubscriptionFailed");

            }

            @Override
            public void onDataTrackSubscribed(RemoteParticipant remoteParticipant,
                                              RemoteDataTrackPublication remoteDataTrackPublication,
                                              RemoteDataTrack remoteDataTrack) {
                Log.i(TAG, String.format("onDataTrackSubscribed: " +
                                "[RemoteParticipant: identity=%s], " +
                                "[RemoteDataTrack: enabled=%b, name=%s]",
                        remoteParticipant.getIdentity(),
                        remoteDataTrack.isEnabled(),
                        remoteDataTrack.getName()));
                showToast("onDataTrackSubscribed");

            }

            @Override
            public void onDataTrackUnsubscribed(RemoteParticipant remoteParticipant,
                                                RemoteDataTrackPublication remoteDataTrackPublication,
                                                RemoteDataTrack remoteDataTrack) {
                Log.i(TAG, String.format("onDataTrackUnsubscribed: " +
                                "[RemoteParticipant: identity=%s], " +
                                "[RemoteDataTrack: enabled=%b, name=%s]",
                        remoteParticipant.getIdentity(),
                        remoteDataTrack.isEnabled(),
                        remoteDataTrack.getName()));
                showToast("onDataTrackUnsubscribed");

            }

            @Override
            public void onDataTrackSubscriptionFailed(RemoteParticipant remoteParticipant,
                                                      RemoteDataTrackPublication remoteDataTrackPublication,
                                                      TwilioException twilioException) {
                Log.i(TAG, String.format("onDataTrackSubscriptionFailed: " +
                                "[RemoteParticipant: identity=%s], " +
                                "[RemoteDataTrackPublication: sid=%b, name=%s]" +
                                "[TwilioException: code=%d, message=%s]",
                        remoteParticipant.getIdentity(),
                        remoteDataTrackPublication.getTrackSid(),
                        remoteDataTrackPublication.getTrackName(),
                        twilioException.getCode(),
                        twilioException.getMessage()));
                showToast("onDataTrackSubscriptionFailed");

            }

            @Override
            public void onVideoTrackSubscribed(RemoteParticipant remoteParticipant,
                                               RemoteVideoTrackPublication remoteVideoTrackPublication,
                                               RemoteVideoTrack remoteVideoTrack) {
                Log.i(TAG, String.format("onVideoTrackSubscribed: " +
                                "[RemoteParticipant: identity=%s], " +
                                "[RemoteVideoTrack: enabled=%b, name=%s]",
                        remoteParticipant.getIdentity(),
                        remoteVideoTrack.isEnabled(),
                        remoteVideoTrack.getName()));
                showToast("onVideoTrackSubscribed");

                addRemoteParticipantVideo(remoteVideoTrack);
            }

            @Override
            public void onVideoTrackUnsubscribed(RemoteParticipant remoteParticipant,
                                                 RemoteVideoTrackPublication remoteVideoTrackPublication,
                                                 RemoteVideoTrack remoteVideoTrack) {
                Log.i(TAG, String.format("onVideoTrackUnsubscribed: " +
                                "[RemoteParticipant: identity=%s], " +
                                "[RemoteVideoTrack: enabled=%b, name=%s]",
                        remoteParticipant.getIdentity(),
                        remoteVideoTrack.isEnabled(),
                        remoteVideoTrack.getName()));
                showToast("onVideoTrackUnsubscribed");
                removeParticipantVideo(remoteVideoTrack);
            }

            @Override
            public void onVideoTrackSubscriptionFailed(RemoteParticipant remoteParticipant,
                                                       RemoteVideoTrackPublication remoteVideoTrackPublication,
                                                       TwilioException twilioException) {
                Log.i(TAG, String.format("onVideoTrackSubscriptionFailed: " +
                                "[RemoteParticipant: identity=%s], " +
                                "[RemoteVideoTrackPublication: sid=%b, name=%s]" +
                                "[TwilioException: code=%d, message=%s]",
                        remoteParticipant.getIdentity(),
                        remoteVideoTrackPublication.getTrackSid(),
                        remoteVideoTrackPublication.getTrackName(),
                        twilioException.getCode(),
                        twilioException.getMessage()));
                showToast("onVideoTrackSubscriptionFailed");

            }

            @Override
            public void onAudioTrackEnabled(RemoteParticipant remoteParticipant,
                                            RemoteAudioTrackPublication remoteAudioTrackPublication) {

            }

            @Override
            public void onAudioTrackDisabled(RemoteParticipant remoteParticipant,
                                             RemoteAudioTrackPublication remoteAudioTrackPublication) {

            }

            @Override
            public void onVideoTrackEnabled(RemoteParticipant remoteParticipant,
                                            RemoteVideoTrackPublication remoteVideoTrackPublication) {

            }

            @Override
            public void onVideoTrackDisabled(RemoteParticipant remoteParticipant,
                                             RemoteVideoTrackPublication remoteVideoTrackPublication) {

            }
        };
    }


    private void configureAudio(boolean enable) {
        if (enable) {
            previousAudioMode = audioManager.getMode();
            // Request audio focus before making any device switch
            requestAudioFocus();
            /*
             * Use MODE_IN_COMMUNICATION as the default audio mode. It is required
             * to be in this mode when playout and/or recording starts for the best
             * possible VoIP performance. Some devices have difficulties with
             * speaker mode if this is not set.
             */
            audioManager.setMode(AudioManager.MODE_IN_COMMUNICATION);
            /*
             * Always disable microphone mute during a WebRTC call.
             */
            previousMicrophoneMute = audioManager.isMicrophoneMute();
            audioManager.setMicrophoneMute(false);
        } else {
            audioManager.setMode(previousAudioMode);
            audioManager.abandonAudioFocus(null);
            audioManager.setMicrophoneMute(previousMicrophoneMute);
        }
        // TODO  remove auto muted, temporarily audio is muted because
        audioManager.setMicrophoneMute(true);
    }

    private void requestAudioFocus() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            AudioAttributes playbackAttributes = new AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_VOICE_COMMUNICATION)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                    .build();
            AudioFocusRequest focusRequest =
                    new AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN_TRANSIENT)
                            .setAudioAttributes(playbackAttributes)
                            .setAcceptsDelayedFocusGain(true)
                            .setOnAudioFocusChangeListener(
                                    i -> {
                                    })
                            .build();
            audioManager.requestAudioFocus(focusRequest);
        } else {
            audioManager.requestAudioFocus(null, AudioManager.STREAM_VOICE_CALL,
                    AudioManager.AUDIOFOCUS_GAIN_TRANSIENT);
        }
    }

    /**
     * Returns false and displays an error message if Sceneform can not run, true if Sceneform can run
     * on this device.
     *
     * <p>Sceneform requires Android N on the device as well as OpenGL 3.0 capabilities.
     *
     * <p>Finishes the activity if Sceneform can not run
     */
    public static boolean checkIsSupportedDeviceOrFinish(final Activity activity) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N) {
            Log.e(TAG, "Sceneform requires Android N or later");
            Toast.makeText(activity, "Sceneform requires Android N or later", Toast.LENGTH_LONG).show();
            activity.finish();
            return false;
        }
        String openGlVersionString =
                ((ActivityManager) activity.getSystemService(Context.ACTIVITY_SERVICE))
                        .getDeviceConfigurationInfo()
                        .getGlEsVersion();
        if (Double.parseDouble(openGlVersionString) < MIN_OPENGL_VERSION) {
            Log.e(TAG, "Sceneform requires OpenGL ES 3.0 later");
            Toast.makeText(activity, "Sceneform requires OpenGL ES 3.0 or later", Toast.LENGTH_LONG)
                    .show();
            activity.finish();
            return false;
        }
        return true;
    }

    private void showToast(String msg) {
        Toast.makeText(mContext, msg, Toast.LENGTH_LONG).show();
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
    }


    @Override
    public void onGetBitmap(Bitmap bitmap) {
        String encImage = encodeImage(bitmap);
        mainActivity.mReactInstanceManager.getCurrentReactContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("onScreenshot", encImage);
    }
}
