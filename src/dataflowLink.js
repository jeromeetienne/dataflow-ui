var Dataflow	= Dataflow	|| {}

//////////////////////////////////////////////////////////////////////////////////
//		Comment								//
//////////////////////////////////////////////////////////////////////////////////

Dataflow.Link	= function(){
	this.uuid	= Dataflow.Utils.generateUUID()
	this.input	= null
	this.output	= null
}

//////////////////////////////////////////////////////////////////////////////////
//		Comment								//
//////////////////////////////////////////////////////////////////////////////////
Dataflow.Link.prototype.toJSON = function(){
	var link	= this
	var output	= {}
	output.uuid	= link.uuid
	output.inputUUID	= link.input.uuid
	output.outputUUID	= link.output.uuid
	return output
}

Dataflow.Link.fromJSON = function(data, graph){
	var link	= new Dataflow.Link()
	link.uuid	= data.uuid
	
	var input	= graph.findInputByUUID( data.inputUUID )
	var output	= graph.findOutputByUUID( data.outputUUID )
	link.attach(input, output)
	return link
}

//////////////////////////////////////////////////////////////////////////////////
//		Comment								//
//////////////////////////////////////////////////////////////////////////////////
Dataflow.Link.prototype.attach	= function(output, input) {
	console.log('attach', arguments)
	var link	= this

	link.output	= output
	link.input	= input

	input.addLink(link)
	output.addLink(link)

	return link
}

Dataflow.Link.prototype.detach = function() {
	var link	= this

	link.input.removeLink(link)
	link.output.removeLink(link)

	link.input	= null
	link.output	= null

	return link
}