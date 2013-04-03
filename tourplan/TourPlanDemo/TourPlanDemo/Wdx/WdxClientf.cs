using System;
using System.Security.Cryptography.X509Certificates;
using System.ServiceModel;

namespace TourPlanDemo.Wdx
{
    public class Wdxclientf
    {
        private readonly string stUrl;
        private readonly X509Certificate2 cert;

        public Wdxclientf(string stUrl, X509Certificate2 cert)
        {
            this.stUrl = stUrl;
            this.cert = cert;
        }

        public WdxClient WdxClientCreate()
        {
            var securityMode = BasicHttpSecurityMode.None;

            var endpointAddress = new EndpointAddress(stUrl);
            if (endpointAddress.Uri.Scheme == Uri.UriSchemeHttps)
                securityMode = BasicHttpSecurityMode.Transport;

            var binding = new BasicHttpBinding(securityMode);
            var wdxclient = new WdxClient(binding, endpointAddress);

            if (cert != null)
            {
                binding.Security.Transport.ClientCredentialType = HttpClientCredentialType.Certificate;
                wdxclient.ClientCredentials.ClientCertificate.Certificate = cert;
            }

            return wdxclient;
        }

    }


}
