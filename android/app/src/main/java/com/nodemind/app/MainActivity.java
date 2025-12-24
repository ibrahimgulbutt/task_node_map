package com.nodemind.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(FocusModePlugin.class);
        super.onCreate(savedInstanceState);
    }
}
