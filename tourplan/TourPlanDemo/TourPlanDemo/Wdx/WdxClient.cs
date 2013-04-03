using System;
using System.ServiceModel;
using System.Xml.Linq;
using System.Xml.Serialization;

namespace TourPlanDemo.Wdx
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

    public class WdxClient : ClientBase<IWdx>, IWdx, IDisposable
    {
        public WdxClient()
        {
        }

        public WdxClient(string endpointConfigurationName) :
            base(endpointConfigurationName)
        {
        }

        public WdxClient(string endpointConfigurationName, string remoteAddress) :
            base(endpointConfigurationName, remoteAddress)
        {
        }

        public WdxClient(string endpointConfigurationName, EndpointAddress remoteAddress) :
            base(endpointConfigurationName, remoteAddress)
        {
        }

        public WdxClient(System.ServiceModel.Channels.Binding binding, EndpointAddress remoteAddress) :
            base(binding, remoteAddress)
        {
        }

        public void EnqueueDacs(Dacs dacs)
        {
            Channel.EnqueueDacs(dacs);
        }

        void IDisposable.Dispose()
        {
            bool success = false;
            try
            {
                if (State != CommunicationState.Faulted)
                {
                    Close();
                    success = true;
                }
            }
            finally
            {
                if (!success)
                {
                    Abort();
                }
            }
        }
    }
}
