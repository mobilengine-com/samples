using System;
using System.Linq;
using System.Security.Authentication;
using System.Security.Cryptography.X509Certificates;
using System.ServiceModel;
using System.Threading;

namespace TestServer
{
     ///<summary>
     /// This project implements the server side of the purchase-order sample. It receives an integration message (dacs) with some 
     /// product ordering info in the 4444 port of localhost. You need to understand this sample if you are to receive integration 
     /// messages from Mobilengine. The Mobilengine Backoffice would play the role of the client side in that case, but to make the 
     /// sample self contained, you can use the attached TestClient as a dummy Mobilengine Backoffice to send messages.
     ///       
     /// We generated Wdx.cs with "svcutil ../data/purchase-order.wsdl /fault /namespace:*,TestServer /syncOnly" from a Visual Studio command prompt.
     /// Check the App.config for the web service configuration.
     /// 
     /// Authentication key (AUTH_KEY) below should be changed according to actual endpoint configuration.
     /// The me-indoor-ca.cer file should be imported to the Local Computer/Trusted Root store.
     /// 
     /// You can change the server port, but keep it synchronized with the port in the TestClient project
     /// </summary>
    class Program
    {
        const int port = 4444;
        static readonly Uri uriServer = new Uri(string.Format("https://localhost:{0}/Services/Wdx/Wdx.svc", port));

        static void Main()
        {

            //start listening
            using (var svch = new ServiceHost(new WdxService(), uriServer))
            {
                svch.Open();
                Console.WriteLine("The service is ready at {0}, press enter to exit.", uriServer);
                Console.ReadLine();
                svch.Close();
            }

        }

    }

    [ServiceBehavior(InstanceContextMode = InstanceContextMode.Single)]
    class WdxService : IWdx
    {
        const string AUTH_KEY = "a6e5defe0b8643a2bfa24226be1fbaa4";

        public void EnqueueDacs(Dacs dacs)
        {
            //put your message processing code here

            Console.WriteLine("Receiving dacs {0}", dacs.dacsid);
            if (dacs.Key == AUTH_KEY)
            {
                Console.WriteLine("This is an order from {0} for {1} products", dacs.Content.Item.billTo.name, dacs.Content.Item.items.Length);
            }
            else
            {
                Console.WriteLine("Authentication failed");
                throw new FaultException<EnqueueDacsFail>(new EnqueueDacsFail { dacsid = dacs.dacsid, Message = "Dacs authentication failed" });
            }
        }
    }
}
