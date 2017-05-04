using System.Configuration;
using System.Linq;
using log4net;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Adgw
{
    public class Adgwman
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(Adgwman));

        private static bool HandleEr(string stmsg, JObject jsonForms)
        {
            if (!jsonForms.FSuccess())
            {
                log.Debug(stmsg + jsonForms);
                return true;
            }
            return false;
        }

        public void FullSyncAdToME()
        {
            var adman = new Adman(
                ConfigurationManager.AppSettings["ad:domain"],
                ConfigurationManager.AppSettings["ad:lookupUser"],
                ConfigurationManager.AppSettings["ad:lookupUserPwd"],
                ConfigurationManager.AppSettings["ad:dnAd"],
                ConfigurationManager.AppSettings["ad:dnMEUserGroup"]
                );
            var rgadusr = adman.RgadusrRead();

            var uman = new Uman(
                ConfigurationManager.AppSettings["me:urlUman"],
                ConfigurationManager.AppSettings["me:usernpwdDev"]
                );

            var dacsman = new Dacsman(ConfigurationManager.AppSettings["me:iepApikey"]);

            var jsonForms = uman.WbReqst("forms", "{{ companyId: {0} }}".StFormat(ConfigurationManager.AppSettings["me:companyId"]))
                .GetResponseStream().StReadAsUtf8().GetJson();
            if (HandleEr("error with getting forms: ", jsonForms)) return;

            // TODO form platforms, should use more info to assign forms
            var rgforms = jsonForms["result"].Where(jtoken => jtoken["platforms"].All(jtokPlat => Extensions.Value<string>(jtokPlat) != "android")).Select(jtoken => jtoken.Value<string>("name")).ToArray();

            var jsonDashboards = uman.WbReqst("dashboards", "{{ companyId: {0} }}".StFormat(ConfigurationManager.AppSettings["me:companyId"]))
                .GetResponseStream().StReadAsUtf8().GetJson();
            if (HandleEr("error with getting dashboards: ", jsonDashboards)) return;

            var rgdashboards = jsonDashboards["result"].Select(jtoken => jtoken.Value<string>("name")).ToArray();

            var jsonUsers = uman.WbReqst("users", "{{ companyId: {0} }}".StFormat(ConfigurationManager.AppSettings["me:companyId"]))
                .GetResponseStream().StReadAsUtf8().GetJson();
            if (HandleEr("error with getting users: ", jsonUsers)) return;

            var mpMeusrByUsern =
                jsonUsers["result"]
                    .Where(jtoken => jtoken.Value<string>("idpIssuer") == ConfigurationManager.AppSettings["me:issuer"])
                    .ToDictionary(jtoken => jtoken.Value<string>("email"), jtoken => jtoken.ToObject<Umanusrlist>());

            foreach (var aduser in rgadusr)
            {
                var umanusrCreate = Umanusr.UmanusrFromAduser(
                    aduser,
                    int.Parse(ConfigurationManager.AppSettings["me:companyId"]),
                    ConfigurationManager.AppSettings["me:issuer"],
                    rgforms,
                    rgdashboards
                    );

                if (!mpMeusrByUsern.ContainsKey(aduser.userprincipalname))
                {
                    // create
                    log.Debug("creating user {0}".StFormat(umanusrCreate.email));
                    var jsonCruser = uman.WbReqst("createuser", JsonConvert.SerializeObject(umanusrCreate)).GetResponseStream().StReadAsUtf8().GetJson();
                    if (HandleEr("error with creating user: ", jsonCruser)) return;

                }
                else
                {
                    // alter
                    var umanusrlist = mpMeusrByUsern[aduser.userprincipalname];
                    var umanUsrAlter = umanusrCreate.ToUmanusralter(umanusrlist.userId);

                    log.Debug("altering user {0}".StFormat(aduser.userprincipalname));
                    var jsonAltuser = uman.WbReqst("alteruser", JsonConvert.SerializeObject(umanUsrAlter)).GetResponseStream().StReadAsUtf8().GetJson();
                    if (HandleEr("error with altering user: ", jsonAltuser)) return;
                }
                // TODO send only when changed (compare changed time, should get back from uman first)
                dacsman.SendInsertUpdateDacs(aduser, umanusrCreate);
                mpMeusrByUsern.Remove(aduser.userprincipalname);
            }

            foreach (var umanusrlist in mpMeusrByUsern.Values)
            {
                // delete
                log.Debug("deleting user {0}".StFormat(umanusrlist.email));
                var jsonDeluser = uman.WbReqst("deleteuser", "{{ userId: {0} }}".StFormat(umanusrlist.userId)).GetResponseStream().StReadAsUtf8().GetJson();
                if (HandleEr("error with deleting user: ", jsonDeluser)) return;
                dacsman.SendDeleteDacs(umanusrlist);
            }

            log.Debug("-- end of modifications --");
        }
    }
}