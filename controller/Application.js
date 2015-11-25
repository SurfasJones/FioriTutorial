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
		},
		onDetailSavePressed: function(oEvent) {
			this._oAppModel.setProperty("/btnSaveEnabled", false); // keep it busy still  
			//  
			var oModel = this._oComponent.getModel();
			var batchChanges = [];
			oModel.clearBatch();

			var errClassCh = this._oAppModel.getProperty("/errClassCh");
			for (var key in this._oDraftModel.oData) {
				var entry = {};
				var bCon = this._oDraftModel.createBindingContext("/" + key);
				entry.ClosedCh = this._oAppModel.getProperty("/sampleCloseOnSave");
				entry.EvaluatedCh = "X";
				entry.ValidValsCh = "1";
				entry.CodeGrp1Ch = bCon.getProperty("SelSet1");
				if ((entry.Code1Ch = bCon.getProperty("Code1Ch")) === "OK") { // accept  
					entry.EvaluationCh = "A";
					entry.ErrClassCh = "";
					entry.NonconfCh = "";
				} else { // reject  
					entry.EvaluationCh = "R";
					entry.ErrClassCh = errClassCh;
					entry.NonconfCh = "1";
				}
				batchChanges.push(oModel.createBatchOperation(bCon.sPath, "MERGE", entry, undefined));
			}
			//  
			this.setDetailChangingState(false); // also clears busyForDetailChange  
			// async  
			if (batchChanges.length) {
				oModel.addBatchChangeOperations(batchChanges);
				oModel.submitBatch(function(oData, oResponse, aErrorResponses) { // request successfully sent  
					// Homework: implement error handling  
					//   1869434 - Details for working with OData $batch  
					// Homework: internationalize the below texts  
					MessageBox.show(
						oData.__batchResponses[0].__changeResponses.length +
						(oData.__batchResponses[0].__changeResponses.length <= 1 ?
							" characteristic" : " characteristics") + " updated", {
							icon: sap.m.MessageBox.Icon.SUCCESS,
							title: "Batch Update",
							actions: [sap.m.MessageBox.Action.OK]
						});
				}, function(oError) { // invalid request  
					sap.m.MessageBox.show("Invalid batch update request", {
						icon: sap.m.MessageBox.Icon.ERROR,
						title: "Batch Update",
						actions: [sap.m.MessageBox.Action.OK]
					});
				});
			}
		}
	});
});
/*     This file is part of ZTUT_QM_00 - SAPUI5 Tutoral App 
     scn.sap.com/people/laszlo.kajan/blog/2015/09/17/step-by-step-end-to-end-guide-to-building-a-sap-fiori-like-sapui5-app--part-2 
*/