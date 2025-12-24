package com.nodemind.app;

import android.content.Intent;
import android.Manifest;
import android.os.Build;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;

@CapacitorPlugin(
    name = "FocusMode",
    permissions = {
        @Permission(
            alias = "notifications",
            strings = { Manifest.permission.POST_NOTIFICATIONS }
        )
    }
)
public class FocusModePlugin extends Plugin {

    @PluginMethod
    public void startSession(PluginCall call) {
        Integer durationSeconds = call.getInt("duration");
        long duration = (durationSeconds != null ? durationSeconds : 25 * 60) * 1000L;
        
        Intent intent = new Intent(getContext(), FocusService.class);
        intent.setAction(FocusService.ACTION_START);
        intent.putExtra("duration", duration);
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            getContext().startForegroundService(intent);
        } else {
            getContext().startService(intent);
        }
        
        call.resolve();
    }

    @PluginMethod
    public void pauseSession(PluginCall call) {
        Intent intent = new Intent(getContext(), FocusService.class);
        intent.setAction(FocusService.ACTION_PAUSE);
        getContext().startService(intent);
        call.resolve();
    }

    @PluginMethod
    public void resumeSession(PluginCall call) {
        Intent intent = new Intent(getContext(), FocusService.class);
        intent.setAction(FocusService.ACTION_RESUME);
        getContext().startService(intent);
        call.resolve();
    }

    @PluginMethod
    public void stopSession(PluginCall call) {
        Intent intent = new Intent(getContext(), FocusService.class);
        intent.setAction(FocusService.ACTION_STOP);
        getContext().startService(intent);
        call.resolve();
    }
}
