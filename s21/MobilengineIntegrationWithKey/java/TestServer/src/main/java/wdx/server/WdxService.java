package wdx.server;

import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebService;
import javax.xml.ws.RequestWrapper;
import javax.xml.ws.ResponseWrapper;

import com.mobilengine.schemas.wdx.Dacs;
import com.mobilengine.schemas.wdx.EnqueueDacsFail;
import com.mobilengine.schemas.wdx.IWdx;
import com.mobilengine.schemas.wdx.IWdxEnqueueDacsEnqueueDacsFailFaultFaultMessage;

@WebService(serviceName="Wdx", targetNamespace="http://schemas.mobilengine.com/Wdx")
public class WdxService implements IWdx {

	private final String authKey;
	
	public WdxService(String authKey) {
		this.authKey = authKey;
	}
	
	@Override
	@WebMethod(operationName = "EnqueueDacs", action = "http://schemas.mobilengine.com/Wdx/IWdx/EnqueueDacs")
	@RequestWrapper(localName = "EnqueueDacs", targetNamespace = "http://schemas.mobilengine.com/Wdx", className = "com.mobilengine.schemas.wdx.EnqueueDacs")
	@ResponseWrapper(localName = "EnqueueDacsResponse", targetNamespace = "http://schemas.mobilengine.com/Wdx", className = "com.mobilengine.schemas.wdx.EnqueueDacsResponse")
	public void enqueueDacs(
			@WebParam(name = "dacs", targetNamespace = "http://schemas.mobilengine.com/Wdx") Dacs dacs)
			throws IWdxEnqueueDacsEnqueueDacsFailFaultFaultMessage {
		System.out.println("Dacs received: " + dacs.getDacsid());
		if (!dacs.getKey().equals(authKey)) {
			String message = "Dacs key authentication failed";
			EnqueueDacsFail faultInfo = new EnqueueDacsFail();
			faultInfo.setMessage(message);
			faultInfo.setDacsid(dacs.getDacsid());
			System.out.println(message);
			throw new IWdxEnqueueDacsEnqueueDacsFailFaultFaultMessage(message, faultInfo);
		}
		System.out.println("This is an order from " + dacs.getContent().getPurchaseOrder().getBillTo().getName() +  
				" for " + dacs.getContent().getPurchaseOrder().getItems().getItem().size() + " products");
	}

}

