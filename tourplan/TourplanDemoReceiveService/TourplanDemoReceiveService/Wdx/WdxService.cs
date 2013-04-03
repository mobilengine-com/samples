using System;
using System.Security.Cryptography.X509Certificates;
using System.ServiceModel;
using System.Threading;
using System.Xml.Linq;
using System.Xml.Serialization;

namespace TourplanDemoReceiveService.Wdx
{
    public class EnqueueDacsFail
    {
        [XmlAttribute("dacsid")]
        public string Dacsid;

        [XmlElement("Message")]
        public string StMessage;

        public EnqueueDacsFail()
        {
        }

        public EnqueueDacsFail(string dacsid, string stMessage)
        {
            Dacsid = dacsid;
            StMessage = stMessage;
        }

        public override string ToString()
        {
            return string.Format("EnqueueDacsFail dacs {0}, message: {1}", Dacsid, StMessage);
        }
    }


    /// <summary>
    /// defhun:dacs data packet
    /// </summary>
    public class Dacs
    {
        [XmlAttribute("dacsid")]
        public string Dacsid;

        [XmlAttribute("dtu")]
        public DateTime DtDtu;

        [XmlAttribute("meta")]
        public string Meta;

        [XmlElement("Content")]
        public XElement XeContent;

        public string Tsto()
        {
            return string.Format("dacs {0} [{1}]", Dacsid, Meta);
        }
    }


    [ServiceContract(Namespace = "http://schemas.mobilengine.com/Wdx")]
    [XmlSerializerFormat(SupportFaults = true)]
    public interface IWdx
    {
        [OperationContract]
        [FaultContract(typeof(EnqueueDacsFail))]
        void EnqueueDacs(Dacs dacs);
    }

    [ServiceBehavior(InstanceContextMode = InstanceContextMode.Single)]
    public class WdxService : IWdx
    {
        private readonly string stUri;
        private readonly X509Certificate2 cert;
        private readonly IWdx wdx;
        private readonly ManualResetEvent mreAbort = new ManualResetEvent(false);
        private readonly ManualResetEvent mreStopped = new ManualResetEvent(false);

        public WdxService(string stUri, X509Certificate2 cert, IWdx wdx)
        {
            this.stUri = stUri;
            this.cert = cert;
            this.wdx = wdx;
            new Thread(Listen).Start();
        }

        private void Listen()
        {
            try
            {
                using (var svch = new ServiceHost(this, new Uri(stUri)))
                {
                    svch.Credentials.ServiceCertificate.Certificate = cert;
                    svch.Open();
                    
                    mreAbort.WaitOne();
                    svch.Close();
                }
            }
            finally
            {
                mreStopped.Set();
            }
        }

        public void Stop()
        {
            mreAbort.Set();
            mreStopped.WaitOne();
        }

        public void EnqueueDacs(Dacs dacs)
        {
            wdx.EnqueueDacs(dacs);
        }

    }
}