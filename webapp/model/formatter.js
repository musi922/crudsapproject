sap.ui.define(function () {
	"use strict";

	return {
		formatValue: function (value) {
			return value && value.toUpperCase();
		},
		formatPriceState: (Price)=>{
            if (Price>20) {
                return 'red'				
            }
            else{
                return 'None'
            }
        }
	};
});