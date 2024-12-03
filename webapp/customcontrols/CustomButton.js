sap.ui.define([
  "sap/ui/core/Control",
  "sap/m/Button",
  "sap/m/Text"
], function (Control, Button, Text) {
  "use strict";

  return Control.extend("crudproject.customcontrols.CustomButton", {

      metadata: {
          properties: {
              "text": { type: "string", defaultValue: "Click Me" },
              "press": { type: "object" } // Event for button press
          },
          events: {
              "press": {}
          }
      },

      renderer: function (oRm, oControl) {
          oRm.write("<div>");

          // Add Text with the label
          var oText = new Text({
              text: oControl.getText()
          });
          oText.addStyleClass("customTextStyle");
          oRm.renderControl(oText);

          var oButton = new Button({
              text: "Press Me",
              press: function () {
                  oControl.firePress();
              }
          });
          oButton.addStyleClass("customButtonStyle");
          oRm.renderControl(oButton);

          oRm.write("</div>");
      }

  });
});
