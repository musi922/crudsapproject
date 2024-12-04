sap.ui.define([
    "sap/ui/core/Control"
], (Control) => {
    return Control.extend("crudproject.control.MyCustomTable", {
        metadata: {
            properties: {
                title: {type:"string", defaultValue:""}
            },
            defaultAggregation: "columns",
            aggregations: {
                columns: { 
                   type:"sap.ui.core.Control",
                   multiple:true,
                   singularName:"column"
                },
                rows:{
                    type:"sap.ui.core.Control",
                    multiple:true,
                    singularName:"row"
                }
            }
        },

        renderer: {
            render(oRM, oControl) {
                oRM.openStart("table", oControl).class("customTable").openEnd()
                if (oControl.getProperty("title")) {
                    oRM.openStart("caption").openEnd().text(oControl.getProperty("title")).close("caption")  
                }
                
                const columns = oControl.getAggregation("columns") || [];
                if (columns.length>0) {
                    oRM.openStart("thead").openEnd()
                    oRM.openStart("tr").openEnd()
                    columns.forEach(column=>{
                        oRM.openStart("th").openEnd()
                        oRM.renderControl(column)
                        oRM.close("th")
                    })
                    oRM.close("tr")
                    oRM.close("thead")   
                }

                const rows = oControl.getAggregation("rows") || [];
                if (rows.length>0) {
                    oRM.openStart("tbody").openEnd()
                   rows.forEach(row=>{
                    oRM.openStart("tr").openEnd()
                    columns.forEach(()=>{
                        oRM.openStart("td").openEnd()
                        oRM.renderControl(row)
                        oRM.close("td")
                    });
                    oRM.close("tr")
                   })
                   oRM.close("tbody")
                    
                }
               
                oRM.close("table");
            }
        }
    });
});