/*     This file is part of ZTUT_QM_00 - SAPUI5 Tutoral App 
     scn.sap.com/people/laszlo.kajan/blog/2015/09/17/step-by-step-end-to-end-guide-to-building-a-sap-fiori-like-sapui5-app--part-2 
*/  
sap.ui.core.Control.extend("tut.qm.control.ResultControl", {  
     metadata: {  
          properties: {  
               closedch: {  
                    type: "string"  
               },  
               code1ch: {  
                    type: "string" /*, defaultValue: "0"*/  
               }, // "OK", "NOK"  
  
               okcode: "string",  
               nokcode: "string"  
          },  
          aggregations: {  
               "_hl": {  
                    type: "sap.ui.layout.HorizontalLayout",  
                    multiple: false,  
                    visibility: "hidden"  
               }  
          },  
          events: {  
               "change": { // attachChange, detachChange, fireChange  
                    parameters: {  
                         property: "string",  
                         bindingContext: "sap.ui.model.Context",  
                         bindingPath: "string",  
                         newValue: "any"  
                    }  
               }  
          }  
     },  
     init: function() {  
          var hl = new sap.ui.layout.HorizontalLayout(this.getId() + "-hl", {});  
          this.setAggregation("_hl", hl, true); /* no re-rendering needed on property change */  
  
          hl.addContent(this._rs = new sap.m.ObjectStatus(this.getId() + "-resStat", {  
               text: undefined,  
               icon: undefined  
          }));  
     },  
     exit: function() {},  
     updateAllParts: function() {  
          var that = this;  
          var closedch = this.getClosedch();  
          var code1ch = this.getCode1ch();  
          var hl = this.getAggregation("_hl");  
          var initialCode1 = !code1ch;  
          var okcode = this.getOkcode();  
          var nokcode = this.getNokcode();  
  
          if (!this._rsw) {  
               hl.insertContent(this._rsw = new sap.m.RadioButtonGroup(this.getId() + "-resSw", {  
                    columns: 1,  
                    valueState: "None",  
                    buttons: [{  
                         text: "{i18n>evalAccept}"  
                    }, {  
                         text: "{i18n>evalReject}"  
                    }],  
                    selectedIndex: 2,  
                    select: function(oEvent) {  
                         var selidx = oEvent.getParameter("selectedIndex");  
                         var newValue = selidx === 0 ? okcode : nokcode;  
                         that._rsw.setValueState(selidx === 0 ? "Success" : "Error");  
                         that._rs.setIcon("sap-icon://decision");  
  
                         that.fireChange({  
                              property: "code1ch",  
                              bindingContext: that.getBindingContext(),  
                              bindingPath: that.getBindingPath("code1ch"), // entity property name  
                              newValue: newValue  
                         });  
                    }  
               }), 0);  
          }  
          if (!initialCode1) {  
               var selidx = (code1ch === okcode) ? 0 : 1;  
               this._rsw.setSelectedIndex(selidx);  
               this._rsw.setValueState(selidx === 0 ? "Success" : "Error");  
          } else {  
               this._rsw.setSelectedIndex(2);  
               this._rsw.setValueState("Success");  
          }  
  
          if (closedch === "X") {  
               if (this._rsw) {  
                    this._rsw.setEnabled(false);  
               }  
               if (this._ri) {  
                    this._ri.setEnabled(false);  
               }  
               this._rs.setIcon("sap-icon://locked");  
          } else {  
               if (this._rsw) {  
                    this._rsw.setEnabled(true);  
               }  
               if (this._ri) {  
                    this._ri.setEnabled(true);  
               }  
               this._rs.setIcon("");  
          }  
     },  
     renderer: {  
          render: function(oRm, oControl) {  
               oControl.updateAllParts();  
               oRm.write("<div");  
               oRm.writeControlData(oControl);  
               oRm.addClass("ResultControl");  
               oRm.writeClasses();  
               oRm.write(">");  
               oRm.renderControl(oControl.getAggregation("_hl"));  
               oRm.write("</div>");  
          }  
     }  
});  
/*     This file is part of ZTUT_QM_00 - SAPUI5 Tutoral App 
     scn.sap.com/people/laszlo.kajan/blog/2015/09/17/step-by-step-end-to-end-guide-to-building-a-sap-fiori-like-sapui5-app--part-2 
*/  