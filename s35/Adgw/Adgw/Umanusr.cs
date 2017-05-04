using System;
using Newtonsoft.Json;

namespace Adgw
{
    class Umanusrlist : Umanusralter
    {
        public string created { get; set; }
    }    
    
    class Umanusralter : Umanusr
    {
        public int userId { get; set; }
    }

    class Umanusr
    {
        public Umanusr()
        {
            hwValidation = false;
            fSendEmail = false;
            fSendSms = false;
        }

        public string email { get; set; }
        public string idpIssuer { get; set; }
        public int companyId { get; set; }
        public string userName { get; set; }
        public string mobileNumber { get; set; }
        public string mobilePlatform { get; set; }
        public bool hwValidation { get; set; }
        public string role { get; set; }
        public bool webformAccess { get; set; }
        public bool dashboardAccess { get; set; }
        public bool fSendEmail { get; set; }
        public bool fSendSms { get; set; }
        public string[] forms { get; set; }
        public string[] dashboards { get; set; }

        public static Umanusr UmanusrFromAduser(Aduser aduser, int idCompany, String idpIssuer, string[] rgformAll, string[] rgdashboardAll)
        {
            return new Umanusr
            {
                email = aduser.userprincipalname,
                idpIssuer = idpIssuer,
                companyId = idCompany,
                userName = aduser.displayname,
                mobileNumber = aduser.mobile, // TODO: if mobile user, derive from groups
                mobilePlatform = "ios", // TODO: if mobile user, which platform
                role = "companyadmin", // TODO: which role
                webformAccess = true,  // TODO: if wef user
                dashboardAccess = true, // TODO: if bif user
                forms = rgformAll, // TODO which forms should the user get?
                dashboards = rgdashboardAll // TODO the same
            };
        }

        public Umanusralter ToUmanusralter(int idUser)
        {
            var data = JsonConvert.SerializeObject(this);
            var umanusralter = (Umanusralter)JsonConvert.DeserializeObject(data, typeof (Umanusralter));
            umanusralter.userId = idUser;
            return umanusralter;
        }
    }
}