var Dataflow	= Dataflow	|| {}


//////////////////////////////////////////////////////////////////////////////////
//		Comment								//
//////////////////////////////////////////////////////////////////////////////////

Dataflow.Node	= function(){
	this.title	= 'superTitle'
	this.id		= (++Dataflow.Node.Counter)
	this.uuid	= Dataflow.Utils.generateUUID()
	this._inputs	= []
	this._outputs	= []

	this.x		= 0
	this.y		= 0

	this.userData	= {}

	this.domElement	= null

	this.needsUpdate= true
}

Dataflow.Node.Counter	= 0

//////////////////////////////////////////////////////////////////////////////////
//		Comment								//
//////////////////////////////////////////////////////////////////////////////////

Dataflow.Node.prototype.toJSON = function(){
	var node	= this
	var data	= {}
	data.title	= node.title
	data.uuid	= node.uuid
	data.x		= node.x
	data.y		= node.y

	data.inputs	= []
	node._inputs.forEach(function(input){
		data.inputs.push( input.toJSON() )
	})

	data.outputs	= []
	node._outputs.forEach(function(output){
		data.outputs.push( output.toJSON() )
	})

	return data
}

Dataflow.Node.fromJSON = function(data){
	var node	= new Dataflow.Node()
	node.title	= data.title
	node.uuid	= data.uuid
	node.x		= data.x
	node.y		= data.y

	data.inputs.forEach(function(inputJSON){
		node.addInput( Dataflow.Input.fromJSON( inputJSON, node) )
	})
	data.outputs.forEach(function(outputJSON){
		node.addOutput( Dataflow.Output.fromJSON( outputJSON, node) )
	})
	return node
}

//////////////////////////////////////////////////////////////////////////////////
//		Comment								//
//////////////////////////////////////////////////////////////////////////////////
Dataflow.Node.prototype.findInputByLabel = function(label){
	for(var i = 0; i < this._inputs.length; i++){
		var input	= this._inputs[i]
		if( input.label === label )	return input
	}
}

Dataflow.Node.prototype.findOutputByLabel = function(label){
	for(var i = 0; i < this._outputs.length; i++){
		var output	= this._outputs[i]
		if( output.label === label )	return output
	}
}


Dataflow.Node.prototype.set	= function(options){
	var node	= this

	if( options.title !== undefined )	node.title	= options.title

	if( options.x !== undefined )	node.x	= options.x
	if( options.y !== undefined )	node.y	= options.y

	if( options.inputs ){
		options.inputs.forEach(function(label){
			var input	= new Dataflow.Input(node)
			input.label	= label
			node.addInput(input)
		})
	}

	if( options.outputs ){
		options.outputs.forEach(function(label){
			var output	= new Dataflow.Output(node)
			output.label	= label
			node.addOutput(output)
		})
	}

	node.needsUpdate= true
	// node.update()
}


Dataflow.Node.prototype.getInputByLabel = function(label) {
	for(var i = 0; i < this._inputs.length; i++){
		var input	= this._inputs[i]
		if( input.label === label )	return input
	}
	return undefined
}



Dataflow.Node.prototype.getOutputByLabel = function(label) {
	for(var i = 0; i < this._outputs.length; i++){
		var output	= this._outputs[i]
		if( output.label === label )	return output
	}
	return undefined
}

Dataflow.Node.prototype.addInput = function(input){
	this._inputs.push(input)
}

Dataflow.Node.prototype.removeInput = function(input){
	var index	= this._inputs.indexOf(input);
	if( index === -1 )	return
	this._inputs.splice(index,1)
}


Dataflow.Node.prototype.addOutput = function(output){
	this._outputs.push(output)
}

Dataflow.Node.prototype.removeOutput = function(output){
	var index	= this._outputs.indexOf(output);
	if( index === -1 )	return
	this._outputs.splice(index,1)
}

