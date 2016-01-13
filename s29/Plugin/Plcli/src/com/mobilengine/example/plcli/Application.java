package com.mobilengine.example.plcli;

import com.mobilengine.android.fdx.client.Plugins;

public class Application extends android.app.Application {
	@Override
	public void onCreate() {
		super.onCreate();
		Plugins.initAcra(this);
	}
}
