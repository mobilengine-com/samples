package com.mobilengine.example.plcli;

import android.app.Service;
import android.content.ComponentName;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.os.IBinder.DeathRecipient;
import android.os.RemoteException;
import android.util.Log;

import com.mobilengine.android.fdx.client.Mex;
import com.mobilengine.android.fdx.client.Plugins;

public class Mexsvc extends Service {

	private static boolean fRunning = false;
	
	public int onStartCommand(Intent intent, int flags, int startId) {
		Log.i("Pltest.Mexsvc", "Mexsvc onStartCommand");
		if (!fRunning) {
			fRunning = true;
			runSrvr(intent);
		} else {
			Log.i("Pltest.Mexsvc", "not starting thread, already running");
		}
		return Service.START_NOT_STICKY;
	};
	
	@Override
	public void onDestroy() {
		Log.i("Pltest.Mexsvc", "Mexsvc onDestroy");
		super.onDestroy();
	}
			
	public void runSrvr(Intent intent) {
		Log.i("Pltest.Mexsvc", "Mexsvc connecting to AnbService...");
		
		Plugins.bindToMobilengine(this, true, new ServiceConnection() {
						
			@Override
			public void onServiceConnected(ComponentName name, IBinder service) {
				Log.i("Pltest.Mexsvc", "Mexsvc connected to AnbService, Mexsvc thread");
				
				final Mex mex = Mex.Stub.asInterface(service);
				// final Srvr srvr = new Srvr(new Cmd(mex), 1113 /* TODO: get port from somewhere */, -1);
				final DeathRecipient drec = new DeathRecipient() {
					@Override
					public void binderDied() {
						try {
							Log.i("Pltest.Mexsvc", "Binder died, stopping service");
							// srvr.stop();
						} catch (Exception e) {
							e.printStackTrace();
						}				
					}
				};
				
				Thread thread = new Thread(new Runnable() {
					@Override
					public void run() {
						try {
							Log.i("Pltest.Mexsvc", "Mexsvc thread started");
							mex.asBinder().linkToDeath(drec, 0);
							// srvr.run();
							Log.i("Pltest.Mexsvc", "Mexsvc shutting down");
							stopSelf();
							mex.asBinder().unlinkToDeath(drec, 0);
						} catch (Exception e) {
							Log.w("Pltest.Mexsvc", "Mexsvc thread caught error", e);
							throw new RuntimeException(e);
						} finally {
							fRunning = false;
						}
					}
				});
				thread.start();
			}
			
			@Override
			public void onServiceDisconnected(ComponentName name) {
				Log.i("Pltest.Mexsvc", "Mexsvc: service disconnected");
			}
		});
	}

	private class Cmd {
		private Mex mex;
		
		public Cmd(Mex mex) {
			this.mex = mex;
		}
		
		@SuppressWarnings("unused")
		public String cmdOpenForm(String formn) throws RemoteException {
			return mex.openForm(formn).name();
		}
		
		@SuppressWarnings("unused")
		public void cmdLaunch() {
			Plugins.launchMobilengine(Mexsvc.this);
		}
		
		@SuppressWarnings("unused")
		public void cmdSync() throws RemoteException {
			mex.sync();
		}
		
		@SuppressWarnings("unused")
		public String[] cmdGetForms() throws RemoteException {
			return mex.getForms();
		}
	}
	
	@Override
	public IBinder onBind(Intent intent) {
		return null;
	}

}
