using System.ServiceProcess;

namespace Adgw
{
    public class AdgwService : ServiceBase
    {
        readonly Program.Procw procw = new Program.Procw();
        public AdgwService()
        {
        }

        protected override void OnStart(string[] args)
        {
            procw.Start(args);
        }

        protected override void OnStop()
        {
            procw.Stop();
        }

        private void InitializeComponent()
        {
            // 
            // AdgwService
            // 
            this.ServiceName = "AdgwService";

        }
    }
}