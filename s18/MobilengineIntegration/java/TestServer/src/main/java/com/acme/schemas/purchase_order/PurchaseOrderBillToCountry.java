
package com.acme.schemas.purchase_order;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for PurchaseOrderBillToCountry.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="PurchaseOrderBillToCountry">
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *     &lt;enumeration value="US"/>
 *     &lt;enumeration value="HU"/>
 *     &lt;enumeration value="RO"/>
 *     &lt;enumeration value="SK"/>
 *   &lt;/restriction>
 * &lt;/simpleType>
 * </pre>
 * 
 */
@XmlType(name = "PurchaseOrderBillToCountry")
@XmlEnum
public enum PurchaseOrderBillToCountry {

    US,
    HU,
    RO,
    SK;

    public String value() {
        return name();
    }

    public static PurchaseOrderBillToCountry fromValue(String v) {
        return valueOf(v);
    }

}
