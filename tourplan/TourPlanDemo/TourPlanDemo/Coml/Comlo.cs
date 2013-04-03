using System;
using System.Xml.Linq;
using System.Xml.Serialization;
using System.Collections.Generic;
using TourPlanDemo.Model;
using TourPlanDemo.Wdx;

namespace TourPlanDemo.Coml
{
    public class Comlo
    {
        public readonly Wdxclientf Wdxclientf;

        public Comlo(Wdxclientf wdxclientf)
        {
            Wdxclientf = wdxclientf;
        }

        private void Send<T>(string meta, T t)
        {
            var xd = new XDocument();
            using(var xwri = xd.CreateWriter())
                new XmlSerializer(typeof(T)).Serialize(xwri, t);
            SendXe(meta, xd.Root);
           
        }

        private void SendXe(string meta, XElement xe)
        {
            string a = Guid.NewGuid().ToString("N");
            using (var wdxClient = Wdxclientf.WdxClientCreate())
            {
                wdxClient.EnqueueDacs(new Dacs
                {
                    Dacsid = Guid.NewGuid().ToString("N"),
                    DtDtu = DateTime.UtcNow,
                    Meta = meta,
                    XeContent = xe
                });
            }
        }

        public void SendAssignmentChanges(AssignmentType assignment)
        {
            Send(AssignmentType.Meta, assignment);
        }

    }
}
