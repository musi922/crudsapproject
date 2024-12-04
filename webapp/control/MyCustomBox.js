sap.ui.define([
    "sap/ui/core/Control"
], (Control) => {
    return Control.extend("crudproject.control.MyCustomBox",{
        metadata:{
            properties:{
                heading: {type:"string", defaultValue:""},
                paragraph: {type:"string", defaultValue:""}
            }
        },
        renderer:{
            render(oRM,oControl){
                oRM.openStart("div",oControl).class("myCustomDiv").openEnd()
                oRM.openStart("h1").class("myHeading").openEnd()
                oRM.text(oControl.getHeading())
                oRM.close("h1")
                oRM.openStart("p").class("myParagraph").openEnd()
                oRM.text(oControl.getParagraph())
                oRM.close("p")
                oRM.close("div")

            }
        }
    })
})