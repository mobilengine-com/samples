package com.mobilengine.example.plcli;

import java.util.concurrent.Callable;

import android.app.Activity;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Toast;

public class U {

	public static void addOnClick(final Activity a, int id, final Callable<Void> dg)
	{
		a.findViewById(id).setOnClickListener(new OnClickListener()
		{
			@Override
			public void onClick(View v)
			{
				try
				{
					dg.call();
				}
				catch (Exception e)
				{
					U.handleEx(a, e);
				}
			}
		});
		
	}

	public static void handleEx(Activity a, Exception e)
	{
		if (e.getClass() == RuntimeException.class)
			throw (RuntimeException) e;
		Toast.makeText(a, e.getMessage(), Toast.LENGTH_SHORT).show();
		e.printStackTrace();
	}

}
