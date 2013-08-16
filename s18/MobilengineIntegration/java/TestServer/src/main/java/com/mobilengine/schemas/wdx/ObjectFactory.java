
package com.mobilengine.schemas.wdx;

import javax.xml.bind.JAXBElement;
import javax.xml.bind.annotation.XmlElementDecl;
import javax.xml.bind.annotation.XmlRegistry;
import javax.xml.namespace.QName;


/**
 * This object contains factory methods for each 
 * Java content interface and Java element interface 
 * generated in the com.mobilengine.schemas.wdx package. 
 * <p>An ObjectFactory allows you to programatically 
 * construct new instances of the Java representation 
 * for XML content. The Java representation of XML 
 * content can consist of schema derived interfaces 
 * and classes representing the binding of schema 
 * type definitions, element declarations and model 
 * groups.  Factory methods for each of these are 
 * provided in this class.
 * 
 */
@XmlRegistry
public class ObjectFactory {

    private final static QName _EnqueueDacsFail_QNAME = new QName("http://schemas.mobilengine.com/Wdx", "EnqueueDacsFail");

    /**
     * Create a new ObjectFactory that can be used to create new instances of schema derived classes for package: com.mobilengine.schemas.wdx
     * 
     */
    public ObjectFactory() {
    }

    /**
     * Create an instance of {@link EnqueueDacsResponse }
     * 
     */
    public EnqueueDacsResponse createEnqueueDacsResponse() {
        return new EnqueueDacsResponse();
    }

    /**
     * Create an instance of {@link EnqueueDacs }
     * 
     */
    public EnqueueDacs createEnqueueDacs() {
        return new EnqueueDacs();
    }

    /**
     * Create an instance of {@link Dacs }
     * 
     */
    public Dacs createDacs() {
        return new Dacs();
    }

    /**
     * Create an instance of {@link EnqueueDacsFail }
     * 
     */
    public EnqueueDacsFail createEnqueueDacsFail() {
        return new EnqueueDacsFail();
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link EnqueueDacsFail }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://schemas.mobilengine.com/Wdx", name = "EnqueueDacsFail")
    public JAXBElement<EnqueueDacsFail> createEnqueueDacsFail(EnqueueDacsFail value) {
        return new JAXBElement<EnqueueDacsFail>(_EnqueueDacsFail_QNAME, EnqueueDacsFail.class, null, value);
    }

}
