var Dataflow	= Dataflow	|| {}

//////////////////////////////////////////////////////////////////////////////////
//		Comment								//
//////////////////////////////////////////////////////////////////////////////////

Dataflow.Link	= function(){
	this.uuid	= Dataflow.Utils.generateUUID()
	this.input	= null
	this.output	= null
}

Dataflow.Link.prototype.attach	= function(output, input) {
	// console.log('attach', arguments)
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