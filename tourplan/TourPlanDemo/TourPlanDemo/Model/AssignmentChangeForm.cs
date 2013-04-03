using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Serialization;

namespace TourPlanDemo.Model
{
    [XmlRoot("AssignmentChangeForm")]
    public class AssignmentChangeForm
    {
        public const string Meta = "TourplanForm";

        [XmlAttribute]
        public string AssigmentId { get; set; }

        [XmlAttribute]
        public string Status { get; set ; }

        [XmlAttribute]
        public string Reason { get; set; }

        [XmlAttribute]
        public string Result { get; set; }

        [XmlAttribute]
        public string Barcode { get; set; }
    }
}