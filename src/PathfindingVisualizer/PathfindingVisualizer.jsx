import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra} from '../algorithms/dijkstra';
import {bfs} from '../algorithms/bfs';
import {bidirectional} from '../algorithms/bidirectional';
import {a_star} from '../algorithms/A-Star';
import {getNodesInShortestPathOrder} from '../algorithms/getShortestPath';

import './PathfindingVisualizer.css';

var START_NODE_ROW = 10;
var START_NODE_COL = 15;
var FINISH_NODE_ROW = 10;
var FINISH_NODE_COL = 35;
var flag = false;
var mouseIsPressedglobal = false;

const algos = ['Dijkstra', 'BFS', 'BiDirectional', 'A*'];

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      value: 'Dijkstra',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  }

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid, mouseIsPressed: true});
    mouseIsPressedglobal = true;
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid});
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false});
    mouseIsPressedglobal = false;
    flag = 0;
  }

  animate(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (
          (node.row === START_NODE_ROW && node.col === START_NODE_COL) ||
          (node.row === FINISH_NODE_ROW && node.col === FINISH_NODE_COL)
        );
        else
          document.getElementById(`node-${node.row}-${node.col}`).className =
            'node node-visited';
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        if (
          (node.row === START_NODE_ROW && node.col === START_NODE_COL) ||
          (node.row === FINISH_NODE_ROW && node.col === FINISH_NODE_COL)
        );
        else
          document.getElementById(`node-${node.row}-${node.col}`).className =
            'node node-shortest-path';
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animate(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeA_Star() {
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = a_star(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animate(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeBFS() {
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = bfs(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animate(visitedNodesInOrder, nodesInShortestPathOrder);
  }
  visualizeBiDirectional() {
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = bidirectional(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animate(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  handleSubmit(event) {
    if (this.state.value === 'Dijkstra') this.visualizeDijkstra();
    else if (this.state.value === 'BFS') this.visualizeBFS();
    else if (this.state.value === 'BiDirectional')
      this.visualizeBiDirectional();
    else if (this.state.value === 'A*') this.visualizeA_Star();
    event.preventDefault();
  }

  handleChange = event => {
    this.setState({value: event.target.value});
  };

  render() {
    const {grid, mouseIsPressed} = this.state;

    return (
      <>
        <div className="head">
          <div className="Logo">Path Finding Visualizer</div>
          <form className="DropDown" onSubmit={this.handleSubmit}>
            <label className="label">
              Pick your favorite algorithm:
              <select
                className="options"
                value={this.state.value}
                onChange={this.handleChange}>
                <option value="Dijkstra">Dijkstra</option>
                <option value="BFS">BFS</option>
                <option value="BiDirectional">BiDirectional</option>
                <option value="A*">A*</option>
              </select>
            </label>
            <input className="button" type="submit" value="Submit" />
          </form>
        </div>
        <div className="row">
          Choose an Algorithm and enjoy it's visualization. Feel free to move
          your source and destination cell. You can also create blocked
          cells/walls by selecting the cells.
        </div>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isVisitedOther: false,
    isWall: false,
    previousNode: null,
    f: Infinity,
    g: Infinity,
    h: Infinity,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  if (
    (row === START_NODE_ROW && col === START_NODE_COL) ||
    (row === FINISH_NODE_ROW && col === FINISH_NODE_COL)
  ) {
    if (mouseIsPressedglobal === false) {
      if (row === START_NODE_ROW && col === START_NODE_COL) flag = 1;
      else flag = 2;
    }
    return grid;
  } else if (flag > 0) {
    if (flag === 1) {
      grid[row][col].isStart = true;
      grid[START_NODE_ROW][START_NODE_COL].isStart = false;
      START_NODE_ROW = row;
      START_NODE_COL = col;
    } else {
      grid[row][col].isFinish = true;
      grid[FINISH_NODE_ROW][FINISH_NODE_COL].isFinish = false;
      FINISH_NODE_ROW = row;
      FINISH_NODE_COL = col;
    }
    return grid;
  }
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
