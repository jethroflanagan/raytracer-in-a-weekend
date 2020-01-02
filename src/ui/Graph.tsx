import * as React from "react";
import { LiteGraph, LGraph, LGraphCanvas } from 'litegraph.js';
import styled from '@emotion/styled';

const Canvas = styled.canvas`
  background: #000;
`;

export class Graph extends React.Component {
  canvasRef = null;
  constructor(props) {
      super(props);
      this.canvasRef = React.createRef();
  }

  componentDidMount() {
    const graph = new LGraph();
    const canvas = new LGraphCanvas(this.canvasRef.current, graph, { autoresize: true });

    var node_const = LiteGraph.createNode("basic/const");
    node_const.pos = [200,200];
    graph.add(node_const);
    node_const.setValue(4.5);

    var node_watch = LiteGraph.createNode("basic/watch");
    node_watch.pos = [700,200];
    graph.add(node_watch);

    node_const.connect(0, node_watch, 0 );

    graph.start();
  }

  public render() {
    return (
      <>
        <Canvas ref={this.canvasRef} width="600" height="600" />
      </>
    );
  }
}
