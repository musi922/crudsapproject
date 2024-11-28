sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel",
], function (Controller, ODataModel) {
    "use strict";
    return Controller.extend("crudproject.CategoryDetail.controller", {

        onInit: function () {
            var oModel = new ODataModel({
                items: []
            });
            this.getView().setModel(oModel);
        }

    });

});