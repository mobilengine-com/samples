using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Configuration;
using TourplanDemoReceiveService.Wdx;
using TourplanDemoReceiveService.Model;
using System.Security.Cryptography.X509Certificates;
using TourplanDemoReceiveService.Coml;

namespace TourplanDemoReceiveService
{
    public partial class TourplanService : ServiceBase
    {
        public TourplanService()
        {
            InitializeComponent();
        }

        protected override void OnStart(string[] args)
        {
            var receiveFormComli = new ReceiveFormComli();
            var urlLocal = ConfigurationManager.AppSettings.GetValues("InFrom")[0];
            string inCert = ConfigurationManager.AppSettings.GetValues("InCert")[0];
            string inCertPass = ConfigurationManager.AppSettings.GetValues("InCertPassword")[0];
            new WdxService(
                urlLocal,
                new X509Certificate2(inCert, inCertPass, X509KeyStorageFlags.MachineKeySet),
                new WdxDispatch(receiveFormComli));
        }

        protected override void OnStop()
        {
        }
    }
}
