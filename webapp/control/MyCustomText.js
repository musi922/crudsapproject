sap.ui.define([
    "sap/ui/core/Control",
], (Control)=>{
    return Control.extend("crudproject.control.MyCustomText.js",{
        metadata: {
            properties:{
                text:{ type: "string", defaultValue:""}
            }
        },
        renderer:{
            render(oRM,oControl){
                oRM.write("<span");
                oRM.writeControlData(oControl);
                oRM.addClass("customText");
                oRM.writeClasses();
                oRM.write(">");
                oRM.writeEscaped(oControl.getText())
                oRM.write("</span>")

            }
        }

    })

})