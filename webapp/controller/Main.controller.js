sap.ui.define([
    "./BaseController", "sap/m/MessageBox",
    "sap/ui/model/odata/v2/ODataModel"
], function (BaseController, MessageBox, ODataModel) {
    "use strict";

    return BaseController.extend("crudproject.controller.Main", {
        onInit() {
            let oModel = new ODataModel("http://localhost:5000/odata", {
                defaultBindingMode: "TwoWay",
                useBatch: false,
                headers: {
                    "Content-Type": "application/atom+xml", // Ensure the Content-Type is set to Atom XML
                },
                json: false,
                maxDataServiceVersion: "3.0"
            });
            this.getView().setModel(oModel);
			oModel.read("/Categories",{
				success(data){
					console.log(data);
				}
			})
        },

        onShowData(event) {
            const Item = event.getSource();
            const bindingContext = Item.getBindingContext();
            const category = bindingContext.getObject();

            const categoryIdText = this.byId("categoryId");
            const categoryName = this.byId("categoryName");

            categoryIdText.setText("Category Id : " + category.ID);
            categoryName.setText("Category Name : " + category.Name);

            MessageBox.show("Selected Category " + category.Name);
        },

        onShowCategoryDialog() {
            this.byId("createCategoryDialog").open();
        },

        onCloseCategoryDialog() {
            this.byId("createCategoryDialog").close();
        },

        onShowEditingDialog(oEvent) {
            // Get the selected item's data
            const button = oEvent.getSource();
            const listItem = button.getParent();
            const context = listItem.getBindingContext();
            const categoryData = context.getObject();
            
            // Store the selected category ID for later use
            this._selectedCategoryId = categoryData.ID;
            
            // Set the current name in the input field
            const dialog = this.byId("updateDialog");
            this.byId("categoryNameTexts").setValue(categoryData.Name);
            
            dialog.open();
        },

        onCloseEditingDialog() {
            this.byId("updateDialog").close();
        },

		onCreate: function () {
			let ID = this.getView().byId("categoryIdNumber").getValue();
			let Name = this.getView().byId("categoryNameText").getValue();
		
			// Corrected Atom XML payload with a single 'entry' element
			let atomXml = `<?xml version="1.0" encoding="utf-8"?>
			<entry xmlns="http://www.w3.org/2005/Atom" xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices" xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata">
				<id>http://localhost:5000/odata/Categories(${parseInt(ID)})</id>
				<category term="ODataDemo.Category" scheme="http://schemas.microsoft.com/ado/2007/08/dataservices/scheme" />
				<link rel="edit" title="Category" href="Categories(${parseInt(ID)})" />
				<title type="text">${Name}</title>
				<updated>${new Date().toISOString()}</updated>
				<author>
					<name />
				</author>
				<content type="application/xml">
					<m:properties>
						<d:ID m:type="Edm.Int32">${parseInt(ID)}</d:ID>
						<d:Name>${Name}</d:Name>
					</m:properties>
				</content>
			</entry>`;
		
			console.log(atomXml);
			
			// Send the request using fetch with Atom XML
			fetch("http://localhost:5000/odata/Categories", {
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
				return response.json();  // Assuming the server responds with JSON
			})
			.then(data => {
				MessageBox.success("Category created successfully!");
				this.onCloseCategoryDialog(); // Close dialog on success
			})
			.catch(error => {
				MessageBox.error("There was an error creating the category: " + error.message);
			});
		}
		
,		

        onEditPress() {
            const newName = this.byId("categoryNameTexts").getValue();
            const categoryId = this._selectedCategoryId;

            // Create Atom XML payload for update
            const atomXml = `<?xml version="1.0" encoding="utf-8"?>
            <entry xmlns="http://www.w3.org/2005/Atom" xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices" xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata">
                <id>http://localhost:5000/odata/Categories(${categoryId})</id>
                <category term="ODataDemo.Category" scheme="http://schemas.microsoft.com/ado/2007/08/dataservices/scheme" />
                <link rel="edit" title="Category" href="Categories(${categoryId})" />
                <title type="text">${newName}</title>
                <updated>${new Date().toISOString()}</updated>
                <author>
                    <name />
                </author>
                <content type="application/xml">
                    <m:properties>
                        <d:ID m:type="Edm.Int32">${categoryId}</d:ID>
                        <d:Name>${newName}</d:Name>
                    </m:properties>
                </content>
            </entry>`;

            // Send update request using fetch
            fetch(`http://localhost:5000/odata/Categories(${categoryId})`, {
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
                MessageBox.success("Category updated successfully!");
                this.onCloseEditingDialog();
                // Refresh the table data
                this.getView().getModel().refresh(true);
            })
            .catch(error => {
                MessageBox.error("Error updating category: " + error.message);
            });
        }
    });
});
