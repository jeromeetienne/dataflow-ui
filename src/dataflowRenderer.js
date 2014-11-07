var Dataflow	= Dataflow	|| {}

Dataflow.Renderer	= function(){
	var renderer	= this;

	renderer.dataTransfer	= {}

	var domElement	= document.createElement('div')
	this.domElement	= domElement
	domElement.classList.add('dataflowContainer')
	domElement.style.width	= '100%'
	domElement.style.height	= '100%'

	// var svgElement	= document.createElement('svg')
	var svgNS	= "http://www.w3.org/2000/svg";
	var svgContainer= document.createElementNS(svgNS, 'svg')
	renderer.svgContainer	= svgContainer
	svgContainer.style.width	= '100%'
	svgContainer.style.height	= '100%'
	svgContainer.style.position	= 'absolute'
	// svgContainer.style.zIndex	= '100'
	renderer.domElement.appendChild(svgContainer)

	var nodesContainer	= document.createElement('div')
	renderer.nodesContainer	= nodesContainer
	nodesContainer.style.width	= '100%'
	nodesContainer.style.height	= '100%'
	nodesContainer.style.position	= 'absolute'
	renderer.domElement.appendChild(nodesContainer)



	renderer.svgUtils	= new Dataflow.Renderer.SvgUtils(svgContainer)

	//////////////////////////////////////////////////////////////////////////////////
	//		Bind Events
	//////////////////////////////////////////////////////////////////////////////////
	renderer.domElement.addEventListener('dragenter', function(event){
		// console.log('dragenter', event)
	}, false);
	renderer.domElement.addEventListener('dragover', function(event){
		event.preventDefault();

		var dataTransfer	= renderer.dataTransfer
		if( dataTransfer.type === 'draggingNode' ){
			onDraggingNode(event)
		}else if( dataTransfer.type === 'draggingOutput' ){
			onDraggingOutput(event)
		}else if( dataTransfer.type === 'draggingInput' ){
			onDraggingInput(event)
		}
	}, false);
	renderer.domElement.addEventListener('drop', function(event){
		event.preventDefault();
		event.stopPropagation(); 

		var dataTransfer	= renderer.dataTransfer
		if( dataTransfer.type === 'draggingNode' ){
			onDraggingNode(event)
			renderer.dataTransfer	= {}
		}else if( dataTransfer.type === 'draggingOutput' ){
			renderer.render(graph)
		}else if( dataTransfer.type === 'draggingInput' ){
			renderer.render(graph)
		}

	}, false);

	function onDraggingInput(event){
		// render to get the new position
		renderer.render(graph)	

		var dataTransfer= renderer.dataTransfer
		var inputUUID	= dataTransfer.inputUUID
		var input	= graph.findInputByUUID(inputUUID)
		// compute x1, y1
		var node	= input.node
		var domElement	= node.domElement.querySelector('.input-'+input.uuid)
		var boundingBox	= domElement.getBoundingClientRect()
		var x2		= boundingBox.left
		var y2		= boundingBox.top + boundingBox.height/2

		// compute x2,y2
		var x1		= event.x
		var y1		= event.y
		// actual drawLine
		renderer.svgUtils.drawLine(x1,y1,x2,y2, 'cyan')
	}

	function onDraggingOutput(event){
		// render to get the new position
		renderer.render(graph)	

		var dataTransfer= renderer.dataTransfer
		var outputUUID	= dataTransfer.outputUUID
		var output	= graph.findOutputByUUID(outputUUID)
		// compute x1, y1
		var node	= output.node
		var domElement	= node.domElement.querySelector('.output-'+output.uuid)
		var boundingBox	= domElement.getBoundingClientRect()
		var x1		= boundingBox.right
		var y1		= boundingBox.top + boundingBox.height/2

		// compute x2,y2
		var x2		= event.x
		var y2		= event.y
		// actual drawLine
		renderer.svgUtils.drawLine(x1,y1,x2,y2, 'cyan')
	}

	function onDraggingNode(event){
		var domId	= renderer.dataTransfer.domId
		var offsetX	= renderer.dataTransfer.offsetX
		var offsetY	= renderer.dataTransfer.offsetY

		var domElement	= document.querySelector('#'+domId)
		var nodeId	= parseInt(domElement.dataset.nodeId)
		var node	= graph.getNodeById(nodeId)
// TODO here graph isnt defined. this is a global due to index.html
		var boundingBox	= domElement.getBoundingClientRect()

		node.x	= (event.x-offsetX+boundingBox.width /2) / window.innerWidth
		node.y	= (event.y-offsetY+boundingBox.height/2) / window.innerHeight

		// render to get the new position
		renderer.render(graph)	
	}
}
Dataflow.Renderer.prototype.render	= function(graph){
	var renderer	= this

	graph.nodes.forEach(function(node){
		renderer._updateNodeElement(graph, node)
	})

	this.renderNodes(graph)
	this.renderSvg(graph)
}

Dataflow.Renderer.prototype.renderNodes	= function(graph){
	var renderer	= this

	//////////////////////////////////////////////////////////////////////////////////
	//		set position of all domElements for graph.nodes
	//////////////////////////////////////////////////////////////////////////////////
	var container	= this.nodesContainer
	var containerBox= container.getBoundingClientRect()
	graph.nodes.forEach(function(node){
		var domElement	= node.domElement
		var boundingBox	= domElement.getBoundingClientRect()

		var x	= containerBox.width  * node.x - boundingBox.width /2
		var y	= containerBox.height * node.y - boundingBox.height/2

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
//		Comment								//
//////////////////////////////////////////////////////////////////////////////////



Dataflow.Renderer.prototype._updateNodeElement = function(graph, node){
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
	titleEl.innerHTML	= node.title
	nodeEl.appendChild(titleEl)

	//////////////////////////////////////////////////////////////////////////////////
	//		handle ioMenu
	//////////////////////////////////////////////////////////////////////////////////

	function onRemoveAllLinks(links){
		// dusplicate links list and then detach and remove all links
		links.slice().forEach(function(link){
			link.detach()
			graph.removeLink(link)
		})
		// render the graph
		renderer.render(graph)	
	}
	//////////////////////////////////////////////////////////////////////////////////
	//		Outputs
	//////////////////////////////////////////////////////////////////////////////////
	var inputsEl	= document.createElement('div')
	inputsEl.classList.add('inputs')
	nodeEl.appendChild(inputsEl)

	node._inputs.forEach(function(input){
		var inputEl	= document.createElement('div')
		inputEl.setAttribute('draggable', 'true')
		inputEl.classList.add('input')
		inputEl.classList.add('input-'+input.uuid)
		inputEl.innerHTML	= '- '+input.label
		inputsEl.appendChild(inputEl)

		// add a contextMenu
		var ioContextMenuOptions	= {
			'removeAllLinks'	: 'Remove all links Input',
		}
		var ioContextMenu	= new Dataflow.ContextMenu(ioContextMenuOptions, inputEl, function(value){
			if( value === 'removeAllLinks' )	onRemoveAllLinks(input.links)
		})
		console.log('menuElement', ioContextMenu.menuElement)
		inputEl.appendChild(ioContextMenu.menuElement)


		//////////////////////////////////////////////////////////////////////////////////
		//		handle Dragging for creation
		//////////////////////////////////////////////////////////////////////////////////
		inputEl.addEventListener('dragstart', function(event){
			event.stopPropagation()
			event.dataTransfer.effectAllowed = 'move';

			var dataTransfer	= {}
			renderer.dataTransfer	= dataTransfer
			dataTransfer.type	= 'draggingInput'
			dataTransfer.inputUUID	= input.uuid
		}, false)


		inputEl.addEventListener('drop', function(event){
			event.preventDefault();
			event.stopPropagation(); 
			var dataTransfer	= renderer.dataTransfer
			if( dataTransfer.type === 'draggingOutput' ){
				renderer.dataTransfer	= {}
				var output	= graph.findOutputByUUID(dataTransfer.outputUUID)
				onCreateNewLink(output, input)
			}
		}, false);
	})

	function onCreateNewLink(output, input){
		console.log('createNewlink', arguments)
		var link	= new Dataflow.Link().attach(output, input)
		graph.addLink(link)

		// render the graph
		renderer.render(graph)		
	}

	//////////////////////////////////////////////////////////////////////////////////
	//		Inputs
	//////////////////////////////////////////////////////////////////////////////////
	var outputsEl	= document.createElement('div')
	outputsEl.classList.add('outputs')
	nodeEl.appendChild(outputsEl)

	node._outputs.forEach(function(output){
		var outputEl	= document.createElement('div')
		outputEl.setAttribute('draggable', 'true')
		outputEl.classList.add('output')
		outputEl.classList.add('output-'+output.uuid)

		outputEl.innerHTML	= output.label + ' -'
		outputsEl.appendChild(outputEl)
		var ioContextMenuOptions	= {
			'removeAllLinks'	: 'Remove all links Output',
		}

		// add a contextMenu
		var ioContextMenu	= new Dataflow.ContextMenu(ioContextMenuOptions, outputEl, function(value){
			if( value === 'removeAllLinks' )	onRemoveAllLinks(output.links)
		})
		outputEl.appendChild(ioContextMenu.menuElement)


		//////////////////////////////////////////////////////////////////////////////////
		//		handle Dragging for creation
		//////////////////////////////////////////////////////////////////////////////////
		outputEl.addEventListener('dragstart', function(event){
			event.stopPropagation()
			event.dataTransfer.effectAllowed = 'move';

			var dataTransfer	= {}
			renderer.dataTransfer	= dataTransfer
			dataTransfer.type	= 'draggingOutput'
			dataTransfer.outputUUID	= output.uuid
		}, false)

		outputEl.addEventListener('drop', function(event){
			event.preventDefault();
			event.stopPropagation(); 
			var dataTransfer	= renderer.dataTransfer
			if( dataTransfer.type === 'draggingInput' ){
				renderer.dataTransfer	= {}
				var input	= graph.findInputByUUID(dataTransfer.inputUUID)
				onCreateNewLink(output, input)
			}
		}, false);


	})



	//////////////////////////////////////////////////////////////////////////////////
	//		Comment								//
	//////////////////////////////////////////////////////////////////////////////////
	
	nodeEl.addEventListener('dragstart', onNodeDragStart, false);
	function onNodeDragStart(event){
// return
		var domElement	= this;
		console.log('dragstart', event)
		// console.log('offsetX', event.offsetX, event.offsetY)
		// event.dataTransfer.dropEffect	= 'move';
		event.dataTransfer.effectAllowed = 'move';

		event.stopPropagation();

		var dataTransfer	= {}
		renderer.dataTransfer	= dataTransfer
		dataTransfer.type	= 'draggingNode'
		dataTransfer.domId	= domElement.id
		dataTransfer.offsetX	= event.offsetX
		dataTransfer.offsetY	= event.offsetY

		// put a empty image as dragIcon (cache the image too)
		var cache		= Dataflow.Renderer;
		if( cache.dragIcon ){
			var dragIcon	= cache.dragIcon
			event.dataTransfer.setDragImage(dragIcon, 20/2, 20/2);
		}else{
			var canvas	= document.createElement('canvas')
			canvas.width	= canvas.height	= 20
			var dragIcon	= document.createElement('img');
			dragIcon.src	= canvas.toDataURL();
			cache.dragIcon	= dragIcon
			event.dataTransfer.setDragImage(dragIcon, 20/2, 20/2);
		}		
	}
}





