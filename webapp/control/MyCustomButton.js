const { text } = require("express")

sap.ui.define([
    "sap/ui/core/Control"
],(Control)=>{
    return Control.extend("crudproject.control.MyCustomButton",{
        metadata:{
            properties:{
                text:{type:String, defaultValue: "Button"}
            }
        }
    })

})