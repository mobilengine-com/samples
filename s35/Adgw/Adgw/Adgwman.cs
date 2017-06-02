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

        public void FullSyncAdToME()
        {
            var adman = new Adman(
                ConfigurationManager.AppSettings["ad:domainServer"],
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

            var jsonForms = uman.JsonByRequest("forms", "{{ companyId: {0} }}".StFormat(ConfigurationManager.AppSettings["me:companyId"]));
            if (jsonForms == null) return;

            // TODO form platforms, should use more info to assign forms
            var rgforms = jsonForms["result"].Where(jtoken => jtoken["platforms"].All(jtokPlat => Extensions.Value<string>(jtokPlat) != "android")).Select(jtoken => jtoken.Value<string>("name")).ToArray();

            var jsonDashboards = uman.JsonByRequest("dashboards", "{{ companyId: {0} }}".StFormat(ConfigurationManager.AppSettings["me:companyId"]));
            if (jsonDashboards == null) return;

            var rgdashboards = jsonDashboards["result"].Select(jtoken => jtoken.Value<string>("name")).ToArray();

            var jsonUsers = uman.JsonByRequest("users", "{{ companyId: {0} }}".StFormat(ConfigurationManager.AppSettings["me:companyId"]));
            if (jsonUsers == null) return;

            var mpMeusrByUsern =
                jsonUsers["result"]
                    .Where(jtoken => jtoken.Value<string>("idpIssuer") == ConfigurationManager.AppSettings["me:issuer"])
                    .ToDictionary(jtoken => jtoken.Value<string>("usern"), jtoken => jtoken.ToObject<Usres>());

            foreach (var aduser in rgadusr)
            {
                var umanusrCreate = aduser.UsrprmFromAduser(
                    int.Parse(ConfigurationManager.AppSettings["me:companyId"]),
                    ConfigurationManager.AppSettings["me:issuer"],
                    rgforms,
                    rgdashboards
                    );

                if (!mpMeusrByUsern.ContainsKey(aduser.userprincipalname))
                {
                    // create
                    log.Debug("creating user {0}".StFormat(umanusrCreate.usern));
                    var jsonCruser = uman.JsonByRequest("createuser", JsonConvert.SerializeObject(umanusrCreate));
                    if (jsonCruser == null) return;

                }
                else
                {
                    // alter
                    var umanusrlist = mpMeusrByUsern[aduser.userprincipalname];
                    var umanUsrAlter = umanusrCreate;
                    umanUsrAlter.userId = umanusrlist.userId;

                    log.Debug("altering user {0}".StFormat(aduser.userprincipalname));
                    var jsonAltuser = uman.JsonByRequest("alteruser", JsonConvert.SerializeObject(umanUsrAlter));
                    if (jsonAltuser == null) return;
                }
                // TODO send only when changed (compare changed time, should get back from uman first)
                dacsman.SendInsertUpdateDacs(aduser, umanusrCreate);
                mpMeusrByUsern.Remove(aduser.userprincipalname);
            }

            foreach (var umanusrlist in mpMeusrByUsern.Values)
            {
                // delete
                log.Debug("deleting user {0}".StFormat(umanusrlist.usern));
                var jsonDeluser = uman.JsonByRequest("deleteuser", "{{ userId: {0} }}".StFormat(umanusrlist.userId));
                if (jsonDeluser == null) return;
                dacsman.SendDeleteDacs(umanusrlist);
            }

            log.Debug("-- end of modifications --");
        }
    }
}