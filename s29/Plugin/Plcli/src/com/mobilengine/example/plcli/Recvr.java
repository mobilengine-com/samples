package com.mobilengine.example.plcli;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.widget.Toast;

import com.mobilengine.android.fdx.client.Plugins;

public class Recvr extends BroadcastReceiver {
	@Override
	public void onReceive(Context context, Intent intent) {
		Log.i("Plcli", "got intent: " + tstoFromIntent(intent));
		Toast.makeText(context, "Intent: " + tstoFromIntent(intent), Toast.LENGTH_LONG).show();
		
		if (intent.getAction().equals(Plugins.ACTION_FORM_OPENED) && ActMex.fOpenActPlcliOnFormOpened) {
			intent.setClass(context, ActPlcli.class);
			intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
			context.startActivity(intent);
		}
	}
	
	String tstoFromIntent(Intent intent) {
		StringBuffer st = new StringBuffer(intent.getAction());
		if (intent.getExtras().size() > 0) {
			st.append("(");
			boolean fFirst = true;
			for (String key : intent.getExtras().keySet()) {
				if (!fFirst) {
					st.append(", ");
				}
				st.append(key);
				st.append("=");
				st.append(intent.getExtras().get(key));
				fFirst = false;
			}
			st.append(")");
		}
		return st.toString();
	}
}
