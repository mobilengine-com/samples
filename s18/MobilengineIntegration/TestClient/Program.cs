using System;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.ServiceModel;

namespace TestClient
{

    /// <summary>
    /// This project implements the client side of the purchase-order sample. It sends an integration message (dacs) with some 
    /// product ordering info to the 4444 port of localhost. You need to understand this sample if you want to send integration 
    /// messages to Mobilengine. The Mobilengine Backoffice would play the role of the server side in that case, but to make the 
    /// sample self contained, you can use the attached TestServer as a dummy Mobilengine Backoffice to receive the messages.
    /// 
    /// We generated Wdx.cs with "svcutil ../data/purchase-order.wsdl /fault" from a Visual Studio command prompt.
    /// 
    /// Make sure that the me-test-client.pfx certificate is installed in the Local Computer/Personal store (the password is 1234)
    /// Additionally the me-indoor-ca.cer file should be imported to the Local Computer/Trusted Root store.
    /// 
    /// You can change the server port (4444), but keep it synchronized with the port in the TestClient project.
    /// 
    /// You can enable message logging in the App.config file.
    /// </summary>
    class Program
    {
        const int port = 4444;
        static readonly Uri uriServer = new Uri(string.Format("https://localhost:{0}/", port));

        static void Main()
        {
            //Read our client certificate
            var certificateStore = new X509Store(StoreName.My, StoreLocation.LocalMachine);
            certificateStore.Open(OpenFlags.ReadOnly);
            var cert = certificateStore.Certificates.Cast<X509Certificate2>().
                Single( certT => certT.Subject == "CN=me test client" && certT.IssuerName.Name == "CN=ME-INDOOR-CA");
            certificateStore.Close();

            //Create a soap client and set certificate
            var wdxClient = new WdxClient("WdxClientEndpoint", new EndpointAddress(uriServer));
            wdxClient.ClientCredentials.ClientCertificate.Certificate = cert;

            //Send dacs
            try
            {
                wdxClient.EnqueueDacs(
                    new Dacs
                        {
                            dacsid = Guid.NewGuid().ToString("N"),
                            dtu = DateTime.UtcNow,
                            meta = DacsMeta.purchaseorder,
                            Content = new DacsContent
                                {
                                    Item = new DacsContentPurchaseOrder
                                        {
                                            orderDate = DateTime.UtcNow.ToLongTimeString(),
                                            shipTo = new DacsContentPurchaseOrderShipTo
                                                {
                                                    name = "Alice Smith",
                                                    street = "123 Mapple Street",
                                                    city = "Mill Valley",
                                                    state = "CA",
                                                    zip = 90952,
                                                    country = DacsContentPurchaseOrderShipToCountry.US,
                                                },
                                            billTo = new DacsContentPurchaseOrderBillTo
                                                {
                                                    name = "Robert Smith",
                                                    street = "8 Oak Avenue",
                                                    city = "Old Town",
                                                    state = "PA",
                                                    zip = 95819,
                                                    country = DacsContentPurchaseOrderBillToCountry.US,
                                                },
                                            comment = "Hurry, my lawn is going wild!",
                                            items = new []
                                                {
                                                    new DacsContentPurchaseOrderItem
                                                        {
                                                            productName = "Lawmower",
                                                            quantity = 1,
                                                            USPrice = (decimal)148.95,
                                                            comment = "Confirm this is electric",
                                                            partNum = "872-AA"
                                                        },
                                                    new DacsContentPurchaseOrderItem
                                                        {
                                                            productName = "Baby Monitor",
                                                            quantity = 1,
                                                            USPrice = (decimal)39.98,
                                                            comment = DateTime.Now.AddDays(4).ToLongTimeString(),
                                                            partNum = "926-AA"
                                                        }
                                                }
                                        }
                                }
                        }
                    );

            }
            catch (FaultException<EnqueueDacsFail> fer)
            {
                Console.Error.WriteLine(fer.Detail.Message);
            }
        }
    }
}
