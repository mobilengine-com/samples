package com.mobilengine.wdx.client;

import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.xml.namespace.QName;
import javax.xml.ws.BindingProvider;

import com.acme.schemas.purchase_order.PurchaseOrder;
import com.acme.schemas.purchase_order.PurchaseOrder.BillTo;
import com.acme.schemas.purchase_order.PurchaseOrder.Items;
import com.acme.schemas.purchase_order.PurchaseOrder.Items.Item;
import com.acme.schemas.purchase_order.PurchaseOrder.ShipTo;
import com.acme.schemas.purchase_order.PurchaseOrderBillToCountry;
import com.acme.schemas.purchase_order.PurchaseOrderShipToCountry;
import com.mobilengine.schemas.wdx.Dacs;
import com.mobilengine.schemas.wdx.DacsContent;
import com.mobilengine.schemas.wdx.DacsMeta;
import com.mobilengine.schemas.wdx.IWdx;
import com.mobilengine.schemas.wdx.Wdx;

// This project implements the client side of the purchase-order sample. It sends an integration message (dacs) with some 
// product ordering info to the 4443 port on localhost. You need to understand this sample if you want to send integration 
// messages to Mobilengine. The Mobilengine Backoffice would play the role of the server side in that case, but to make the 
// sample self contained, you can use the attached TestServer as a dummy Mobilengine Backoffice to receive the messages.
//
// The files for implementing the wsdl contract in com.acme.schemas.purchase_order and com.mobilengine.schemas.wdx 
// were generated using wsimport: 
// wsimport -Xnocompile  purchase-order.wsdl

public class TestClient {
		
	public static void main(String[] args) {
		
		final int port = 4443;
		final String url = "https://localhost:" + port + "/Services/Wdx/Wdx.svc";
		
		try {
			Wdx wdx = new Wdx(TestClient.class.getResource("/purchase-order.wsdl"),
					new QName("http://schemas.mobilengine.com/Wdx", "Wdx"));

			IWdx wdxClient = wdx.getBasicHttpBindingIWdx();

			System.setProperty("javax.net.ssl.trustStore", TestClient.class.getResource("/truststore.jks").getPath());
			System.setProperty("javax.net.ssl.trustStorePassword", "123456");
			System.setProperty("javax.net.ssl.keyStore", TestClient.class.getResource("/me-test-client.pfx").getPath());
			System.setProperty("javax.net.ssl.keyStorePassword", "1234");
			System.setProperty("javax.net.ssl.keyStoreType", "pkcs12");
			
			BindingProvider bp = (BindingProvider) wdxClient;
			
			bp.getRequestContext().put(BindingProvider.ENDPOINT_ADDRESS_PROPERTY, url);

			Dacs dacs = createDacs();
			wdxClient.enqueueDacs(dacs);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	private static Dacs createDacs() {	
		Dacs dacs = new Dacs();
		dacs.setDacsid(UUID.randomUUID().toString());
		dacs.setMeta(DacsMeta.PURCHASE_ORDER);
		DacsContent content = new DacsContent();
		PurchaseOrder purchaseOrder = new PurchaseOrder();
		
		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		purchaseOrder.setOrderDate(dateFormat.format(new Date()));
		
		ShipTo shipTo = new ShipTo();
		shipTo.setName("Alice Smith");
		shipTo.setStreet("123 Mapple Street");
        shipTo.setCity("Mill Valley");
        shipTo.setState("CA");
        shipTo.setZip(90952);
        shipTo.setCountry(PurchaseOrderShipToCountry.US);
        purchaseOrder.setShipTo(shipTo);
		
		BillTo billTo = new BillTo();
	    billTo.setName("Robert Smith");
        billTo.setStreet("8 Oak Avenue");
        billTo.setCity("Old Town");
        billTo.setState("PA");
        billTo.setZip(95819);
        billTo.setCountry(PurchaseOrderBillToCountry.US);
		purchaseOrder.setBillTo(billTo);
		
		Items items = new Items();
		List<Item> itemList = items.getItem();
		
		Item item1 = new Item();
		item1.setProductName("Lawmower");
		item1.setQuantity(1);
		item1.setUSPrice(new BigDecimal(148.95));
        item1.setComment("Confirm this is electric");
        item1.setPartNum("872-AA");
		itemList.add(item1);
		
		Item item2 = new Item();
		item2.setProductName("Baby Monitor");
        item2.setQuantity(1);
        item2.setUSPrice(new BigDecimal(39.98));
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_YEAR, 4);
        item2.setShipDate(dateFormat.format(calendar.getTime()));
        item2.setPartNum("926-AA");
        itemList.add(item2);
		
		purchaseOrder.setItems(items);
				
		content.setPurchaseOrder(purchaseOrder);
		dacs.setContent(content);
		return dacs;
	}
}
