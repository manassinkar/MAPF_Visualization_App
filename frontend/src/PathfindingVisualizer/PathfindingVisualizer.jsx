import React, {Component} from 'react';
import Node from './Node/Node';
import axios from 'axios';
import { dijkstra /* getNodesInShortestPathOrder */} from '../algorithms/dijkstra';
import '../App.css';
import Cookies from 'js-cookie';


import './PathfindingVisualizer.css';

let START_NODE_ROW = 0;
let START_NODE_COL = 0;
let FINISH_NODE_ROW = 1;
let FINISH_NODE_COL = 1;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      intial_gird: [],
      maze_copy: [],
      start: null,
      end: null,
      mouseIsPressed: false,

    };
  }

  printData(){
    console.log("print data");
    console.log(this.state);
  }

  async componentDidMount() {

    const numAgents = 2;
    let response = await axios('http://127.0.0.1:8000/app/maze');
    let initialMaze = response.data.maze;

    let startEndPromiseArray = [];
    for(var i=0; i<numAgents; i++){
      startEndPromiseArray.push(axios.post('http://127.0.0.1:8000/app/startend/', {
        maze: JSON.stringify(initialMaze)
      },{headers: {'Content-Type': 'application/json'}}));
    }
    const startEndData = await Promise.all(startEndPromiseArray);
    console.log("startend data ",startEndData);

    let movesArray = [];
    startEndData.forEach(element => {
      let s = element.data.start;
      let e = element.data.end;
      movesArray.push(axios.post('http://127.0.0.1:8000/', {
        maze: JSON.stringify(initialMaze),
        start: JSON.stringify(s),
        end: JSON.stringify(e)
      },{headers: {'Content-Type': 'application/json'}}));
    })
    console.log(movesArray.length);
    const result = await Promise.all(movesArray);
    console.log("result ",result);

    /* let result = await axios.post('http://127.0.0.1:8000/', {
      maze: JSON.stringify(initialMaze),
      start: JSON.stringify(cordArray.data.start),
      end: JSON.stringify(cordArray.data.end)
    },{headers: {'Content-Type': 'application/json'}}) */

    /* this.setState({maze_copy: result.data.maze_copy,
                      grid: result.data.maze_copy,
                      start: result.data.start,
                      end: result.data.end,
                      moves: result.data.moves}) */
    //const grid = getInitialGrid();
  }

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid, mouseIsPressed: true});
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid});
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false});
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

  /* visualizeDijkstra() {
    const {grid} = this.state.mo;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  } */

  visualizePath() {
    console.log(this.state.moves);
    const grid = this.state.grid;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    console.log("s and f: ", startNode, finishNode);
    const m = this.state.moves;
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode, m);
    console.log("visi in order", visitedNodesInOrder[0]);
    console.log(visitedNodesInOrder[visitedNodesInOrder.length - 1]);
    //const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, visitedNodesInOrder);
  }

  setInitialGrid = (draw) => {
    let s = this.state.start;
    let e = this.state.end;
    START_NODE_ROW = s[0];
    START_NODE_COL = s[1];
    FINISH_NODE_ROW = e[0];
    FINISH_NODE_COL = e[1];
    const grid = getInitialGrid(draw);
    this.setState({grid: grid});
  }

  render() {
    const {grid, mouseIsPressed} = this.state;

    return (
      <div className="App">
        <button onClick={() => this.visualizePath()} style={{marginLeft:"520px"}}>
          Visualize Path!!
        </button><button style={{marginLeft:"0px"}} onClick={() => this.setInitialGrid(this.state.grid)} style={{marginLeft:"520px"}}>
          getInitialGrid with obstacles
        </button>
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
      </div>
    );
  }
}

const getInitialGrid = (drawGrid) => {
  const grid = [];
  for (let row = 0; row < 50; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      let obstacle = false;
      if(drawGrid[row][col] === -1){
        obstacle = true;
      }
      currentRow.push(createNode(col, row, obstacle));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row, obstacle) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: obstacle,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
