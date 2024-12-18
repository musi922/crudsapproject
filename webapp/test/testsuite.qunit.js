sap.ui.define(function () {
	"use strict";

	return {
		name: "QUnit test suite for the UI5 Application: crudproject",
		defaults: {
			page: "ui5://test-resources/crudproject/Test.qunit.html?testsuite={suite}&test={name}",
			qunit: {
				version: 2
			},
			sinon: {
				version: 1
			},
			ui5: {
				language: "EN",
				theme: "sap_horizon"
			},
			coverage: {
				only: "crudproject/",
				never: "test-resources/crudproject/"
			},
			loader: {
				paths: {
					"crudproject": "../"
				}
			}
		},
		tests: {
			"unit/unitTests": {
				title: "Unit tests for crudproject"
			},
			"integration/opaTests": {
				title: "Integration tests for crudproject"
			}
		}
	};
});
