sap.ui.define([
    "sap/ui/core/Control"
],(Control)=>{
    return Control.extend("crudproject.control.MyCustomButton",{
        metadata:{
            properties:{
                text:{ type:"String", defaultValue: "Button"}
            },
            events:{
                press:{}
            }
        },
        renderer:{
            render(oRM, oControl){
                oRM.write("<button");
                oRM.writeControlData(oControl);
                oRM.addClass("customButton");
                oRM.writeClasses();
                oRM.write(">")
                oRM.writeEscaped(oControl.getText())
                oRM.write("</button>")
            }
        },
        onclick(){
            this.firePress()
        }
    })

})