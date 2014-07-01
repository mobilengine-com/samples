package com.mobilengine.example.plcli;

import java.io.File;
import java.io.FileInputStream;
import java.util.concurrent.Callable;

import android.app.Activity;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.os.RemoteException;
import android.provider.MediaStore;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.AdapterView.OnItemLongClickListener;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.SlidingDrawer;
import android.widget.Toast;

import com.mobilengine.android.fdx.client.FdxBinderWrp;
import com.mobilengine.android.fdx.client.FdxRemote;

public class ActPlcli extends Activity
{
	
	protected static final int RESULT_LOAD_IMAGE = 111;
	private FdxRemote fdxRemote;
	private ArrayAdapter<Li<?>> adapter;
	
	@Override
	protected void onCreate(Bundle savedInstanceState)
	{
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_plcli);
		
		ListView lv = (ListView) findViewById(R.id.listView2);
		adapter = new ArrayAdapter<Li<?>>(ActPlcli.this, android.R.layout.simple_list_item_1);
		lv.setAdapter(adapter);
		
		addOnClick(R.id.btnSet, new Callable<Void>()
		{
			
			@Override
			public Void call() throws Exception
			{
				fdxRemote.setValue(stGet(R.id.etNpth), stGet(R.id.etValue));
				return null;
			}
		});
		
		lv.setOnItemClickListener(new OnItemClickListener()
		{
			@Override
			public void onItemClick(AdapterView<?> parent, View view, int position, long id)
			{
				Li<?> item = adapter.getItem(position);
				item.open();
				
				setNpth(item.npth);
			}
		});
		lv.setOnItemLongClickListener(new OnItemLongClickListener()
		{
			
			@Override
			public boolean onItemLongClick(AdapterView<?> parent, View view, int position, long id)
			{
				Li<?> item = adapter.getItem(position);
				item.close();
				return true;
			}
		});
		
		addOnClick(R.id.btnAddRow, new Callable<Void>()
		{
			
			@Override
			public Void call() throws Exception
			{
				fdxRemote.addRow(stGet(R.id.etNpth));
				return null;
			}
		});
		
		addOnClick(R.id.btnDelRow, new Callable<Void>()
		{
			
			@Override
			public Void call() throws Exception
			{
				fdxRemote.removeRow(stGet(R.id.etNpth));
				return null;
			}
		});
		
		addOnClick(R.id.btnPhoto, new Callable<Void>()
		{
			
			@Override
			public Void call() throws Exception
			{
				((ImageView) findViewById(R.id.iv)).setImageDrawable(null);
				long msStart = System.currentTimeMillis();
				
				int i;
				try
				{
					i = Integer.valueOf(stGet(R.id.etValue));
				}
				catch (Exception er)
				{
					i = 0;
				}
				
				Bitmap bmp = BitmapFactory.decodeStream(FdxBinderWrp.getImageInputStream(fdxRemote, stGet(R.id.etNpth), i));
				
				long msEnd = System.currentTimeMillis();
				long msTotal = msEnd - msStart;
				Log.i("photo", msTotal + "ms");
				((ImageView) findViewById(R.id.iv)).setImageBitmap(bmp);
				((SlidingDrawer) findViewById(R.id.slidingDrawer1)).animateOpen();
				return null;
			}
		});
		
		addOnClick(R.id.btnCrash, new Callable<Void>()
		{
			
			@Override
			public Void call() throws Exception
			{
				throw new RuntimeException();
			}
		});
		
		addOnClick(R.id.btnAnr, new Callable<Void>()
		{
			
			@Override
			public Void call() throws Exception
			{
				for (;;)
				{
				}
			}
		});
		
		addOnClick(R.id.btnSendPhoto, new Callable<Void>()
		{
			@Override
			public Void call()
			{
				Intent i = new Intent(Intent.ACTION_PICK, android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
				startActivityForResult(i, RESULT_LOAD_IMAGE);
				return null;
			}
		});
		
		addOnClick(R.id.btnUnbind, new Callable<Void>()
		{
			
			@Override
			public Void call() throws Exception
			{
				fdxRemote = null;
				return null;
			}
		});
		
		fdxRemote = FdxBinderWrp.FdxRemoteFromIntent(getIntent());
		Toast.makeText(ActPlcli.this, "Binded", Toast.LENGTH_SHORT).show();
		new Children(-1, null).open();
		String npth = FdxBinderWrp.NpthButton(getIntent());
		setNpth(npth);
		for (int i = 0; i < adapter.getCount(); i++)
		{
			Li<?> li = adapter.getItem(i);
			if(npth.startsWith(li.npth))
			{
				if(li instanceof Node || li instanceof Children)
					li.open();
			}
			if(npth.equals(li.npth))
			{
				((ListView)findViewById(R.id.listView2)).smoothScrollToPosition(i+3);
				break;
			}
			
		}
	}
	
	@Override
	protected void onActivityResult(int requestCode, int resultCode, Intent data)
	{
		super.onActivityResult(requestCode, resultCode, data);
		if (requestCode == RESULT_LOAD_IMAGE && resultCode == RESULT_OK && null != data)
		{
			Uri selectedImage = data.getData();
			String[] filePathColumn = { MediaStore.Images.Media.DATA };
			Cursor cursor = getContentResolver().query(selectedImage, filePathColumn, null, null, null);
			cursor.moveToFirst();
			int columnIndex = cursor.getColumnIndex(filePathColumn[0]);
			String picturePath = cursor.getString(columnIndex);
			cursor.close();
			File fil = new File(picturePath);
			FileInputStream fis;
			try
			{
				fis = new FileInputStream(fil);
				FdxBinderWrp.addImage(fdxRemote, stGet(R.id.etNpth), fis);
				fis.close();
				
			}
			catch (Exception e)
			{
				e.printStackTrace();
				Toast.makeText(this, "Err: " + e.getMessage(), Toast.LENGTH_LONG).show();
			}
		}
	}
	
	private void addOnClick(int id, final Callable<Void> dg)
	{
		findViewById(id).setOnClickListener(new OnClickListener()
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
					handleEx(e);
				}
			}
		});
		
	}
	
	private String stGet(int id)
	{
		EditText editText = (EditText) findViewById(id);
		return editText.getText().toString();
	}
	
	protected void handleEx(Exception e)
	{
		if (e.getClass() == RuntimeException.class)
			throw (RuntimeException) e;
		Toast.makeText(ActPlcli.this, e.getMessage(), Toast.LENGTH_SHORT).show();
		e.printStackTrace();
	}
	
	private void setNpth(String npth)
	{
		((EditText) findViewById(R.id.etNpth)).setText(npth);
	}

	private abstract class Li<T>
	{
		public int level;
		public String npth;
		
		public <Tli extends Li<?>> Tli Sub(Tli liSub, String npth)
		{
			liSub.npth = npth;
			liSub.level = level + 1;
			return liSub;
		}
		
		public void open()
		{
			try
			{
				close();
				T[] rgt = getChildren();
				if (rgt != null)
				{
					int iline = ilineGet();
					for (T t : rgt)
					{
						adapter.insert(createSub(t), ++iline);
					}
				}
			}
			catch (RemoteException e)
			{
				handleEx(e);
			}
		}
		
		protected abstract Li<?> createSub(T t) throws RemoteException;
		
		protected abstract T[] getChildren() throws RemoteException;
		
		public void close()
		{
			int iline = ilineGet() + 1;
			while (iline < adapter.getCount() && adapter.getItem(iline).level > level)
				adapter.remove(adapter.getItem(iline));
		}
		
		protected int ilineGet()
		{
			return adapter.getPosition(this);
		}
		
		@Override
		public String toString()
		{
			return new String(new char[level + 2]).replace('\0', ' ') + stGet();
		}
		
		protected abstract String stGet();
	}
	
	private class Node extends Li<Li<?>>
	{
		private String value;
		
		@Override
		protected Li<?>[] getChildren() throws RemoteException
		{
			return new Li[] { new Children(), new Pls(), new Mts() };
		}
		
		@Override
		protected Li<?> createSub(Li<?> li) throws RemoteException
		{
			return Sub(li, npth);
		}
		
		public Node ensureValue() throws RemoteException
		{
			value = fdxRemote.getValue(npth);
			return this;
		}
		
		@Override
		protected String stGet()
		{
			return npth + ": " + value;
		}
	}
	
	private class Children extends Li<String>
	{
		public Children()
		{
			
		}
		
		public Children(int level, String npth)
		{
			this.level = level;
			this.npth = npth;
		}
		
		@Override
		protected String[] getChildren() throws RemoteException
		{
			return fdxRemote.getChildren(npth);
		}
		
		protected Node createSub(String npth) throws RemoteException
		{
			return Sub(new Node(), npth).ensureValue();
		}
		
		@Override
		protected String stGet()
		{
			return "Children:";
		}
	}
	
	private class Pls extends Li<String>
	{
		@Override
		protected String[] getChildren() throws RemoteException
		{
			return fdxRemote.getPlids(npth);
		}
		
		@Override
		protected Pl createSub(String plid) throws RemoteException
		{
			return Sub(new Pl(), npth).setPlid(plid);
		}
		
		@Override
		protected String stGet()
		{
			return "Pls:";
		}
	}
	
	private class Pl extends Li<Void>
	{
		public String plid;
		public String value;
		
		public Pl setPlid(String plid) throws RemoteException
		{
			this.plid = plid;
			value = fdxRemote.getPlidValue(npth, plid);
			return this;
		}
		
		@Override
		protected Void[] getChildren() throws RemoteException
		{
			return null;
		}
		
		@Override
		protected Li<?> createSub(Void t) throws RemoteException
		{
			throw new UnsupportedOperationException();
		}
		
		@Override
		protected String stGet()
		{
			return plid + ": " + value;
		}
	}
	
	private class Mts extends Li<String>
	{
		@Override
		protected String[] getChildren() throws RemoteException
		{
			return fdxRemote.getAllMetaFromNpth(npth, ActPlcli.this.stGet(R.id.etNs));
		}
		
		@Override
		protected Mt createSub(String met) throws RemoteException
		{
			return Sub(new Mt(), npth).setMet(met);
		}
		
		@Override
		protected String stGet()
		{
			return "Metas:";
		}
	}
	
	private class Mt extends Li<Void>
	{
		public String met;
		public String value;
		
		public Mt setMet(String met) throws RemoteException
		{
			this.met = met;
			value = fdxRemote.getMetaFromNpth(npth, ActPlcli.this.stGet(R.id.etNs), met);
			return this;
		}
		
		@Override
		protected Void[] getChildren() throws RemoteException
		{
			return null;
		}
		
		@Override
		protected Li<?> createSub(Void t) throws RemoteException
		{
			throw new UnsupportedOperationException();
		}
		
		@Override
		protected String stGet()
		{
			return met + ": " + value;
		}
	}
	
}
