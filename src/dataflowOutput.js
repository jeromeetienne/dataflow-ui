var Dataflow	= Dataflow	|| {}
//////////////////////////////////////////////////////////////////////////////////
//		Comment								//
//////////////////////////////////////////////////////////////////////////////////

Dataflow.Output	= function(node){
	this.uuid	= Dataflow.Utils.generateUUID()
	this.label	= 'superOutput'
	this.node	= node
	this.links	= []
}

//////////////////////////////////////////////////////////////////////////////////
//		Comment								//
//////////////////////////////////////////////////////////////////////////////////
Dataflow.Output.prototype.toJSON = function(){
	var output	= this
	var data	= {}
	data.uuid	= output.uuid
	data.label	= output.label
	return data
}


Dataflow.Output.fromJSON = function(data, node){
	var output	= new Dataflow.Output()
	output.uuid	= data.uuid
	output.node	= node
	output.label	= data.title
	return output
}

//////////////////////////////////////////////////////////////////////////////////
//		Handle Link
//////////////////////////////////////////////////////////////////////////////////
Dataflow.Output.prototype.addLink = function(link) {
	this.links.push(link)
}

Dataflow.Output.prototype.removeLink = function(link) {
	var index	= this.links.indexOf(link);
	if( index === -1 )	return
	this.links.splice(index,1)
}