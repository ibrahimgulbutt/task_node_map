package com.nodemind.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.os.Build;
import android.os.CountDownTimer;
import android.os.IBinder;
import androidx.core.app.NotificationCompat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class FocusService extends Service {
    public static final String CHANNEL_ID = "FocusChannel";
    public static final String ACTION_START = "START";
    public static final String ACTION_PAUSE = "PAUSE";
    public static final String ACTION_RESUME = "RESUME";
    public static final String ACTION_STOP = "STOP";

    private CountDownTimer timer;
    private long remainingTimeInMillis = 0;
    private long totalTimeInMillis = 0;
    private long endTimeInMillis = 0;
    private boolean isRunning = false;
    private NotificationManager notificationManager;

    @Override
    public void onCreate() {
        super.onCreate();
        notificationManager = getSystemService(NotificationManager.class);
        createNotificationChannel();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null) {
            String action = intent.getAction();
            if (action != null) {
                switch (action) {
                    case ACTION_START:
                        long duration = intent.getLongExtra("duration", 0);
                        if (duration > 0) {
                             // If starting new, reset
                             if (!isRunning && remainingTimeInMillis == 0) {
                                 totalTimeInMillis = duration;
                                 remainingTimeInMillis = duration;
                             }
                        }
                        startTimer();
                        break;
                    case ACTION_PAUSE:
                        pauseTimer();
                        break;
                    case ACTION_RESUME:
                        resumeTimer();
                        break;
                    case ACTION_STOP:
                        stopService();
                        break;
                }
            }
        }
        return START_NOT_STICKY;
    }

    private void startTimer() {
        if (isRunning) return;
        
        endTimeInMillis = System.currentTimeMillis() + remainingTimeInMillis;
        startForegroundService();
        
        timer = new CountDownTimer(remainingTimeInMillis, 1000) {
            @Override
            public void onTick(long millisUntilFinished) {
                remainingTimeInMillis = millisUntilFinished;
                updateNotification();
            }

            @Override
            public void onFinish() {
                remainingTimeInMillis = 0;
                updateNotification();
                stopService();
            }
        }.start();
        
        isRunning = true;
        updateNotification();
    }

    private void pauseTimer() {
        if (timer != null) {
            timer.cancel();
        }
        isRunning = false;
        updateNotification();
    }

    private void resumeTimer() {
        startTimer();
    }

    private void stopService() {
        if (timer != null) {
            timer.cancel();
        }
        stopForeground(true);
        stopSelf();
    }

    private void startForegroundService() {
        Notification notification = buildNotification();
        try {
            if (Build.VERSION.SDK_INT >= 34) {
                startForeground(1, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE);
            } else if (Build.VERSION.SDK_INT >= 29) {
                startForeground(1, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_DATA_SYNC); 
            } else {
                startForeground(1, notification);
            }
        } catch (Exception e) {
            // Fallback or log
            e.printStackTrace();
        }
    }

    private void updateNotification() {
        notificationManager.notify(1, buildNotification());
    }

    private Notification buildNotification() {
        Intent notificationIntent = new Intent(this, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, notificationIntent, PendingIntent.FLAG_IMMUTABLE);

        Intent pauseIntent = new Intent(this, FocusService.class);
        pauseIntent.setAction(isRunning ? ACTION_PAUSE : ACTION_RESUME);
        PendingIntent pausePendingIntent = PendingIntent.getService(this, 1, pauseIntent, PendingIntent.FLAG_IMMUTABLE);

        Intent stopIntent = new Intent(this, FocusService.class);
        stopIntent.setAction(ACTION_STOP);
        PendingIntent stopPendingIntent = PendingIntent.getService(this, 2, stopIntent, PendingIntent.FLAG_IMMUTABLE);

        String title = "Focus Mode Active";
        long minutes = (remainingTimeInMillis / 1000) / 60;
        long seconds = (remainingTimeInMillis / 1000) % 60;
        
        String endTimeString = "";
        if (endTimeInMillis > 0) {
            SimpleDateFormat sdf = new SimpleDateFormat("HH:mm", Locale.getDefault());
            endTimeString = " • Ends " + sdf.format(new Date(endTimeInMillis));
        }
        
        String content = String.format(Locale.getDefault(), "%02d:%02d remaining%s", minutes, seconds, endTimeString);

        int progress = 0;
        if (totalTimeInMillis > 0) {
            progress = (int) ((totalTimeInMillis - remainingTimeInMillis) * 100 / totalTimeInMillis);
        }

        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle(title)
                .setContentText(content)
                .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
                .setContentIntent(pendingIntent)
                .setOnlyAlertOnce(true)
                .setOngoing(true)
                .setProgress(100, progress, false)
                .addAction(android.R.drawable.ic_media_pause, isRunning ? "Pause" : "Resume", pausePendingIntent)
                .addAction(android.R.drawable.ic_menu_close_clear_cancel, "End", stopPendingIntent);

        return builder.build();
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel serviceChannel = new NotificationChannel(
                    CHANNEL_ID,
                    "Focus Mode Channel",
                    NotificationManager.IMPORTANCE_LOW
            );
            notificationManager.createNotificationChannel(serviceChannel);
        }
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
