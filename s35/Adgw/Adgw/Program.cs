using System;
using System.Collections;
using System.Configuration;
using System.Diagnostics;
using System.DirectoryServices.Protocols;
using System.Linq;
using System.Net;
using System.ServiceProcess;
using System.Threading;
using System.Threading.Tasks;
using log4net;
using log4net.Config;

namespace Adgw
{
    internal class Program
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(Program));

        static void Main(string[] args)
        {
            LogManager.GetLogger("initialise logging system");
            XmlConfigurator.Configure();
            log.Info("Starting adgw");

            AppDomain.CurrentDomain.UnhandledException += (_, unhandledExceptionEventArgs) =>
               log.Fatal("Unhandled exception, AppDomain will be terminated: {0}".StFormat(unhandledExceptionEventArgs.ExceptionObject.ToString()));

            if (!Environment.UserInteractive)
            {
                log.Info("as service");
                // running as service
                using (var service = new AdgwService())
                    ServiceBase.Run(service);
            } else {
                log.Info("as console app");
                var procw = new Procw();
                // running as console app
                procw.Process();

                Console.WriteLine("Press enter to stop...");
                Console.ReadLine();

            }
        }


        public class Procw
        {
            private static readonly ILog log = LogManager.GetLogger(typeof(Procw));

            private Task taskProcess;
            private CancellationTokenSource cantosoTaskProcess;

            public async Task DoWorkAsync(CancellationToken token)
            {
                while (true)
                {
                    try
                    {
                        log.Debug("processing");
                        Process();
                    }
                    catch (Exception e)
                    {
                        log.Error("error while processing", e);
                    }
                    var minDelay = int.Parse(ConfigurationManager.AppSettings["minDelay"]);
                    log.Debug("waiting {0} mins".StFormat(minDelay));
                    await Task.Delay(TimeSpan.FromMinutes(minDelay), token);
                    log.Debug("done waiting");
                }
            }

            public void Start(string[] args)
            {
                // onstart code here
                cantosoTaskProcess = new CancellationTokenSource();
                taskProcess = Task.Run(() => DoWorkAsync(cantosoTaskProcess.Token));
            }

            public void Process()
            {
                var adgw = new Adgwman();
                adgw.FullSyncAdToME();
            }


            public void Stop()
            {
                // onstop code here
                cantosoTaskProcess.Cancel();
                try
                {
                    taskProcess.Wait();
                }
                catch (Exception e)
                {
                    // handle exeption
                }
            }
        }

        //
        // for debug purposes - display all info of AD object
        //
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
