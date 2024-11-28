sap.ui.define([
    "./BaseController",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (BaseController, ODataModel,Filter,FilterOperator) {
    "use strict";
    return BaseController.extend("crudproject.Categories.controller", {

        onInit: function () {
            var oModel = new ODataModel("http://localhost:5000/odata",{
                maxDataServiceVersion:"3.0"
            });
            this.getView().setModel(oModel);
            oModel.read("/Categories",{
                success(){
                    console.log("data fetched successfully");
                    
                }
            })
        },
        onSearchCategory(oEvent){
            let query = oEvent.getParameter("query")
            let list = this.byId("itemsId")
            let context = list.getBinding("items")

            let aFilters = []
            if (query) {
                aFilters.push(new Filter("Name", FilterOperator.Contains,query))
                
            }
            context.filter(aFilters)
        }, 
        onShowDetail(oEvent){
            let items = oEvent.getSource()
            let bindingContext = items.getBindingContext()
            let category = bindingContext.getObject()
            this.getRouter().navTo("categoryDetail",{
                ID:category.ID
            })

        }

    });

});