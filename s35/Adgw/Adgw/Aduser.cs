using System;
using System.DirectoryServices.Protocols;
using System.Linq;

namespace ADGW
{
    class MultiattrAttribute : Attribute
    {
    }

    class AdattrAttribute : Attribute
    {
        public readonly string stAttr;
//        public readonly bool fMulti;

        public AdattrAttribute(string stAttr/*, bool fMulti = false*/)
        {
            this.stAttr = stAttr;
//            this.fMulti = fMulti;
        }
    }

    class Aduser
    {
        [Adattr("userprincipalname")] //string-unicode
        public string userprincipalname { get; set; }

        [Adattr("usnchanged")] // interval == largeInteger 
        public string usnchanged { get; set; }
        [Adattr("whenchanged")] // String(Generalized-Time) "YYYYMMDDHHMMSS.0Z"
        public string whenchanged { get; set; }
        [Adattr("pwdlastset")] // interval == largeInteger  
        public string pwdlastset { get; set; }
        [Adattr("objectGUID")] // Object(Replica-Link) - System.Byte[]
        public string objectGUID { get; set; }
        [Adattr("SAMAccountName")] // String(Unicode)
        public string SAMAccountName { get; set; }
        [Adattr("memberOf"/*, fMulti: true*/), Multiattr] // Object(DS-DN)
        public string[] memberOf { get; set; }
        [Adattr("cn")] // common name, String(Unicode)
        public string cn { get; set; }
        [Adattr("displayname")] // String(Unicode)
        public string displayname { get; set; }
        [Adattr("mail")] // String(Unicode)
        public string mail { get; set; }
        [Adattr("telephonenumber")] // String(Unicode)
        public string telephonenumber { get; set; }
        [Adattr("mobile")] // String(Unicode)
        public string mobile { get; set; }

        public override string ToString()
        {
            return String.Format("userprincipalname: {0}, usnchanged: {1}, whenchanged: {2}, pwdlastset: {3}, objectGUID: {4}, SAMAccountName: {5}, memberOf: {6}, cn: {7}, displayname: {8}, mail: {9}, telephonenumber: {10}, mobile: {11}", userprincipalname, usnchanged, whenchanged, pwdlastset, objectGUID, SAMAccountName, memberOf == null ? "" : String.Join(", ", memberOf), cn, displayname, mail, telephonenumber, mobile);
        }

        public void ParseFromEntry(SearchResultEntry entry)
        {
            foreach (var propertyInfo in GetType().GetProperties())
            {
                var adattr = (AdattrAttribute)propertyInfo.GetCustomAttributes(typeof(AdattrAttribute), false).First();
                if (adattr != null)
                {
                    var dirattr = entry.Attributes[adattr.stAttr];
                    if (dirattr == null)
                    {
                        propertyInfo.SetValue(this, null);
                        continue;
                    }

                    if (propertyInfo.GetCustomAttributes(typeof (MultiattrAttribute), false).Any())
                    {
                        propertyInfo.SetValue(this, Enumerable.Range(0, dirattr.Count)
                            .Select(i => dirattr[i].ToString()).ToArray());
                    }
                    else
                    {
                        var o = dirattr[0];
                        propertyInfo.SetValue(this, (o is byte[] ? new Guid((byte[]) o) : o).ToString());
                    }
                }
            }
        }
    }
}