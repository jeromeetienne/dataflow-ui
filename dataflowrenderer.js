var Dataflow	= Dataflow	|| {}

Dataflow.Renderer	= function(){
	var renderer	= this;


	var domElement	= document.createElement('div')
	this.domElement	= domElement
	domElement.classList.add('dataflowContainer')
	domElement.style.width	= '100%'
	domElement.style.height	= '100%'

	// var svgElement	= document.createElement('svg')
	var svgNS	= "http://www.w3.org/2000/svg";
	var svgContainer= document.createElementNS(svgNS, 'svg')
	this.svgContainer	= svgContainer
	svgContainer.style.width	= '100%'
	svgContainer.style.height	= '100%'
	svgContainer.style.position	= 'absolute'
	// svgContainer.style.zIndex	= '100'
	this.domElement.appendChild(svgContainer)

	var nodesContainer	= document.createElement('div')
	this.nodesContainer	= nodesContainer
	nodesContainer.style.width	= '100%'
	nodesContainer.style.height	= '100%'
	nodesContainer.style.position	= 'absolute'
	this.domElement.appendChild(nodesContainer)

	//////////////////////////////////////////////////////////////////////////////////
	//		Bind Events
	//////////////////////////////////////////////////////////////////////////////////
	renderer.domElement.addEventListener('dragenter', function(event){
		// console.log('dragenter', event)
	}, false);
	renderer.domElement.addEventListener('dragover', function(event){
		// event.stopPropagation(); 
		event.preventDefault();
		// setNodePositionFromEvent(event)
	}, false);
	renderer.domElement.addEventListener('drop', function(event){

		event.stopPropagation(); 
		event.preventDefault();

		// setNodePositionFromEvent(event)
	}, false);

	function setNodePositionFromEvent(event){
		var domId	= renderer.dataTransfer.domId
		var offsetX	= renderer.dataTransfer.offsetX
		var offsetY	= renderer.dataTransfer.offsetY

		var nodeEl	= document.querySelector('#'+domId)
		var nodeId	= parseInt(nodeEl.dataset.nodeId)
		var node	= graph.getNodeById(nodeId)

		node.x	= (event.x-offsetX) / window.innerWidth
		node.y	= (event.y-offsetY) / window.innerHeight

		renderer.render(graph)		
	}
}

Dataflow.Renderer.prototype._updateNodeElement = function(node){
	var renderer	= this

	// honor .needsUpdate
	if( node.needsUpdate === false )	return
	node.needsUpdate	= false

	//////////////////////////////////////////////////////////////////////////////////
	//		Comment								//
	//////////////////////////////////////////////////////////////////////////////////
	var nodeEl	= document.createElement('div')
	node.domElement	= nodeEl

	nodeEl.classList.add('node')
	nodeEl.id	= 'node-'+node.id
	nodeEl.dataset.nodeId	= node.id
	nodeEl.setAttribute('draggable', 'true')

	var titleEl	= document.createElement('div')	
	titleEl.classList.add('title')
	titleEl.innerText	= node.title
console.log('updateNode', node.title)
	nodeEl.appendChild(titleEl)

	//////////////////////////////////////////////////////////////////////////////////
	//		Outputs
	//////////////////////////////////////////////////////////////////////////////////
	var inputsEl	= document.createElement('div')
	inputsEl.classList.add('inputs')
	nodeEl.appendChild(inputsEl)

	node._inputs.forEach(function(input){
		var inputEl	= document.createElement('div')
		inputEl.classList.add('input')
		inputEl.classList.add('input-'+input.uuid)
		inputEl.innerHTML	= '- '+input.label
		inputsEl.appendChild(inputEl)
	})

	//////////////////////////////////////////////////////////////////////////////////
	//		Inputs
	//////////////////////////////////////////////////////////////////////////////////
	var outputsEl	= document.createElement('div')
	outputsEl.classList.add('outputs')
	nodeEl.appendChild(outputsEl)

	node._outputs.forEach(function(output){
		var outputEl	= document.createElement('div')
		outputEl.classList.add('output')
		outputEl.classList.add('output-'+output.uuid)

		outputEl.innerHTML	= output.label + ' -'
		outputsEl.appendChild(outputEl)
	})

	//////////////////////////////////////////////////////////////////////////////////
	//		Comment								//
	//////////////////////////////////////////////////////////////////////////////////
	nodeEl.addEventListener('dragstart', function(event){
		var domElement	= this;
		console.log('dragstart', event)
		console.log('offsetX', event.offsetX, event.offsetY)
		event.dataTransfer.dropEffect = 'move';
		event.dataTransfer.effectAllowed = 'all';

		event.stopPropagation();

		var dataTransfer	= {}
		renderer.dataTransfer	= dataTransfer
		dataTransfer.domId	= domElement.id
		dataTransfer.offsetX	= event.offsetX
		dataTransfer.offsetY	= event.offsetY

		dragWithCustomImage(event)

		function dragWithCustomImage(event) {
			var canvas = document.createElementNS("http://www.w3.org/1999/xhtml","canvas");
			canvas.width = canvas.height = 20;

			var ctx = canvas.getContext("2d");
			ctx.lineWidth = 4;
			ctx.moveTo( 0,  0);
			ctx.lineTo(20, 20);
			ctx.moveTo( 0, 20);
			ctx.lineTo(20,  0);
			ctx.strokeStyle = '#FFF';
			ctx.stroke();

			var dragIcon = document.createElement('img');
			dragIcon.src = canvas.toDataURL();
			event.dataTransfer.setDragImage(dragIcon, 20/2, 20/2);
		}
	}, false);
}

Dataflow.Renderer.prototype.render	= function(graph){
	var renderer	= this

	graph.nodes.forEach(function(node){
		renderer._updateNodeElement(node)
	})

	this.renderNodes(graph)
	this.renderSvg(graph)
}

Dataflow.Renderer.prototype.renderNodes	= function(graph){
	var renderer	= this

	//////////////////////////////////////////////////////////////////////////////////
	//		do all the nodes
	//////////////////////////////////////////////////////////////////////////////////
	var container	= this.nodesContainer
	var containerBox= container.getBoundingClientRect()
	graph.nodes.forEach(function(node){
		var domElement	= node.domElement

		var x	= containerBox.width  * node.x
		var y	= containerBox.height * node.y

		domElement.style.left	= x+'px'
		domElement.style.top	= y+'px'

		container.appendChild(domElement)
	})
}


Dataflow.Renderer.prototype.renderSvg	= function(graph){
	var renderer	= this

	//////////////////////////////////////////////////////////////////////////////////
	//		Comment								//
	//////////////////////////////////////////////////////////////////////////////////
	var svgUtils	= new Dataflow.Renderer.SvgUtils(this.svgContainer)
	svgUtils.clear()	
	// svgUtils.drawLine(0, 0, 500, 500)

	graph.links.forEach(function(link){
		// compute x1, y1
		var node	= link.output.node
		var domElement	= node.domElement.querySelector('.output-'+link.output.uuid)
		var boundingBox	= domElement.getBoundingClientRect()
		var x1		= boundingBox.right
		var y1		= boundingBox.top + boundingBox.height/2

		// compute x2,y2
		var node	= link.input.node
		var domElement	= node.domElement.querySelector('.input-'+link.input.uuid)
		var boundingBox	= domElement.getBoundingClientRect()
		var x2		= boundingBox.left
		var y2		= boundingBox.top + boundingBox.height/2

		// actual drawLine
		svgUtils.drawLine(x1,y1,x2,y2)
	})
}

//////////////////////////////////////////////////////////////////////////////////
//		
//////////////////////////////////////////////////////////////////////////////////

Dataflow.Renderer.SvgUtils	= function(svgContainer){
	this.svgContainer	= svgContainer
}

Dataflow.Renderer.SvgUtils.prototype.clear	= function() {
	var svgContainer	= this.svgContainer
	while( svgContainer.firstChild ){
		svgContainer.removeChild(svgContainer.firstChild);
	}
}

Dataflow.Renderer.SvgUtils.prototype.drawLine	= function(x1, y1, x2, y2){
	var svgContainer	= this.svgContainer

	// build the element itself
	var svgNS	= "http://www.w3.org/2000/svg";
	var svgElement	= document.createElementNS(svgNS, 'path')
	// build the 'd' drawning command
	var commands	= []
	commands.push('M'+x1+','+y1)

	var middleX	= (x1+x2)/2
	var middleY	= (y1+y2)/2
	if( x1 < x2 ){
		var middleX	= (x1+x2)/2
		commands.push('C'+middleX+','+y1)
		commands.push(middleX+','+y2)
	}else{
		var width	= Math.abs(x2-x1)
		commands.push('C'+(x1+width)+','+middleY)
		commands.push( (x2-width) + ','+middleY)
	}

	commands.push(x2+','+y2)
	svgElement.setAttribute('d', commands.join(' '))

	// set the style
	svgElement.style.fill		= 'none'
	svgElement.style.stroke		= 'orange'
	svgElement.style.strokeWidth	= 5

	// add it to the svg container
	svgContainer.appendChild(svgElement)
}






