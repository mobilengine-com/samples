package com.mobilengine.example.plcli;

import java.util.concurrent.Callable;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.ComponentName;
import android.content.DialogInterface;
import android.content.DialogInterface.OnClickListener;
import android.os.Bundle;
import android.os.RemoteException;
import android.util.Log;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.CompoundButton.OnCheckedChangeListener;
import android.widget.Toast;

import com.mobilengine.android.fdx.client.Mex;
import com.mobilengine.android.fdx.client.MexServiceConnection;
import com.mobilengine.android.fdx.client.OpenFormResult;
import com.mobilengine.android.fdx.client.Plugins;

public class ActMex extends Activity {

	public static boolean fOpenActPlcliOnFormOpened = false;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		setContentView(R.layout.activity_actmex);

		U.addOnClick(this, R.id.btnLaunch, new Callable<Void>() {
			@Override
			public Void call() throws Exception {
				Plugins.launchMobilengine(ActMex.this);
				return null;
			}
		});

		U.addOnClick(this, R.id.btnSync, new Callable<Void>() {
			@Override
			public Void call() throws Exception {
				Plugins.bindToMobilengine(ActMex.this, false, new MexServiceConnection() {
					@Override
					public void onServiceConnected(ComponentName name, Mex mex) {
						try {
							Log.i("ActMex", "Service connected, syncing...");
							mex.sync();
						} catch (RemoteException e) {
							throw new RuntimeException(e);
						} finally {
							unbindService(this);
						}
					}
				});
				return null;
			}
		});

		U.addOnClick(this, R.id.btnOpenForm, new Callable<Void>() {
			@Override
			public Void call() throws Exception {
				Plugins.bindToMobilengine(ActMex.this, false, new MexServiceConnection() {
					@Override
					public void onServiceConnected(ComponentName name, Mex mex) {
						try {
							Log.i("ActMex", "Service connected, getting list of forms...");
							showFormChooser(mex.getForms());
						} catch (RemoteException e) {
							throw new RuntimeException(e);
						} finally {
							unbindService(this);
						}
					}
				});
				return null;
			}
		});
		
		CheckBox cbOpenActPlcli = (CheckBox) findViewById(R.id.cbOpenActPlcli);
		cbOpenActPlcli.setChecked(fOpenActPlcliOnFormOpened);
		cbOpenActPlcli.setOnCheckedChangeListener(new OnCheckedChangeListener() {
			@Override
			public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
				fOpenActPlcliOnFormOpened = isChecked;
			}
		});
	}

	private void showFormChooser(final String[] forms) {
		if (forms.length == 0) {
			Toast.makeText(this, "No forms to open", Toast.LENGTH_LONG).show();
			return;
		}
		
		AlertDialog.Builder builder = new AlertDialog.Builder(this);
		builder.setTitle("Select form to open");
		builder.setItems(forms, new OnClickListener() {
			@Override
			public void onClick(DialogInterface dialog, final int which) {
				Plugins.bindToMobilengine(ActMex.this, false, new MexServiceConnection() {
					@Override
					public void onServiceConnected(ComponentName name, Mex mex) {
						try {
							String formName = forms[which];
							Log.i("ActMex", "Service connected, opening form " + formName);
							OpenFormResult result = mex.openForm(formName);
							Toast.makeText(ActMex.this, "Form open: " + result, Toast.LENGTH_LONG).show();
						} catch (RemoteException e) {
							throw new RuntimeException(e);
						} finally {
							unbindService(this);
						}
					}
				});
			}
		});
		builder.show();
	}
}
