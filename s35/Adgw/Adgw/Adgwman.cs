using System;
using System.Configuration;
using System.Diagnostics;
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
            var sw = new Stopwatch();
            var sw1 = new Stopwatch();
            sw.Start();
            sw1.Start();
            var adman = new Adman(
                ConfigurationManager.AppSettings["ad:domainServer"],
                ConfigurationManager.AppSettings["ad:lookupUser"],
                ConfigurationManager.AppSettings["ad:lookupUserPwd"],
                ConfigurationManager.AppSettings["ad:dnAd"],
                ConfigurationManager.AppSettings["ad:dnMEUserGroup"]
                );
            var rgadusr = adman.RgadusrRead();
            if (rgadusr == null)
                return;

            log.Debug("reading {0} users from ad in {1} msec".StFormat(rgadusr.Count, sw1.ElapsedMilliseconds));
            sw1.Reset(); sw1.Start();

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
            log.Debug("reading {0} users from uman in {1} msec".StFormat(mpMeusrByUsern.Count, sw1.ElapsedMilliseconds));
            sw1.Reset(); sw1.Start();
            int cNew = 0, cUpdate = 0, cPwdReset = 0;
            foreach (var aduser in rgadusr)
            {
                mpMeusrByUsern.Remove(aduser.userprincipalname);
                try
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
                        if (jsonCruser == null) continue;
                        dacsman.SendInsertUpdateDacs(aduser, umanusrCreate);
                        cNew ++;
                    }
                    else
                    {
                        // alter
                        bool fAlterNeeded;
                        bool fPwdReset;
                        var umanusrlist = mpMeusrByUsern[aduser.userprincipalname];
                        if (!string.IsNullOrEmpty(umanusrlist.extraData))
                        {
                            try
                            {
                                var adgwpar = JObject.Parse(umanusrlist.extraData).ToObject<Usru.Adgwpar>();
                                // send reset pwd
                                fPwdReset = long.Parse(adgwpar.pwdlastset) < long.Parse(aduser.pwdlastset);
                                if (fPwdReset)
                                {
                                    log.Debug("pwd change detected, mobile tokens have been revoked from {0}".StFormat(aduser.userprincipalname));
                                }

                                // TODO: objectGuid better handling
                                Debug.Assert(adgwpar.objectGUID == aduser.objectGUID, "should not change user principal");

                                // send only when changed (compare changed time, should get back from uman first)
                                fAlterNeeded = long.Parse(adgwpar.usnchanged) < long.Parse(aduser.usnchanged);
                                if (!fAlterNeeded)
                                {
                                    log.Debug("user {0} do not need changing, no change has been detected".StFormat(aduser.userprincipalname));
                                }
                            }
                            catch (Exception er)
                            {
                                log.Warn("user extra data cannot be parsed, user will be altered", er);
                                fAlterNeeded = true;
                                fPwdReset = true;
                            }
                        }
                        else
                        {
                            fAlterNeeded = true;
                            fPwdReset = true;
                        }

                        var umanUsrAlter = umanusrCreate;
                        umanUsrAlter.userId = umanusrlist.userId;
                        if (fAlterNeeded)
                        {
                            log.Debug("altering user {0}".StFormat(aduser.userprincipalname));
                            var jsonAltuser = uman.JsonByRequest("alteruser", JsonConvert.SerializeObject(umanUsrAlter));
                            if (jsonAltuser == null) continue; 
                            dacsman.SendInsertUpdateDacs(aduser, umanusrCreate);
                            cUpdate++;
                        }
                        if (fPwdReset)
                        {
                            log.Debug("mobtok revoke of user {0}".StFormat(aduser.userprincipalname));
                            var jsonResmobtok = uman.JsonByRequest("RevokeMobileTokensOfUser", JsonConvert.SerializeObject(new Usrid {userId = umanusrlist.userId}));
                            if (jsonResmobtok == null) continue;
                            cPwdReset++;
                        }
                    }
                }
                catch (Exception er)
                {
                    log.Error("user {0} cannot be processed due to error".StFormat(aduser.SAMAccountName), er);
                }
            }
            log.Debug("createing {0}, updating {1} users, reseting passwords: {2} through uman in {3} msec".StFormat(cNew, cUpdate, cPwdReset, sw1.ElapsedMilliseconds));
            sw1.Reset(); sw1.Start();

            int cDel = 0;
            foreach (var umanusrlist in mpMeusrByUsern.Values)
            {
                // hard delete, uncomment is thats needed
//                    log.Debug("deleting user {0}".StFormat(umanusrlist.usern));
//                    var jsonDeluser = uman.JsonByRequest("deleteuser", JsonConvert.SerializeObject(new Usrid {userId = umanusrlist.userId}));
//                    if (jsonDeluser == null) return;
                try
                {
                    var umanUsrSoftDelete = umanusrlist.UsrprmToSoftDelete();
                    log.Debug("revoking rights of user (soft delete) {0}".StFormat(umanusrlist.usern));
                    var jsonAltuser = uman.JsonByRequest("alteruser", JsonConvert.SerializeObject(umanUsrSoftDelete));
                    if (jsonAltuser == null) continue;
                    dacsman.SendDeleteDacs(umanusrlist);
                    cDel++;
                }
                catch (Exception er)
                {
                    log.Error("user delete {0} cannot be processed due to error".StFormat(umanusrlist.usern), er);
                }
            }
            log.Debug("disabling {0} users through uman in {1} msec".StFormat(cDel, sw1.ElapsedMilliseconds));
            sw1.Reset(); sw1.Start();

            log.Debug("-- end of modifications --");
            sw.Stop();
            log.Debug("Ellapsed time: {0}".StFormat(sw.Elapsed));
        }
    }
}