package com.cgs.teamworkar;

import android.app.Activity;
import android.graphics.Bitmap;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.Looper;
import android.os.SystemClock;
import android.view.PixelCopy;
import android.view.Surface;
import android.view.SurfaceView;
import android.view.View;
import android.widget.Toast;

import com.twilio.video.VideoCapturer;
import com.twilio.video.VideoDimensions;
import com.twilio.video.VideoFormat;
import com.twilio.video.VideoFrame;
import com.twilio.video.VideoPixelFormat;

import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * ViewCapturer demonstrates how to implement a custom {@link VideoCapturer}. This class
 * captures the contents of a provided view and signals the {@link VideoCapturer.Listener} when
 * the frame is available.
 */
public class ViewCapturer implements VideoCapturer {
    private static final int VIEW_CAPTURER_FRAMERATE_MS = 24;

    private final View view;
    private Activity mActivity;
    private Handler handler = new Handler(Looper.getMainLooper());
    private VideoCapturer.Listener videoCapturerListener;
    private AtomicBoolean started = new AtomicBoolean(false);
    public Bitmap lastFrame;
    private final Runnable viewCapturer = new Runnable() {
        @Override
        public void run() {
                boolean dropFrame = view.getWidth() == 0 || view.getHeight() == 0;
            SurfaceView surfaceView = (SurfaceView) view;

                if (!dropFrame && surfaceView.getHolder().getSurface().isValid()) {

                    Bitmap viewBitmap = Bitmap.createBitmap(view.getWidth(), view.getHeight(),
                        Bitmap.Config.ARGB_8888);
                    lastFrame = viewBitmap;

                    // Create a handler thread to offload the processing of the image.
                    final HandlerThread handlerThread = new HandlerThread("PixelCopier");
                    handlerThread.start();
                    // Make the request to copy.
                    PixelCopy.request((SurfaceView) view, viewBitmap, (copyResult) -> {

                        if ( copyResult == PixelCopy.SUCCESS) {

                            int bytes = viewBitmap.getByteCount();
                            ByteBuffer buffer = ByteBuffer.allocate(bytes);
                            viewBitmap.copyPixelsToBuffer(buffer);
                            byte[] array = buffer.array();
                            final long captureTimeNs =
                                    TimeUnit.MILLISECONDS.toNanos(SystemClock.elapsedRealtime());

                            // Create video frame
                            VideoDimensions dimensions = new VideoDimensions(view.getWidth(), view.getHeight());
                            VideoFrame videoFrame = new VideoFrame(array,
                                    dimensions, VideoFrame.RotationAngle.ROTATION_0, captureTimeNs);

                            // Notify the listener
                            if (started.get()) {
                                videoCapturerListener.onFrameCaptured(videoFrame);
                            }

                        } else {
                            Toast toast = Toast.makeText(mActivity,
                                    "Failed to copyPixels: " + copyResult, Toast.LENGTH_LONG);
                            toast.show();
                        }
                        handlerThread.quitSafely();
                    }, new Handler(handlerThread.getLooper()));

                    // Schedule the next capture
                    if (started.get()) {
                        handler.postDelayed(this, VIEW_CAPTURER_FRAMERATE_MS);
                    }

            } else {
                    Toast.makeText(mActivity, "handler stopped", Toast.LENGTH_LONG).show();
                    handler.removeCallbacks(viewCapturer);
                }


        }
    };

    public Bitmap getLastFrame() {
        return lastFrame;
    }

    public ViewCapturer(View view, Activity activity) {
        this.view = view;
        this.mActivity = activity;
    }

    public View getView() {
        return this.view;
    }

    /**
     * Returns the list of supported formats for this view capturer. Currently, only supports
     * capturing to RGBA_8888 bitmaps.
     *
     * @return list of supported formats.
     */
    @Override
    public List<VideoFormat> getSupportedFormats() {
        List<VideoFormat> videoFormats = new ArrayList<>();
        VideoDimensions videoDimensions = new VideoDimensions(view.getWidth(), view.getHeight());
        VideoFormat videoFormat = new VideoFormat(videoDimensions, 30, VideoPixelFormat.RGBA_8888);

        videoFormats.add(videoFormat);

        return videoFormats;
    }

    /**
     * Returns true because we are capturing screen content.
     */
    @Override
    public boolean isScreencast() {
        return true;
    }

    /**
     * This will be invoked when it is time to start capturing frames.
     *
     * @param videoFormat the video format of the frames to be captured.
     * @param listener capturer listener.
     */
    @Override
    public void startCapture(VideoFormat videoFormat, Listener listener) {
        // Store the capturer listener
        this.videoCapturerListener = listener;
        this.started.set(true);

        // Notify capturer API that the capturer has started
        boolean capturerStarted = handler.postDelayed(viewCapturer,
                VIEW_CAPTURER_FRAMERATE_MS);
        this.videoCapturerListener.onCapturerStarted(capturerStarted);
    }

    /**
     * Stop capturing frames. Note that the SDK cannot receive frames once this has been invoked.
     */
    @Override
    public void stopCapture() {

        this.started.set(false);
        handler.removeCallbacks(viewCapturer);
    }

}
