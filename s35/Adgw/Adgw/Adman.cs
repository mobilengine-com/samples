﻿using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.DirectoryServices.Protocols;
using System.Net;
using log4net;

namespace Adgw
{
    public class Adman
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(Adman));


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
            var connection = new LdapConnection(ldapDirectoryIdentifier) { AuthType = AuthType.Basic };

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
                var searchResponse = (SearchResponse)connection.SendRequest(request);
                var pageResponse = (PageResultResponseControl)searchResponse.Controls[0];


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
                log.Debug(adusr);
            }
            log.Debug("-- end of users --");
            return rgadusr;
        }

    }
}