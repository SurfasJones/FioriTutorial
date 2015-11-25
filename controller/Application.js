/*     This file is part of ZTUT_QM_00 - SAPUI5 Tutoral App 
     scn.sap.com/people/laszlo.kajan/blog/2015/09/17/step-by-step-end-to-end-guide-to-building-a-sap-fiori-like-sapui5-app--part-2 
*/
sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/model/json/JSONModel"
], function(Object, JSONModel) {
	"use strict";
	return Object.extend("tut.qm.controller.Application", {
		// This class serves as controller for the whole App  
		constructor: function(oComponent) {
			this._oComponent = oComponent;
		},
		init: function() {
			this._oAppModel = new JSONModel({
				applicationController: this,
				btnSaveEnabled: false,
				busyForDetailChange: false,
				errClassCh: "01", // Customization for insp. lot 030000000051  
				master2PageBusyIndicationDelay: undefined, // whatever is the element's default  
				sampleCloseOnSave: "" // [""|"X"] for testing  
			});
			this._oComponent.setModel(this._oAppModel, "appProperties");

			this._oDraftModel = new JSONModel({
				//"key": {CharDescr: "desc1", ...}          // contains changed characteristic entities  
			});
			this._oComponent.setModel(this._oDraftModel, "draftModel");
		}
	});
});
/*     This file is part of ZTUT_QM_00 - SAPUI5 Tutoral App 
     scn.sap.com/people/laszlo.kajan/blog/2015/09/17/step-by-step-end-to-end-guide-to-building-a-sap-fiori-like-sapui5-app--part-2 
*/