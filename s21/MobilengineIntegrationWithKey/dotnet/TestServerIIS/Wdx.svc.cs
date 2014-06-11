using System;
using System.Diagnostics;
using System.ServiceModel;
using System.Threading;
using TestServer;

namespace TestServerIIS
{
    [ServiceBehavior(InstanceContextMode = InstanceContextMode.Single)]
    public class WdxService : IWdx
    {
        const string AUTH_KEY = "a6e5defe0b8643a2bfa24226be1fbaa4";

        public void EnqueueDacs(Dacs dacs)
        {
            //put your message processing code here
            Trace.WriteLine(string.Format("Receiving dacs {0}", dacs.dacsid));

            if (dacs.Key != AUTH_KEY)
            {
                Trace.WriteLine(string.Format("Wrong key, authentication failed", dacs.dacsid));
                return;
            }

            Trace.WriteLine(string.Format("Client certificate subject and thumbprint: {0}", Thread.CurrentPrincipal.Identity.Name));
            Trace.WriteLine(string.Format("This is an order from {0} for {1} products", dacs.Content.Item.billTo.name, dacs.Content.Item.items.Length));
        }
    }
}
