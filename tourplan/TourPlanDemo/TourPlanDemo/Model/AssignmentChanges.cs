using System.Xml.Serialization;
using System.Collections.Generic;
using System.Xml;

namespace TourPlanDemo.Model
{
    public class NewAssignment
    {
        [XmlAttribute("AssignmentId")]
        public string AssignmentId { get; set; }

        [XmlAttribute("Usr")]
        public string Usr { get; set; }

        [XmlAttribute("Date")]
        public string Date { get; set; }

        [XmlAttribute("Company")]
        public string Company { get; set; }

        [XmlAttribute("City")]
        public string City { get; set; }

        [XmlAttribute("Assignment")]
        public string Assignment { get; set; }

        [XmlAttribute("Priority")]
        public string Priority { get; set; }

        [XmlAttribute("Comment")]
        public string Comment { get; set; }
    }

    public class DeletedAssignment
    {
        [XmlAttribute("AssignmentId")]
        public string AssignmentId { get; set; }
    }

    [XmlRoot("AssignmentType")]
    public class AssignmentType
    {
        public AssignmentType()
        {
            NewAssignmentList = new List<NewAssignment>();
            DeletedAssignmentList = new List<DeletedAssignment>();
        }

        public const string Meta = "AssignmentChange";

        public List<NewAssignment> NewAssignmentList { get; set; }

        public List<DeletedAssignment> DeletedAssignmentList { get; set; }
    }

}