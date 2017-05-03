using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.DirectoryServices.Protocols;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Security;
using System.ServiceModel;
using System.ServiceModel.Channels;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace ADGW
{
    class Dacsman
    {
        private readonly string authkey;

        public Dacsman(string authkey)
        {
            this.authkey = authkey;
        }

        public void SendInsertUpdateDacs(Aduser aduser, Umanusr umanusr)
        {
            // data: usern, email, mobile, display name, ad guid, groups: group dn

            {
                var wdxClient = new Adgw.DacsUserInsertUpdate.WdxClient(/*binding, remoteAddressiepn, urlWdx*/);

                //Send dacs
                try
                {
                    wdxClient.EnqueueDacs(
                        new Adgw.DacsUserInsertUpdate.Dacs
                        {
                            dacsid = Guid.NewGuid().ToString("N"),
                            dtu = DateTime.UtcNow,
                            meta = Adgw.DacsUserInsertUpdate.DacsMeta.userinsertupdate,
                            Key = authkey,
                            Content = new Adgw.DacsUserInsertUpdate.DacsContent
                            {
                                Item = new Adgw.DacsUserInsertUpdate.user()
                                {
                                    adGuid = aduser.objectGUID,
                                    usern = umanusr.email,
                                    email = aduser.mail,
                                    displayName = aduser.displayname,
                                    mobile = aduser.mobile,
                                    groups = aduser.memberOf.ToArray()
                                }
                            }
                        }
                        );
                }
                catch (FaultException<Adgw.DacsUserInsertUpdate.EnqueueDacsFail> fer)
                {
                    Console.Error.WriteLine(fer.Detail.Message);
                }
            }
        }

        public void SendDeleteDacs(Umanusrlist umanusrlist)
        {
            // data: usern
            throw new NotImplementedException();
        }
    }

    internal class Program
    {


        private static void Main(string[] args)
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

            var dacsman = new Dacsman(ConfigurationManager.AppSettings["me:urlWdx"], ConfigurationManager.AppSettings["me:iepn"], ConfigurationManager.AppSettings["me:iepApikey"]);

            string[] rgforms;
            string[] rgdashboards;
            var jsonForms = uman.WbReqst("forms", "{{ companyId: {0} }}".StFormat(ConfigurationManager.AppSettings["me:companyId"]))
                .GetResponseStream().StReadAsUtf8().GetJson();
            if (HandleEr("error with getting forms: ", jsonForms)) return;

            rgforms = jsonForms["result"].Where(jtoken => jtoken["platforms"].All(jtokPlat => jtokPlat.Value<string>()!="android")).Select(jtoken => jtoken.Value<string>("name")).ToArray();

            var jsonDashboards = uman.WbReqst("dashboards", "{{ companyId: {0} }}".StFormat(ConfigurationManager.AppSettings["me:companyId"]))
                .GetResponseStream().StReadAsUtf8().GetJson();
            if (HandleEr("error with getting dashboards: ", jsonDashboards)) return;

            rgdashboards = jsonDashboards["result"].Select(jtoken => jtoken.Value<string>("name")).ToArray();

            Console.WriteLine("forms: {0}", string.Join(", ", rgforms));
            Console.WriteLine("dashboards: {0}", string.Join(", ", rgdashboards));

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
                    Console.WriteLine("creating user {0}", umanusrCreate.email);
                    var jsonCruser = uman.WbReqst("createuser", JsonConvert.SerializeObject(umanusrCreate)).GetResponseStream().StReadAsUtf8().GetJson();
                    if (HandleEr("error with creating user: ", jsonCruser)) return;

                }
                else
                {
                    // alter
                    var umanusrlist = mpMeusrByUsern[aduser.userprincipalname];
                    var umanUsrAlter = umanusrCreate.ToUmanusralter(umanusrlist.userId);

                    Console.WriteLine("altering user {0}", aduser.userprincipalname);
                    var jsonAltuser = uman.WbReqst("alteruser", JsonConvert.SerializeObject(umanUsrAlter)).GetResponseStream().StReadAsUtf8().GetJson();
                    if (HandleEr("error with altering user: ", jsonAltuser)) return;
                }
                dacsman.SendInsertUpdateDacs(aduser, umanusrCreate);
                mpMeusrByUsern.Remove(aduser.userprincipalname);
            }

            foreach (var umanusrlist in mpMeusrByUsern.Values)
            {
                // delete
                Console.WriteLine("deleting user {0}", umanusrlist.email);
                var jsonDeluser = uman.WbReqst("deleteuser", "{{ userId: {0} }}".StFormat(umanusrlist.userId)).GetResponseStream().StReadAsUtf8().GetJson();
                if (HandleEr("error with deleting user: ", jsonDeluser)) return;
                dacsman.SendDeleteDacs(umanusrlist);
            }

            Console.WriteLine("-- end of modifications --");
            Console.ReadLine();

        }

        private static bool HandleEr(string stmsg, JObject jsonForms)
        {
            if (!jsonForms.FSuccess())
            {
                Console.WriteLine(stmsg + jsonForms);
                Console.ReadLine();
                return true;
            }
            return false;
        }

        public class Adman
        {
            private readonly string domainAd; 
            private readonly string usernAdLookup; 
            private readonly string pwdUserLookup; 
            private readonly string dnAd; 
            private readonly string dnMEUserGroup; 

            public Adman(string domainAd, string usernAdLookup, string pwdUserLookup, string dnAd, string dnMeUserGroup)
            {
                this.domainAd = domainAd;
                this.usernAdLookup = usernAdLookup;
                this.pwdUserLookup = pwdUserLookup;
                this.dnAd = dnAd;
                dnMEUserGroup = dnMeUserGroup;
            }

            public List<Aduser> RgadusrRead()
            {
                var rgadusr = new List<Aduser>();

                var ldapDirectoryIdentifier = new LdapDirectoryIdentifier(domainAd);
                var networkCredential = new NetworkCredential(usernAdLookup, pwdUserLookup);
                var connection = new LdapConnection(ldapDirectoryIdentifier) {AuthType = AuthType.Basic};

                try
                {
                    connection.Bind(networkCredential);
                }
                catch (Exception exception)
                {
                    Trace.WriteLine(exception.ToString());
                }

                connection.SessionOptions.ProtocolVersion = 3;

                var request = new SearchRequest(dnAd,
                    "(&(objectClass=person)(objectClass=user)(memberOf={0}))"
                        .StFormat(dnMEUserGroup),
                    SearchScope.Subtree,
                    new[]
                    {
                        "userprincipalname", "usnchanged", "whenchanged", "pwdlastset", "objectGUID", "SAMAccountName",
                        "memberOf", "cn", "displayname", "mail", "telephonenumber", "mobile"
                    });


                var searchOptions = new SearchOptionsControl(SearchOption.DomainScope);
                request.Controls.Add(searchOptions);

                var pageResultRequestControl = new PageResultRequestControl(1000);
                request.Controls.Add(pageResultRequestControl);
                while (true)
                {
                    var searchResponse = (SearchResponse) connection.SendRequest(request);
                    var pageResponse = (PageResultResponseControl) searchResponse.Controls[0];


                    foreach (SearchResultEntry entry in searchResponse.Entries)
                    {
                        var aduser = new Aduser();
                        aduser.ParseFromEntry(entry);
                        if (!string.IsNullOrEmpty(aduser.userprincipalname))
                            rgadusr.Add(aduser);
                    }

                    if (pageResponse.Cookie.Length == 0)
                        break;

                    pageResultRequestControl.Cookie = pageResponse.Cookie;
                }

                foreach (var adusr in rgadusr)
                {
                    Console.WriteLine(adusr);
                }
                Console.WriteLine("-- end of users --");
                return rgadusr;
            }

        }

        //
        // for debug purposes - display all info of AD object
        private static void MainX(string[] args)
        {
            var domain = "argus.mebt";

            var ldapDirectoryIdentifier = new LdapDirectoryIdentifier(domain);

            var networkCredential = new NetworkCredential("zgaspar", "wapaja.115");

            var connection = new LdapConnection(ldapDirectoryIdentifier) {AuthType = AuthType.Basic};

            try
            {
                connection.Bind(networkCredential);
            }
            catch (Exception exception)
            {
                Trace.WriteLine(exception.ToString());
            }

            connection.SessionOptions.ProtocolVersion = 3;

            var request = new SearchRequest
                ("DC=meadfstest,DC=local",
                    "(&(objectClass=person)(objectClass=user)(memberOf=CN=mobilengine,CN=Users,DC=meadfstest,DC=local))", // (&(objectClass=person)(objectClass=user)) (memberOf=CN=mobilengine,CN=Users,DC=meadfstest,DC=local)  (objectClass=group)
                    SearchScope.Subtree,
                    null);


            var searchOptions = new SearchOptionsControl(SearchOption.DomainScope);
            request.Controls.Add(searchOptions);

            var pageResultRequestControl = new PageResultRequestControl(1000);
            request.Controls.Add(pageResultRequestControl);

            while (true)
            {
                var searchResponse = (SearchResponse) connection.SendRequest(request);
                var pageResponse = (PageResultResponseControl) searchResponse.Controls[0];


                foreach (SearchResultEntry entry in searchResponse.Entries)
                {
                    if (entry.Attributes.Contains("sAMAccountName") && entry.Attributes["sAMAccountName"][0].ToString() != String.Empty)
                    {
                        Console.WriteLine(entry.DistinguishedName);
                        foreach (var attr in entry.Attributes)
                        {
                            var x = (DictionaryEntry)attr;
                            var directoryAttribute = entry.Attributes[(string)x.Key];
                            foreach (var y in Enumerable.Range(0, directoryAttribute.Count))
                            {
                                Console.WriteLine("  " + x.Key + " / " + directoryAttribute[y]);
                            }
                        }
                    }
                }

                if (pageResponse.Cookie.Length == 0)
                    break;

                pageResultRequestControl.Cookie = pageResponse.Cookie;

            }


            Console.WriteLine("-- end of users --");
            Console.ReadLine();

        }
    }

}
