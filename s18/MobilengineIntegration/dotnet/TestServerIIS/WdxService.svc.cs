using System;
using System.Diagnostics;
using System.ServiceModel;
using TestServer;

namespace TestServerIIS
{
    [ServiceBehavior(InstanceContextMode = InstanceContextMode.Single)]
    public class WdxService : IWdx
    {
        public void EnqueueDacs(Dacs dacs)
        {
            //put your message processing code here

            Debug.WriteLine(string.Format("Receiving dacs {0}", dacs.dacsid));
            Debug.WriteLine(string.Format("This is an order from {0} for {1} products", dacs.Content.Item.billTo.name, dacs.Content.Item.items.Length));
        }
    }
}
