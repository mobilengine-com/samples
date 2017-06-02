using System;
using System.IO;
using System.Net;
using System.Text;
using log4net;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Adgw
{
    /// <summary>
    /// Indicates that the marked method builds string by format pattern and (optional) arguments.
    /// Parameter, which contains format string, should be given in constructor. The format string
    /// should be in <see cref="string.Format(IFormatProvider,string,object[])"/>-like form
    /// </summary>
    /// <example><code>
    /// [StringFormatMethod("message")]
    /// public void ShowError(string message, params object[] args) { /* do something */ }
    /// public void Foo() {
    ///   ShowError("Failed: {0}"); // Warning: Non-existing argument in format string
    /// }
    /// </code></example>
    [AttributeUsage(
      AttributeTargets.Constructor | AttributeTargets.Method,
      AllowMultiple = false, Inherited = true)]
    public sealed class StringFormatMethodAttribute : Attribute
    {
        /// <param name="formatParameterName">
        /// Specifies which parameter of an annotated method should be treated as format-string
        /// </param>
        public StringFormatMethodAttribute(string formatParameterName)
        {
            FormatParameterName = formatParameterName;
        }

        public string FormatParameterName { get; private set; }
    }

    public static class Ext
    {


        [StringFormatMethod("stFormat")]
        public static string StFormat(this string stFormat, params object[] args)
        {
            return String.Format(stFormat, args);
        }

        public static JObject GetJson(this string stJ)
        {
            var jO = JsonConvert.DeserializeObject<JObject>(stJ);
            var jTmsg = jO["message"];
            if (jTmsg != null)
                jO.Property("message").Value = jTmsg.Value<string>().Split('\n')[0];
            var jTRst = jO["result"];
            if (jTRst != null && jTRst.HasValues)
            {
                if (jO.SelectToken("result.created") != null)
                    jO.SelectToken("result.created").Parent.Remove();
            }
            return jO;
        }

        public static bool FSuccess(this JObject jO)
        {
            if (jO["resultCode"] == null)
                return false;
            return jO["resultCode"].Value<int>() == 0;
        }

        public static string StReadAsUtf8(this Stream strm)
        {
            using (var sr = new StreamReader(strm, Encoding.UTF8))
            {
                return sr.ReadToEnd();
            }
        }
    }

    public class Uman
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(Uman));

        private string urlUman;
        private string stUsrnPwd;

        public Uman(string urlUman, string stUsrnPwd)
        {
            this.urlUman = urlUman;
            this.stUsrnPwd = stUsrnPwd;
        }

        public HttpWebResponse WbReqst(string action, string stJson)
        {
            var url = urlUman + action;
            //Console.WriteLine(url);
            var req = (HttpWebRequest)WebRequest.Create(url);

            var rgUsr = stUsrnPwd.Split('/');
            var encoded = Convert.ToBase64String(Encoding.GetEncoding("ISO-8859-1").GetBytes(rgUsr[0] + ":" + rgUsr[1]));
            req.Headers.Add("Authorization", "Basic " + encoded);

            var postData = stJson;
            var data = Encoding.UTF8.GetBytes(postData);
            req.Method = "POST";
            req.ContentType = "application/json";
            req.ContentLength = data.Length;

            using (var stream = req.GetRequestStream())
                stream.Write(data, 0, data.Length);

            try
            {
                var httpWebResponse = (HttpWebResponse)req.GetResponse();
                if (httpWebResponse.StatusCode != HttpStatusCode.OK)
                {
                    throw new Exception("Uman error " + httpWebResponse.StatusCode + ": " + httpWebResponse.GetResponseStream().StReadAsUtf8());
                }
                return httpWebResponse;
            }
            catch (WebException wer)
            {
                if (wer.Response != null)
                    throw new Exception("Uman error " + wer.Status + ": " + wer.Response.GetResponseStream().StReadAsUtf8());

                throw;
            }
        }

        public JObject JsonByRequest(string action, string content)
        {
            try
            {
                var json = WbReqst(action, content).GetResponseStream().StReadAsUtf8().GetJson();

                if (!json.FSuccess())
                {
                    log.Debug("error with {0} / {1}: {2}".StFormat(action, content, json));
                    return null;
                }
                return json;
            }
            catch (Exception er)
            {
                log.Debug("error with {0} / {1}: {2}".StFormat(action, content, er.ToString()));
                return null;
            }
        }
    }

}
