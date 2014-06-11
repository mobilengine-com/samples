
package com.mobilengine.schemas.wdx;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for anonymous complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType>
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="dacs" type="{http://schemas.mobilengine.com/Wdx}Dacs" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
    "dacs"
})
@XmlRootElement(name = "EnqueueDacs")
public class EnqueueDacs {

    protected Dacs dacs;

    /**
     * Gets the value of the dacs property.
     * 
     * @return
     *     possible object is
     *     {@link Dacs }
     *     
     */
    public Dacs getDacs() {
        return dacs;
    }

    /**
     * Sets the value of the dacs property.
     * 
     * @param value
     *     allowed object is
     *     {@link Dacs }
     *     
     */
    public void setDacs(Dacs value) {
        this.dacs = value;
    }

}
