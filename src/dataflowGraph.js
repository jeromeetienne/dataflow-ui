var Dataflow	= Dataflow	|| {}

/**
 * define a dataflow graph
 */
Dataflow.Graph	= function(){
	this.nodes	= []
	this.links	= []
}

//////////////////////////////////////////////////////////////////////////////////
//		Comment								//
//////////////////////////////////////////////////////////////////////////////////
/**
 * get Dataflow.Node by its node.id
 */
Dataflow.Graph.prototype.getNodeById = function(nodeId) {
	for(var i = 0; i < this.nodes.length; i++){
		var node	= this.nodes[i]
		if( node.id === nodeId )	return node
	}
	return undefined
};



Dataflow.Graph.prototype.findInputByUUID = function(uuid){
	for(var i = 0; i < this.nodes.length; i++){
		var node	= this.nodes[i]
		for(var j = 0; j < node._inputs.length; j++){
			var input	= node._inputs[j]
			if( input.uuid === uuid )	return input
		}
	}
}


Dataflow.Graph.prototype.findOutputByUUID = function(uuid){
	for(var i = 0; i < this.nodes.length; i++){
		var node	= this.nodes[i]
		for(var j = 0; j < node._outputs.length; j++){
			var output	= node._outputs[j]
			if( output.uuid === uuid )	return output
		}
	}
}



//////////////////////////////////////////////////////////////////////////////////
//		handle nodes
//////////////////////////////////////////////////////////////////////////////////

Dataflow.Graph.prototype.addNode = function(node){
	this.nodes.push(node)
}

Dataflow.Graph.prototype.removeNode = function(node){
	var index	= this.nodes.indexOf(node);
	if( index === -1 )	return
	this.nodes.splice(index,1)
}

//////////////////////////////////////////////////////////////////////////////////
//		handle links
//////////////////////////////////////////////////////////////////////////////////

Dataflow.Graph.prototype.addLink = function(link){
	this.links.push(link)
}

Dataflow.Graph.prototype.removeLink = function(link){
	var index	= this.links.indexOf(link);
	if( index === -1 )	return
	this.links.splice(index,1)
}