dataflow-ui
===========

experiment on dataflow UI

## TODO 
* feature: create links from one output to an input
* feature: remove all the links from a input or from a output
* feature: ability to load/save graph
    * make a graph.toJSON/graph.fromJSON
* feature: make a program run

## How to add program on top of dataflow-ui ?
* each node got function
* dataflowRunner.js
    - it decide in which order stuff are done
    - there are various possiblity
    - pick one for now (like run in node.y/node.x order)
    - change later if needed. easy to change anyway
        + even better, allow various way to run
        + runner.runSyncByNodeXY()
        + runner.runByPartialOrder()
* dataflowRunnerNode
    - a Dataflow.Node with a function
    - var outputValues = callbackSync({
    -   inputKey: inputValue
    - })
    - PRO: api is not assuming anything on the underlying code
* async node
    - callbackASync({
    -   inputKey: inputValue
    - }, function(outputValues))
    - no ASync at first for the sake of simplycity ?

## Possible Simplest Program
* a counter node
* going to a multiplier-by-2 node
* going to a console.log node

* it generates javascript in a instinctive way for javascript people
    - it got inputs
    - it got outputs (YES with a 's')
* it can be sync or async

## Possible 3d program
* 













