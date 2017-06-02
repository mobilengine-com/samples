using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Adgw
{
    public static class Usru
    {

        public static Usrprm UsrprmFromAduser(this Aduser aduser, int idCompany, String idpIssuer, string[] rgformAll, string[] rgdashboardAll)
        {
            return new Usrprm
            {
                usern = aduser.userprincipalname,
                emailAddress = aduser.mail,
                idpIssuer = idpIssuer,
                companyId = idCompany,
                displayName = aduser.displayname,
                mobileNumber = aduser.mobile, // TODO: if mobile user, derive from groups
                mobilePlatform = "ios", // TODO: if mobile user, which platform
                role = "companyadmin", // TODO: which role
                webformAccess = true,  // TODO: if wef user
                biAccess = true, // TODO: if bif user
                forms = rgformAll.ToList(), // TODO which forms should the user get?
                dashboards = rgdashboardAll.ToList() // TODO the same
            };
        }
        
    }

    public class Usrprm
    {
        public int? userId { get; set; }
        public string usern { get; set; }
        public string idpIssuer { get; set; }
        public string displayName { get; set; }
        public string emailAddress { get; set; }
        public string password { get; set; }
        public int? companyId { get; set; }
        public string mobileNumber { get; set; }
        public string mobilePlatform { get; set; }
        public bool? hwValidation { get; set; }
        public string role { get; set; }
        public bool? webformAccess { get; set; }
        public bool? biAccess { get; set; }
        public bool? fSendEmail { get; set; }
        public bool? fSendSms { get; set; }
        public JObject jsonExtra { get; set; }
        public List<string> forms { get; set; }
        public List<string> dashboards { get; set; }
    }

    public class Usres
    {
        public int? companyId { get; set; }
        public int userId { get; set; }
        public string idpIssuer { get; set; }
        public string usern { get; set; }
        public string emailAddress { get; set; }
        public string displayName { get; set; }
        public string mobileNumber { get; set; }
        public string mobilePlatform { get; set; }
        public bool hwValidation { get; set; }
        public string role { get; set; }
        public bool webformAccess { get; set; }
        public bool biAccess { get; set; }
        //public Dtu created { get; set; }

        public JObject JsonExtra { get; set; }
        public List<string> forms { get; set; }
        public List<string> dashboards { get; set; }

    }
}