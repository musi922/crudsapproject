sap.ui.define([
    "./BaseController", 
    "sap/m/MessageBox",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel"
], function (BaseController, MessageBox, UIComponent, JSONModel, ODataModel) {
    "use strict";

    return BaseController.extend("crudproject.controller.Detail", {
        onInit: function () {
            let oModel = this.getOwnerComponent().getModel("ProductModel");
            console.log("ProductModel:", oModel);
            this.getView().setModel(oModel);
            let oRouter = UIComponent.getRouterFor(this);
            oRouter.getRoute("productDetail").attachPatternMatched(this.onProductMatched, this);
        },

        onProductMatched: function(oEvent) {
            const oArguments = oEvent.getParameter("arguments");
            const productId = oArguments.ID;
            const oModel = this.getOwnerComponent().getModel("ProductModel");
        
            const modelData = oModel.getData();
            console.log("Model data:", modelData); 
            const productData = modelData.find(product => product.ProductID === parseInt(productId));
            console.log("Product data found:", productData);  
        
            if (productData) {
                this.getView().setModel(new JSONModel(productData));

                this.byId("productId").setText("Product ID: " + productData.ProductID);
                this.byId("productName").setText("Name: " + productData.Name);
                this.byId("productPrice").setText("Price: " + productData.Price);
                this.byId("productRating").setText("Rating: " + productData.Rating);
                this.byId("productReleaseDate").setText("Release Date: " + productData.ReleaseDate);
            } else {
                MessageBox.error("There was an error fetching the product details.");
            }
        }
    });
});
