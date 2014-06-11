
package com.acme.schemas.purchase_order;

import javax.xml.bind.annotation.XmlRegistry;


/**
 * This object contains factory methods for each 
 * Java content interface and Java element interface 
 * generated in the com.acme.schemas.purchase_order package. 
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


    /**
     * Create a new ObjectFactory that can be used to create new instances of schema derived classes for package: com.acme.schemas.purchase_order
     * 
     */
    public ObjectFactory() {
    }

    /**
     * Create an instance of {@link PurchaseOrder }
     * 
     */
    public PurchaseOrder createPurchaseOrder() {
        return new PurchaseOrder();
    }

    /**
     * Create an instance of {@link PurchaseOrder.ShipTo }
     * 
     */
    public PurchaseOrder.ShipTo createPurchaseOrderShipTo() {
        return new PurchaseOrder.ShipTo();
    }

    /**
     * Create an instance of {@link PurchaseOrder.BillTo }
     * 
     */
    public PurchaseOrder.BillTo createPurchaseOrderBillTo() {
        return new PurchaseOrder.BillTo();
    }

    /**
     * Create an instance of {@link PurchaseOrder.Items }
     * 
     */
    public PurchaseOrder.Items createPurchaseOrderItems() {
        return new PurchaseOrder.Items();
    }

    /**
     * Create an instance of {@link PurchaseOrder.Items.Item }
     * 
     */
    public PurchaseOrder.Items.Item createPurchaseOrderItemsItem() {
        return new PurchaseOrder.Items.Item();
    }

}
