var Dataflow	= Dataflow	|| {}

//////////////////////////////////////////////////////////////////////////////////
//		Comment								//
//////////////////////////////////////////////////////////////////////////////////
Dataflow.Input	= function(node){
	this.uuid	= Dataflow.Utils.generateUUID()
	this.node	= node
	this.label	= 'superInput'
	this.links	= []
}

//////////////////////////////////////////////////////////////////////////////////
//		Comment								//
//////////////////////////////////////////////////////////////////////////////////
Dataflow.Input.prototype.toJSON = function(){
	var input	= this
	var data	= {}
	data.uuid	= input.uuid
	data.label	= input.label
	return data
}


Dataflow.Input.fromJSON = function(data, node){
	var input	= new Dataflow.Input()
	input.uuid	= data.uuid
	input.node	= node
	input.label	= data.title
	return input
}


//////////////////////////////////////////////////////////////////////////////////
//		Handle Links
//////////////////////////////////////////////////////////////////////////////////

Dataflow.Input.prototype.addLink = function(link) {
	this.links.push(link)
}

Dataflow.Input.prototype.removeLink = function(link) {
	var index	= this.links.indexOf(link);
	if( index === -1 )	return
	this.links.splice(index,1)
}