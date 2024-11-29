sap.ui.define([
    "./BaseController", "sap/m/MessageBox",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "../model/formatter",
    "sap/ui/core/Fragment",
    "sap/ui/model/Sorter",
    "sap/ui/model/json/JSONModel",
], function (BaseController, MessageBox, ODataModel,Filter,FilterOperator,formatter,Fragment,Sorter,JSONModel) {
    "use strict";

    return BaseController.extend("crudproject.controller.Main", {
        onInit: function () {
            let oModel = new ODataModel("http://localhost:3000/odata", {
                defaultBindingMode: "TwoWay",
                useBatch: false,
                headers: {
                    "Content-Type": "application/atom+xml",
                },
                json: false,
                maxDataServiceVersion: "3.0"
            });
        
            this.getView().setModel(oModel);
        
            oModel.read("/Products", {
                urlParameters: {
                    "$expand": "Supplier"
                },
                success: (data) => {
                    let supplierData = data.results.map(product => product.Supplier ? product.Supplier : {});
                    let supplierDataModel = new JSONModel(supplierData);
                    this.getOwnerComponent().setModel(supplierDataModel, "SupplierModel");
                }
            });
        }
        ,
        onSortButtonPress(){
             if (!this.onSortDialog) {
                Fragment.load({
                    ID:this.getView().getId(),
                    name:"crudproject.view.SortDialog",
                    controller:this
                }).then(oDialog=>{
                    this.onSortDialog = oDialog                    
                    this.getView().addDependent(oDialog)
                    oDialog.open()
                })
                
             }
             else{
                this.onSortDialog.open()
             }
        },
        onconfirmSort(oEvent){
            let osortedItem = oEvent.getParameter("sortItem") //represents the sorting key to be used
            let bDescending = oEvent.getParameter("sortDescending")  //represent sorting order either ascending or descending

            this.getView().byId("odataTable").getBinding("items").sort(osortedItem ? [new Sorter(osortedItem.getKey(), bDescending)] : [])
        }
        ,
        formatter:formatter,        
        
        onNavigateToCategories(){
            let Router = this.getOwnerComponent().getRouter()
            Router.navTo("categories")

        }
        ,onSearch(oEvent){
            let query = oEvent.getParameter("query")
            let tabel = this.byId("odataTable")
            let context = tabel.getBinding("items")

            let filters = []
            if (query) {
                filters.push(new Filter("Name", FilterOperator.Contains,query))                 
            }
            context.filter(filters)
        },

        onShowData(event) {
            const Item = event.getSource();
            const bindingContext = Item.getBindingContext();
            const product = bindingContext.getObject();
            this.getRouter().navTo("productDetail",{
                ID:product.ID
            })

            
        },

        onShowProductDialog() {
            this.byId("createProductDialog").open();
        },

        onCloseProductDialog() {
            this.byId("createProductDialog").close();
        },

        onShowEditingDialog(oEvent) {
            const button = oEvent.getSource();
            const listItem = button.getParent();
            const context = listItem.getBindingContext();
            const productData = context.getObject();
            
            this._selectedProductId = productData.ID;
            
            const dialog = this.byId("updateDialog");
            this.byId("productNameText").setValue(productData.Name);
            this.byId("productPriceText").setValue(productData.Price);
            this.byId("productRatingText").setValue(productData.Rating);
            this.byId("productReleaseDateText").setValue(productData.ReleaseDate);
            
            dialog.open();
        },

        onCloseEditingDialog() {
            this.byId("updateDialog").close();
        },

        formatDateForOData(date) {
            if (!date) return null;
            // If it's already a Date object, use it; otherwise create a new Date
            const d = date instanceof Date ? date : new Date(date);
            // Format: YYYY-MM-DD
            return d.getFullYear() + '-' + 
                   String(d.getMonth() + 1).padStart(2, '0') + '-' + 
                   String(d.getDate()).padStart(2, '0');
        },

        onCreate() {
            const ID = this.byId("newProductId").getValue();
            const Name = this.byId("newProductName").getValue();
            const Price = this.byId("newProductPrice").getValue();
            const Rating = this.byId("newProductRating").getValue();
            const ReleaseDate = this.formatDateForOData(this.byId("newProductReleaseDate").getValue());

            const atomXml = `<?xml version="1.0" encoding="utf-8"?>
            <entry xmlns="http://www.w3.org/2005/Atom" xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices" xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata">
                <category term="ODataDemo.Product" scheme="http://schemas.microsoft.com/ado/2007/08/dataservices/scheme"/>
                <title type="text">${Name}</title>
                <updated>${new Date().toISOString()}</updated>
                <author><name/></author>
                <content type="application/xml">
                    <m:properties>
                        <d:ID m:type="Edm.Int32">${parseInt(ID)}</d:ID>
                        <d:Name>${Name}</d:Name>
                        <d:Description>New Product</d:Description>
                        <d:ReleaseDate m:type="Edm.DateTime">${ReleaseDate}</d:ReleaseDate>
                        <d:DiscontinuedDate m:null="true"/>
                        <d:Rating m:type="Edm.Int16">${parseInt(Rating)}</d:Rating>
                        <d:Price m:type="Edm.Double">${parseFloat(Price)}</d:Price>
                    </m:properties>
                </content>
            </entry>`;

            fetch("http://localhost:3000/odata/Products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/atom+xml",
                },
                body: atomXml
            })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(errorText => {
                        throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
                    });
                }
                MessageBox.success("Product created successfully!");
                this.onCloseProductDialog();
                this.getView().getModel().refresh(true);
            })
            .catch(error => {
                MessageBox.error("Error creating product: " + error.message);
            });
        },

        onEditPress() {
            const Name = this.byId("productNameText").getValue();
            const Price = this.byId("productPriceText").getValue();
            const Rating = this.byId("productRatingText").getValue();
            const ReleaseDate = this.formatDateForOData(this.byId("productReleaseDateText").getValue());
            const productId = this._selectedProductId;

            const atomXml = `<?xml version="1.0" encoding="utf-8"?>
            <entry xmlns="http://www.w3.org/2005/Atom" xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices" xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata">
                <category term="ODataDemo.Product" scheme="http://schemas.microsoft.com/ado/2007/08/dataservices/scheme"/>
                <title type="text">${Name}</title>
                <updated>${new Date().toISOString()}</updated>
                <author><name/></author>
                <content type="application/xml">
                    <m:properties>
                        <d:ID m:type="Edm.Int32">${productId}</d:ID>
                        <d:Name>${Name}</d:Name>
                        <d:Description>Updated Product</d:Description>
                        <d:ReleaseDate m:type="Edm.DateTime">${ReleaseDate}</d:ReleaseDate>
                        <d:DiscontinuedDate m:null="true"/>
                        <d:Rating m:type="Edm.Int16">${parseInt(Rating)}</d:Rating>
                        <d:Price m:type="Edm.Double">${parseFloat(Price)}</d:Price>
                    </m:properties>
                </content>
            </entry>`;

            fetch(`http://localhost:3000/odata/Products(${productId})`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/atom+xml",
                },
                body: atomXml
            })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(errorText => {
                        throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
                    });
                }
                MessageBox.success("Product updated successfully!");
                this.onCloseEditingDialog();
                this.getView().getModel().refresh(true);
            })
            .catch(error => {
                MessageBox.error("Error updating product: " + error.message);
            });
        },
		onDelete(oEvent){
			const item = oEvent.getSource().getParent()
			const context = item.getBindingContext()
			const productId = context.getObject().ID

			const oModel = this.getView().getModel()
			oModel.remove(`/Products(${productId})`,{
				success(){
					MessageBox.success("Product Deleted successfully!");
				},
				error(error){
					MessageBox.error("Error updating product: " + error.message);
				}

			})
		}
    });
});
