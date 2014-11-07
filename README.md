dataflow-ui
===========

experiment on dataflow UI

## TODO 
* make a graph.toJSON/graph.fromJSON

## How to organize the code
* the library is called dataflow.js
* Dataflow.Node is one node
    - UUID
    - title
    - inputs
    - outputs
* Dataflow.Input
    - uuid
    - label
    - links uuid
* Dataflow.Output
    - uuid
    - label
    - links uuid
* Dataflow.Link is on link from one output to a input
    - input uuid
    - output uuid

* Dataflow.prototype.render()

* Dataflow.Graph
    - contains list of Node
    - contains list of Link

* Input.prototype.removeLink(linkUUID)
