var Dataflow	= Dataflow	|| {}

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