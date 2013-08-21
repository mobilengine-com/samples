
package com.mobilengine.schemas.wdx;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for Kmeta.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="Kmeta">
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *     &lt;enumeration value="purchase-order"/>
 *   &lt;/restriction>
 * &lt;/simpleType>
 * </pre>
 * 
 */
@XmlType(name = "Kmeta")
@XmlEnum
public enum Kmeta {

    @XmlEnumValue("purchase-order")
    PURCHASE_ORDER("purchase-order");
    private final String value;

    Kmeta(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static Kmeta fromValue(String v) {
        for (Kmeta c: Kmeta.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
