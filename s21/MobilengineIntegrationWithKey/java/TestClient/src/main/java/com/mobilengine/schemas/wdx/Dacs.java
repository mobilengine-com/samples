
package com.mobilengine.schemas.wdx;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;
import javax.xml.datatype.XMLGregorianCalendar;


/**
 * <p>Java class for Dacs complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="Dacs">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="Key" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="Content" type="{http://schemas.mobilengine.com/Wdx}DacsContent" minOccurs="0"/>
 *       &lt;/sequence>
 *       &lt;attribute name="dacsid" type="{http://www.w3.org/2001/XMLSchema}string" />
 *       &lt;attribute name="dtu" use="required" type="{http://www.w3.org/2001/XMLSchema}dateTime" />
 *       &lt;attribute name="meta" use="required" type="{http://schemas.mobilengine.com/Wdx}DacsMeta" />
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "Dacs", propOrder = {
    "key",
    "content"
})
public class Dacs {

    @XmlElement(name = "Key")
    protected String key;
    @XmlElement(name = "Content")
    protected DacsContent content;
    @XmlAttribute
    protected String dacsid;
    @XmlAttribute(required = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar dtu;
    @XmlAttribute(required = true)
    protected DacsMeta meta;

    /**
     * Gets the value of the key property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getKey() {
        return key;
    }

    /**
     * Sets the value of the key property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setKey(String value) {
        this.key = value;
    }

    /**
     * Gets the value of the content property.
     * 
     * @return
     *     possible object is
     *     {@link DacsContent }
     *     
     */
    public DacsContent getContent() {
        return content;
    }

    /**
     * Sets the value of the content property.
     * 
     * @param value
     *     allowed object is
     *     {@link DacsContent }
     *     
     */
    public void setContent(DacsContent value) {
        this.content = value;
    }

    /**
     * Gets the value of the dacsid property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDacsid() {
        return dacsid;
    }

    /**
     * Sets the value of the dacsid property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDacsid(String value) {
        this.dacsid = value;
    }

    /**
     * Gets the value of the dtu property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getDtu() {
        return dtu;
    }

    /**
     * Sets the value of the dtu property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setDtu(XMLGregorianCalendar value) {
        this.dtu = value;
    }

    /**
     * Gets the value of the meta property.
     * 
     * @return
     *     possible object is
     *     {@link DacsMeta }
     *     
     */
    public DacsMeta getMeta() {
        return meta;
    }

    /**
     * Sets the value of the meta property.
     * 
     * @param value
     *     allowed object is
     *     {@link DacsMeta }
     *     
     */
    public void setMeta(DacsMeta value) {
        this.meta = value;
    }

}
