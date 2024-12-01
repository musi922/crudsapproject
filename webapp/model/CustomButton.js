sap.ui.define([
    "sap/ui/Button"
],(Button)=>{
return Button.extend("crudproject.model.CustomButton",{
    metadata:{
        properties:{
            backgroundColor:{type:"string", defaultValue:"blue"},
        }
    },
    renderer:{
        render(oRm,oControl){
            oRm.openStart("button", oControl)
            oRm.class("sapMBtn")
            oRm.style("background-color",oControl.getBackgroundColor())
            oRm.openEnd()

            oRm.openStart("span")
            oRm.class("sapMBtnText")
            oRm.openEnd()
            



        }

    }
})
})