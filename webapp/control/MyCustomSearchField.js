sap.ui.define([
    "sap/ui/core/Control"
],(Control)=>{
    return Control.extend("crudproject.control.MyCustomSearchField",{
        metadata: {
            properties: {
                placeholder: { type: "string", defaultValue: "Search..." },
                value: { type: "string", defaultValue: "" }
            },
            events: {
                search: {
                    parameters: {
                        query: { type: "string" }
                    }
                } 
            }
        },

        renderer: {
            render(oRM, oControl) {
                oRM.openStart("div", oControl)
                    .class("customSearchField")
                    .openEnd();

                oRM.openStart("input")
                    .attr("type", "text")
                    .attr("placeholder", oControl.getPlaceholder())
                    .attr("value", oControl.getValue())
                    .class("searchInput")
                    .openEnd()
                    .close("input");

                oRM.openStart("button")
                    .class("searchButton")
                    .openEnd();
                oRM.text("Search");
                oRM.close("button");

                oRM.close("div");
            }
        },

    })

})