using System;
using System.Xml.Linq;
using System.Xml.Serialization;
using TourplanDemoReceiveService.Model;
using TourplanDemoReceiveService.Wdx;

namespace TourplanDemoReceiveService.Coml
{
    public interface IComli
    {
        void ReceiveForm(AssignmentChangeForm assignmentChangeForm);
    }

    public class WdxDispatch : IWdx
    {
        private readonly IComli comli;

        public WdxDispatch(IComli comli)
        {
            this.comli = comli;
        }

        public void EnqueueDacs(Dacs dacs)
        {
            switch (dacs.Meta)
            {
                case "TourplanForm": comli.ReceiveForm(Deserialize<AssignmentChangeForm>(dacs.XeContent)); break;
                default:
                    throw new Exception(string.Format("Unknown meta for dacs {0}, meta:{1}", dacs.Dacsid, dacs.Meta));
            }
        }
       
        private T Deserialize<T>(XElement xe)
        {
            return (T)new XmlSerializer(typeof(T)).Deserialize(xe.CreateReader());
        }
    }
}
