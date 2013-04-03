using System.ServiceProcess;

namespace TourplanDemoReceiveService
{
    static class Program
    {
        static void Main()
        {
            ServiceBase.Run(new TourplanService());
        }
    }
}
