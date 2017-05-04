using System;
using System.Linq;
using System.ServiceModel;
using log4net;

namespace Adgw
{
    class Dacsman
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(Dacsman));

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
                    log.Error(fer.Detail.Message);
                }
            }
        }

        public void SendDeleteDacs(Umanusrlist umanusrlist)
        {
            {
                var wdxClient = new Adgw.DacsUserDelete.WdxClient(/*binding, remoteAddressiepn, urlWdx*/);

                //Send dacs
                try
                {
                    wdxClient.EnqueueDacs(
                        new Adgw.DacsUserDelete.Dacs
                        {
                            dacsid = Guid.NewGuid().ToString("N"),
                            dtu = DateTime.UtcNow,
                            meta = Adgw.DacsUserDelete.DacsMeta.userdelete,
                            Key = authkey,
                            Content = new Adgw.DacsUserDelete.DacsContent
                            {
                                Item = new Adgw.DacsUserDelete.user()
                                {
                                    adGuid = "### not implemented ###",// TODO if needed umanusrlist.objectGUID,
                                    usern = umanusrlist.email,
                                }
                            }
                        }
                        );
                }
                catch (FaultException<Adgw.DacsUserDelete.EnqueueDacsFail> fer)
                {
                    log.Error(fer.Detail.Message);
                }
            }
        }
    }
}