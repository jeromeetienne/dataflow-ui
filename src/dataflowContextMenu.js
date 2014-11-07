var Dataflow	= Dataflow	|| {}


Dataflow.ContextMenu	= function(options, domElement, callback){
	//////////////////////////////////////////////////////////////////////////////////
	//		Build Menu
	//////////////////////////////////////////////////////////////////////////////////

	var menuElement	= document.createElement('div')
	menuElement.style.display	= 'none'
	menuElement.classList.add('contextMenu')
	this.menuElement= menuElement

	var ulElement	= document.createElement('ul')
	menuElement.appendChild(ulElement)
	Object.keys(options).forEach(function(action){
		var liElement	= document.createElement('li')
		ulElement.appendChild(liElement)
		liElement.innerText	= options[action]
		liElement.dataset.action= action
	})

	//////////////////////////////////////////////////////////////////////////////////
	//		handle event to display/hide context menu
	//////////////////////////////////////////////////////////////////////////////////

	domElement.addEventListener( 'contextmenu', function(event){ event.preventDefault(); }, false );
	domElement.addEventListener( 'mousedown', onMouseDown);
	function onMouseDown(event){
		// if not the right mouse button, return now
		if( event.button !== 2 )	return;

		event.stopPropagation()

		// compute the position of the contextMenu
		var boundingRect= domElement.getBoundingClientRect();
		var positionX	= event.clientX - boundingRect.left
		var positionY	= event.clientY - boundingRect.top

		// toggle menu visibility
		if( menuElement.style.display === 'block' ){
			menuElement.style.display	= 'none';
		}else{
			menuElement.style.display	= 'block';
			// TODO make it 
			menuElement.style.left	= positionX+'px';
			menuElement.style.top	= positionY+'px';
		}
	}
	// 
	document.body.addEventListener('mousedown', function(){
		menuElement.style.display	= 'none';
	}, false)

	//////////////////////////////////////////////////////////////////////////////////
	//		Bind events for menu options
	//////////////////////////////////////////////////////////////////////////////////
	// listen to click on each line of the menu
	var elements	= menuElement.querySelectorAll('li');
	[].slice.call(elements).forEach(function(liElement){
		// console.log('li', liElement, liElement.dataset.action)
		liElement.addEventListener('mousedown', function(event){
			if( event.button !== 0 )	return;
			// hide menu
			menuElement.style.display	= 'none';
			// get the action for this line
			var action	= liElement.dataset.action
			// handle event
			callback(action)
			// stop the event here
			event.preventDefault()
			event.stopPropagation()
		})
	})
}