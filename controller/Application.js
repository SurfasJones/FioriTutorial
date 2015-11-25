/*     This file is part of ZTUT_QM_00 - SAPUI5 Tutoral App 
     scn.sap.com/people/laszlo.kajan/blog/2015/09/17/step-by-step-end-to-end-guide-to-building-a-sap-fiori-like-sapui5-app--part-2 
*/
sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function(Object, JSONModel, MessageBox) {
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
		},
		onDetailCancelPressed: function(oEvent) {
			this.discardDetailChanges();
		},
		discardDetailChanges: function(fnAfterDiscard) {
			var that = this;
			// Show cancel dialogue, handle response, call fnAfterDiscard if set  
			if (this._oAppModel.getProperty("/btnSaveEnabled")) {
				// Opens the confirmation dialog  
				var i18n = this._oComponent.getModel("i18n").getResourceBundle();
				MessageBox.show(i18n.getText("msgDiscardChangesQuestion"), {
					icon: MessageBox.Icon.WARNING,
					title: i18n.getText("msgDiscardChangesTitle"),
					actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
					onClose: function(oAction) {
						if (oAction === MessageBox.Action.OK) {
							// Perform clean-up actions  
							that.setDetailChangingState(false);
							//  
							if (fnAfterDiscard) {
								fnAfterDiscard();
							}
						}
					}
				});
			} else {
				if (fnAfterDiscard) {
					fnAfterDiscard();
				}
			}
		}
	});
});
/*     This file is part of ZTUT_QM_00 - SAPUI5 Tutoral App 
     scn.sap.com/people/laszlo.kajan/blog/2015/09/17/step-by-step-end-to-end-guide-to-building-a-sap-fiori-like-sapui5-app--part-2 
*/