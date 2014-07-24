package wdx.server;

import java.net.InetSocketAddress;
import java.security.KeyStore;
import java.security.SecureRandom;

import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLParameters;
import javax.net.ssl.TrustManagerFactory;
import javax.xml.ws.Endpoint;

import com.sun.net.httpserver.HttpContext;
import com.sun.net.httpserver.HttpsConfigurator;
import com.sun.net.httpserver.HttpsParameters;
import com.sun.net.httpserver.HttpsServer;



// This project implements the server side of the purchase-order sample. It receives an integration message (dacs) with some 
// product ordering info in the 4443 port on localhost. You need to understand this sample if you are to receive integration 
// messages from Mobilengine. The Mobilengine Backoffice would play the role of the client side in that case, but to make the 
// sample self contained, you can use the attached TestClient as a dummy Mobilengine Backoffice to send messages.
//
// The files for implementing the wsdl contract were generated using wsimport: 
// wsimport -Xnocompile  purchase-order.wsdl
public class TestServer {
	public static void main(String[] args)
	{
		// authentication key that should be sent by the client to authenticate the request
		final String authKey = "d8e694d5dfeb462bbc64c2b24d6f9449";
		
		final int port = 4444;
		try {	
			SSLContext sslctx = SSLContext.getInstance("SSLv3");
			String certPasswd = "1234";
			KeyManagerFactory kmf = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm());
			KeyStore ks = KeyStore.getInstance("pkcs12");
	
			ks.load(TestServer.class.getResourceAsStream("/me-test-server.pfx"), certPasswd.toCharArray());
			kmf.init(ks, certPasswd.toCharArray());
	
			TrustManagerFactory tmf = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
			KeyStore ksTrust = KeyStore.getInstance("jks");
			ksTrust.load(TestServer.class.getResourceAsStream("/truststore.jks"), "123456".toCharArray());
			tmf.init(ksTrust);
	
			sslctx.init(kmf.getKeyManagers(), tmf.getTrustManagers(), new SecureRandom());
									
			HttpsConfigurator configurator = new HttpsConfigurator(sslctx) {
				@Override
				public void configure(HttpsParameters params) {
					//require client authentication
					SSLParameters sslparams = getSSLContext().getDefaultSSLParameters();
					sslparams.setNeedClientAuth(false);
					params.setSSLParameters(sslparams);
				}
			};
			
			SSLParameters params = sslctx.getDefaultSSLParameters();
			params.setNeedClientAuth(false);
						
			HttpsServer httpsServer = HttpsServer.create(new InetSocketAddress("localhost", port), 0);			
			httpsServer.setHttpsConfigurator(configurator);
			HttpContext httpContext = httpsServer.createContext("/");
			httpsServer.start();
			
			Endpoint endpoint = Endpoint.create(new WdxService(authKey));
			endpoint.publish(httpContext);
			
			System.out.println("The service is ready at https://localhost:" + port + ", press enter to exit.");
			System.in.read();
			httpsServer.stop(0);
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
	}
}
