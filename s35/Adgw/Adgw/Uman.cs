using System;
using System.IO;
using System.Net;
using System.Text;
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

/*        public static HttpStatusCode GetStatusCode(this string stC)
        {
            var htsc = stC.ParseKOrNil<HttpStatusCode>();
            Assert.That(htsc != null, "Not A Valid Http Status Code: '{0}'".StFormat(stC));
            return htsc.Value;
        }*/

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
                return (HttpWebResponse)req.GetResponse();
            }
            catch (WebException wer)
            {
                if (wer.Response != null)
                    return (HttpWebResponse)wer.Response;

                throw;
            }
        }

        /*
        public int GetRespValue(HttpWebResponse hwresp)
        {
            var stResp = StReadAsUtf8(hwresp.GetResponseStream());
            Assert.That(hwresp.StatusCode, Is.EqualTo(HttpStatusCode.OK), "Unexpected reponse: {0}({1}\n{2}",
                hwresp.StatusCode, hwresp.StatusDescription, stResp);

            return stResp.GetJson().GetResultId();
        }

        public void CheckErrors(string sthwr, Table t)
        {
            var rgStErrFromSthwr = sthwr.Split('\n');
            Assert.That(rgStErrFromSthwr.Count() == t.RowCount, "Count Mismatch Expected: {0} , But Was: {1}".StFormat(t.RowCount, rgStErrFromSthwr.Count()));
            for (var i = 0; i < t.Rows.Count; i++)
                Assert.That(rgStErrFromSthwr[i], Is.EqualTo(t.Rows[i].Values.First()));
        }

        public string ReplaceFromMp(string stJson)
        {
            var match = reg.Match(stJson);
            if (!match.Success)
                return stJson;
            var stMatch = match.Value;
            stJson = stJson.Replace("\"{0}\"".StFormat(stMatch), mpIdByStName[stMatch].ToString());
            return stJson;
        }
        */


    }

}
