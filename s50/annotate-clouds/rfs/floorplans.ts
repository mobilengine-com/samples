//# client program floorplans for form 'floorplans'
//using reftab floorplan;
//# using reftab ticketFormParam;

{
	Log([form]);
	Log([form.controlSubmit.parent.parent.parent]);

	let guidFloorplan = form.controlSubmit.parent.parent.parent.guid.value;
	Log([guidFloorplan]);
	
	db.ticketFormParam.InsertOrUpdate({usern: form.user.name}, {guidFloorplan: guidFloorplan, fAgain: "false"});
/*

                                                                   root:
                                                                       {
                                                                           floorplans:
                                                                               [
                                                                                   {
                                                                                       category:
                                                                                           {
                                                                                               nid: "category", 
                                                                                               npth:
                                                                                                   "floorplans/root/floorplans/floorplans<0>/category", 
                                                                                               parent: <<recursion>>, 
                                                                                               type: "label", 
                                                                                               value: ""
                                                                                           }, 
                                                                                       fileGuid:
                                                                                           {
                                                                                               nid: "fileGuid", 
                                                                                               npth:
                                                                                                   "floorplans/root/floorplans/floorplans<0>/fileGuid", 
                                                                                               parent: <<recursion>>, 
                                                                                               type: "label", 
                                                                                               value: "1385bd2de14b46869d175354ffcf0f55"
                                                                                           }, 
                                                                                       fileHash:
                                                                                           {
                                                                                               nid: "fileHash", 
                                                                                               npth:
                                                                                                   "floorplans/root/floorplans/floorplans<0>/fileHash", 
                                                                                               parent: <<recursion>>, 
                                                                                               type: "label", 
                                                                                               value: "3cff565fa49312edbe4ff3634d9ae83b"
                                                                                           }, 
                                                                                       guid:
                                                                                           {
                                                                                               nid: "guid", 
                                                                                               npth:
                                                                                                   "floorplans/root/floorplans/floorplans<0>/guid", 
                                                                                               parent: <<recursion>>, 
                                                                                               type: "label", 
                                                                                               value: "ae7116e7105443829581a9efb43bef70"
                                                                                           }, 
                                                                                       name:
                                                                                           {
                                                                                               nid: "name", 
                                                                                               npth:
                                                                                                   "floorplans/root/floorplans/floorplans<0>/name", 
                                                                                               parent: <<recursion>>, 
                                                                                               type: "label", 
                                                                                               value: "E-  P1"
                                                                                           }, 
                                                                                       nid: "floorplans<0>", 
                                                                                       npth: "floorplans/root/floorplans/floorplans<0>", 
                                                                                       panelCall:
                                                                                           [
                                                                                               {
                                                                                                   btnTickets:
                                                                                                       {
                                                                                                           nid: "btnTickets", 
                                                                                                           npth:
                                                                                                               "floorplans/root/floorplans/floorplans<0>/panelCall/panelCall<0>/btnTickets", 
                                                                                                           parent: <<recursion>>, 
                                                                                                           type: "closebutton", 
                                                                                                           value: ""
                                                                                                       }, 
                                                                                                   nid: "panelCall<0>", 
                                                                                                   npth:
                                                                                                       "floorplans/root/floorplans/floorplans<0>/panelCall/panelCall<0>", 
                                                                                                   parent: <<recursion>>, 
                                                                                              
*/
}