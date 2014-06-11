using System;
using System.Globalization;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.ServiceModel;
using TestClient.MobilengineIntegration;

namespace TestClient
{

    /// <summary>
    /// This project implements the client side of the purchase-order sample. It sends an integration message (dacs) with some 
    /// product ordering info to the 4443 port of localhost. You need to understand this sample if you want to send integration 
    /// messages to Mobilengine. The Mobilengine Backoffice would play the role of the server side in that case, but to make the 
    /// sample self contained, you can use the attached TestServer as a dummy Mobilengine Backoffice to receive the messages.
    /// 
    /// Check out the Service References for the code generated from the WSDL file. Also check the App.config file for the
    /// web service URL and client certificate configuration.
    /// 
    /// Note that the key of endpoint below (AUTH_KEY) should be configured to actual endpoint setting (see Backoffice/Dev console/Integration).
    /// Additionally the me-indoor-ca.cer file should be imported to the Local Computer/Trusted Root store.
    /// 
    /// You can enable message logging in the App.config file.
    /// </summary>
    class Program
    {
        static void Main()
        {
            var wdxClient = new WdxClient();
            
            //Send dacs
            try
            {
                const string AUTH_KEY = "a6e5defe0b8643a2bfa24226be1fbaa4";
                wdxClient.EnqueueDacs(
                    new Dacs
                        {
                            dacsid = Guid.NewGuid().ToString("N"),
                            dtu = DateTime.UtcNow,
                            meta = DacsMeta.purchaseorder,
                            Key = AUTH_KEY,
                            Content = new DacsContent
                                {
                                    Item  = new purchaseOrder
                                        {
                                            orderDate = DateTime.UtcNow.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
                                            shipTo = new purchaseOrderShipTo
                                                {
                                                    name = "Alice Smith",
                                                    street = "123 Mapple Street",
                                                    city = "Mill Valley",
                                                    state = "CA",
                                                    zip = 90952,
                                                    country = PurchaseOrderShipToCountry.US,
                                                },
                                            billTo = new purchaseOrderBillTo
                                                {
                                                    name = "Robert Smith",
                                                    street = "8 Oak Avenue",
                                                    city = "Old Town",
                                                    state = "PA",
                                                    zip = 95819,
                                                    country = PurchaseOrderBillToCountry.US,
                                                },
                                            comment = "Hurry, my lawn is going wild!",
                                            items = new []
                                                {
                                                    new purchaseOrderItem
                                                        {
                                                            productName = "Lawmower",
                                                            quantity = 1,
                                                            USPrice = (decimal)148.95,
                                                            comment = "Confirm this is electric",
                                                            partNum = "872-AA"
                                                        },
                                                    new purchaseOrderItem
                                                        {
                                                            productName = "Baby Monitor",
                                                            quantity = 1,
                                                            USPrice = (decimal)39.98,
                                                            shipDate = DateTime.Now.AddDays(4).ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
                                                            comment = "I love those littel screens",
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
