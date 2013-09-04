using System;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.ServiceModel;

namespace TestServer
{
     ///<summary>
     /// This project implements the server side of the purchase-order sample. It receives an integration message (dacs) with some 
     /// product ordering info in the 4444 port of localhost. You need to understand this sample if you are to receive integration 
     /// messages from Mobilengine. The Mobilengine Backoffice would play the role of the client side in that case, but to make the 
     /// sample self contained, you can use the attached TestClient as a dummy Mobilengine Backoffice to send messages.
     ///       
     /// We generated Wdx.cs with "svcutil ../data/purchase-order.wsdl /fault /namespace:*,TestServer" from a Visual Studio command prompt.
     /// Check the App.config for the web service configuration.
     /// 
     /// Make sure that the me-test-server.pfx certificate is installed in the Local Computer/Personal store (the password is 1234)
     /// Additionally the me-indoor-ca.cer file should be imported to the Local Computer/Trusted Root store.
     /// 
     /// You can change the server port, but keep it synchronized with the port in the TestClient project
     /// </summary>
    class Program
    {
        const int port = 4444;
        static readonly Uri uriServer = new Uri(string.Format("https://localhost:{0}/Services/Wdx/Wdx.svc", port));

        static void Main()
        {
            //Read our server certificate
            var certificateStore = new X509Store(StoreName.My, StoreLocation.LocalMachine);
            certificateStore.Open(OpenFlags.ReadOnly);
            var cert = certificateStore.Certificates.Cast<X509Certificate2>().
                Single(certT => certT.Subject == "CN=localhost" && certT.IssuerName.Name == "CN=ME-INDOOR-CA");
            certificateStore.Close();

            //We need to configure our port to be used with the certificate. 
            //See http://msdn.microsoft.com/en-us/library/ms733791.aspx How to: Configure a Port with an SSL Certificate 
            //But instead of manually doing it, we use a workaround to do it from code
            SetSSLCert.BindCertificate("0.0.0.0", port, RgbyteFromHex(cert.Thumbprint));

            //start listening
            using (var svch = new ServiceHost(new WdxService(), uriServer))
            {
                svch.Open();
                Console.WriteLine("The service is ready at {0}, press enter to exit.", uriServer);
                Console.ReadLine();
                svch.Close();
            }

        }

         private static byte[] RgbyteFromHex(string hex)
        {
            return Enumerable.Range(0, hex.Length)
                .Where(x => x % 2 == 0)
                .Select(x => Convert.ToByte(hex.Substring(x, 2), 16))
                .ToArray();
        }
    }

    [ServiceBehavior(InstanceContextMode = InstanceContextMode.Single)]
    class WdxService : IWdx
    {
        public void EnqueueDacs(Dacs dacs)
        {
            //put your message processing code here

            Console.WriteLine("Receiving dacs {0}", dacs.dacsid);
            Console.WriteLine("This is an order from {0} for {1} products", dacs.Content.Item.billTo.name, dacs.Content.Item.items.Length);
        }
    }
}
