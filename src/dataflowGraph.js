var Dataflow	= Dataflow	|| {}

/**
 * define a dataflow graph
 */
Dataflow.Graph	= function(){
	this.nodes	= []
	this.links	= []
}

//////////////////////////////////////////////////////////////////////////////////
//		toJSON/fromJSON
//////////////////////////////////////////////////////////////////////////////////

Dataflow.Graph.prototype.toJSON = function(){
	var graph	= this
	var output	= {}

	output.nodes	= []
	graph.nodes.forEach(function(node){
		output.nodes.push( node.toJSON() )
	})

	output.links	= []
	graph.links.forEach(function(link){
		output.links.push( link.toJSON() )
	})
	return output
}

Dataflow.Graph.fromJSON = function(output){

	var graph	= new Dataflow.Graph()
	output.nodes.forEach(function(nodeJson){
		var node	= Dataflow.Node.fromJSON(nodeJson)
		graph.addNode( node )
	})

	output.links.forEach(function(linkJson){
		var link	= Dataflow.Link.fromJSON(linkJson, graph)
		graph.addLink( link )
	})

	return graph
};

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