using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.DirectoryServices.Protocols;
using System.Linq;
using System.Net;
using System.Security;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace ADGW
{
    class AdattrAttribute : Attribute
    {
        public readonly string stAttr;
        public readonly bool fMulti;

        public AdattrAttribute(string stAttr, bool fMulti = false)
        {
            this.stAttr = stAttr;
            this.fMulti = fMulti;
        }
    }


    class Aduser
    {
        [Adattr("userprincipalname")] //string-unicode
        public string userprincipalname { get; set; }

        [Adattr("usnchanged")] // interval == largeInteger 
        public string usnchanged { get; set; }
        [Adattr("whenchanged")] // String(Generalized-Time) "YYYYMMDDHHMMSS.0Z"
        public string whenchanged { get; set; }
        [Adattr("pwdlastset")] // interval == largeInteger  
        public string pwdlastset { get; set; }
        [Adattr("objectGUID")] // Object(Replica-Link) - System.Byte[]
        public string objectGUID { get; set; }
        [Adattr("SAMAccountName")] // String(Unicode)
        public string SAMAccountName { get; set; }
        [Adattr("memberOf", fMulti: true)] // Object(DS-DN)
        public string[] memberOf { get; set; }
        [Adattr("cn")] // common name, String(Unicode)
        public string cn { get; set; }
        [Adattr("displayname")] // String(Unicode)
        public string displayname { get; set; }
        [Adattr("mail")] // String(Unicode)
        public string mail { get; set; }
        [Adattr("telephonenumber")] // String(Unicode)
        public string telephonenumber { get; set; }
        [Adattr("mobile")] // String(Unicode)
        public string mobile { get; set; }

        public override string ToString()
        {
            return String.Format("userprincipalname: {0}, usnchanged: {1}, whenchanged: {2}, pwdlastset: {3}, objectGUID: {4}, SAMAccountName: {5}, memberOf: {6}, cn: {7}, displayname: {8}, mail: {9}, telephonenumber: {10}, mobile: {11}", userprincipalname, usnchanged, whenchanged, pwdlastset, objectGUID, SAMAccountName, memberOf == null ? "" : String.Join(", ", memberOf), cn, displayname, mail, telephonenumber, mobile);
        }

        public void ParseFromEntry(SearchResultEntry entry)
        {
            foreach (var propertyInfo in GetType().GetProperties())
            {
                var adattr = (AdattrAttribute)propertyInfo.GetCustomAttributes(typeof(AdattrAttribute), false).First();
                if (adattr != null)
                {
                    if (entry.Attributes[adattr.stAttr] != null)
                    {
                        if (!adattr.fMulti)
                        {
                            var o = entry.Attributes[adattr.stAttr][0];
                            if (o is byte[])
                            {
                                propertyInfo.SetValue(this, new Guid((byte[]) o).ToString());
                            }
                            else
                            {
                                propertyInfo.SetValue(this, o.ToString());
                            }
                        }
                        else
                        {
                            var rgst = Enumerable.Range(0, entry.Attributes[adattr.stAttr].Count).Select(i => entry.Attributes[adattr.stAttr][i].ToString()).ToArray();
                            propertyInfo.SetValue(this, rgst);
                        }
                    }
                }


            }
        }
    }

    internal class Program
    {


        private static void Main(string[] args)
        {
            var domain = ConfigurationManager.AppSettings["ad:domain"];

            var ldapDirectoryIdentifier = new LdapDirectoryIdentifier(domain);

            var networkCredential = new NetworkCredential(ConfigurationManager.AppSettings["ad:lookupUser"], ConfigurationManager.AppSettings["ad:lookupUserPwd"]);

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
                    "(&(objectClass=person)(objectClass=user)(memberOf={0}))".StFormat(ConfigurationManager.AppSettings["ad:userGroupDistinguishedName"]), 
                    SearchScope.Subtree,
                    new[] { "userprincipalname", "usnchanged", "whenchanged", "pwdlastset", "objectGUID", "SAMAccountName", "memberOf", "cn", "displayname", "mail", "telephonenumber", "mobile" });


            var searchOptions = new SearchOptionsControl(SearchOption.DomainScope);
            request.Controls.Add(searchOptions);
            
            var pageResultRequestControl = new PageResultRequestControl(1000);
            request.Controls.Add(pageResultRequestControl);
            var rgadusr = new List<Aduser>();
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

            var uman = new Uman(ConfigurationManager.AppSettings["me:urlUman"], ConfigurationManager.AppSettings["me:usernpwdDev"]);

            var jsonUsers = uman.WbReqst("users", "{{ companyId: {0} }}".StFormat(ConfigurationManager.AppSettings["me:companyId"]))
                .GetResponseStream().StReadAsUtf8().GetJson();
            Console.WriteLine( jsonUsers  );
            Console.WriteLine("-- end of response --");

            var rgmeusers = new HashSet<string>();
            foreach (var jtoken in jsonUsers["result"])
            {
                Console.WriteLine("usern: {0}", jtoken["email"]);
                Console.WriteLine("issuer: {0}", jtoken.Value<string>("idpIssuer"));
                if (jtoken.Value<string>("idpIssuer") == ConfigurationManager.AppSettings["me:issuer"])
                {
                    rgmeusers.Add(jtoken.Value<string>("email"));
                }
            }

            foreach (var aduser in rgadusr)
            {
                if (!rgmeusers.Contains(aduser.userprincipalname))
                {
                    // create
                    Console.WriteLine("creating user {0}", aduser.userprincipalname);
                    var createuserpars = JsonConvert.SerializeObject(Umanusr.UmanusrFromAduser(aduser), formatting: Formatting.Indented);
                    Console.WriteLine(createuserpars);
                    Console.WriteLine("creating user: {0}".StFormat(
                            uman.WbReqst("createuser",
                                createuserpars
                            ).GetResponseStream().StReadAsUtf8().GetJson()
                        ));

                }
                else
                {
                    // alter
                    Console.WriteLine("altering user {0}", aduser.userprincipalname);
                }
                rgmeusers.Remove(aduser.userprincipalname);
            }

            foreach (var usernToDel in rgmeusers)
            {
                // delete
                Console.WriteLine("deleting user {0}", usernToDel);
            }

            Console.WriteLine("-- end of modifications --");
            Console.ReadLine();

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
