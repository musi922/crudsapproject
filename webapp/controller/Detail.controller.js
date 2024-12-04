sap.ui.define([
    "./BaseController", 
    "sap/m/MessageBox",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel"
], function (BaseController, MessageBox, UIComponent, JSONModel,ODataModel) {
    "use strict";

    return BaseController.extend("crudproject.controller.Detail", {
        onInit: function () {
            let oRouter = UIComponent.getRouterFor(this);
            oRouter.getRoute("productDetail").attachPatternMatched(this.onProductMatched, this);
            
            let oModel = new ODataModel("http://localhost:4000/odata", {
                maxDataServiceVersion: "3.0"
            });
            this.getView().setModel(oModel);
            
        }
        ,

        onProductMatched: function(oEvent) {
            const oArguments = oEvent.getParameter("arguments");
            const productId = oArguments.ID;
            const oModel = this.getView().getModel();

            oModel.read(`/Products(${productId})`, {
                success:(data)=> {
                    this.getView().setModel(new JSONModel(data));

                    this.byId("productId").setText("Product ID: " + data.ID);
                    this.byId("productName").setText("Name: " + data.Name);
                    this.byId("productPrice").setText("Price: " + data.Price);
                    this.byId("productRating").setText("Rating: " + data.Rating);
                    this.byId("productReleaseDate").setText("Release Date: " + data.ReleaseDate);
                },
                error: function(error) {
                    MessageBox.error("There was an error fetching the product details.");
                }
            });
        }
    });
});
