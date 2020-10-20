import React, {Component} from 'react';
import Node from './Node/Node';
import axios from 'axios';
import { dijkstra /* getNodesInShortestPathOrder */} from '../algorithms/dijkstra';
import '../App.css';


import './PathfindingVisualizer.css';

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
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

    const colours = ['Aqua','Blue','Brown','Chocolate','DarkBlue','DarkCyan','DarkGoldenRod','DarkGreen','DarkMagenta','Indigo','OrangeRed','Sienna']
    const numAgents = 3;
    let response = await axios('http://127.0.0.1:8000/app/maze');
    let initialMaze = response.data.maze;

    let startEndPromiseArray = [];
    for(var i=0; i<numAgents; i++){
      startEndPromiseArray.push(axios.post('http://127.0.0.1:8000/app/startend/', {
        maze: JSON.stringify(initialMaze)
      },{headers: {'Content-Type': 'application/json'}}));
    }
    var startEndData = await Promise.all(startEndPromiseArray);
    startEndData = startEndData.map(elem => { return { start: elem.data.start,end: elem.data.end } })
    console.log("startend data ",startEndData);

    let movesArray = [];
    startEndData.forEach(element => {
      let s = element.start;
      let e = element.end;
      movesArray.push(axios.post('http://127.0.0.1:8000/', {
        maze: JSON.stringify(initialMaze),
        start: JSON.stringify(s),
        end: JSON.stringify(e)
      },{headers: {'Content-Type': 'application/json'}}));
    })
    console.log(movesArray.length);
    var result = await Promise.all(movesArray);
    result = result.map(res => { return { start: res.data.start, end: res.data.end, moves: res.data.moves } })

    for(i=0;i<result.length;i++)
    {
      result[i]['colour'] = colours[i];
    }

    console.log("result ",result);

    const stateObject = {
      grid: initialMaze,
      agents: result,
    }
    // console.log(stateObject)

    await this.setState(stateObject)
    // const grid = getInitialGrid();
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

  animateDijkstra(visitedNodesInOrder,colour) {
    for (let i = 0; i < visitedNodesInOrder.length; i++) {
      const node = visitedNodesInOrder[i];

      if(i!==visitedNodesInOrder.length-1)
      {
        var time = 120*i;
        if(i==0)
        {
          time = 120;
        }
        setTimeout(() => {
          var el = document.getElementById(`node-${node.row}-${node.col}`)
          el.style.backgroundColor = 'white';
        }, time);
      }

      setTimeout(() => {
        var el = document.getElementById(`node-${node.row}-${node.col}`)
        el.style.backgroundColor = colour;
      }, 100 * i);
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

  visualizePath() {
    // console.log(this.state.moves);
    const grid = this.state.grid;
    const agents = this.state.agents;
    agents.forEach(agent =>
      {
        let s = agent.start;
        let e = agent.end;
        let c = agent.colour;
        const startNode = grid[s[0]][s[1]];
        const finishNode = grid[e[0]][e[1]];
        const m = agent.moves;
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode, m);
        this.animateDijkstra(visitedNodesInOrder,c);
      })
  }

  setInitialGrid = (draw) => {
    const grid = getInitialGrid(draw,this.state);
    this.setState({grid: grid});
  }

  render() {
    const {grid, mouseIsPressed} = this.state;

    return (
      <div className="App">
        <button onClick={() => this.visualizePath()} style={{marginLeft:"520px"}}>
          Visualize Path!!
        </button><button onClick={() => this.setInitialGrid(this.state.grid)} style={{marginLeft:"520px"}}>
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

const getInitialGrid = (drawGrid,state) => {
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
  state.agents.forEach(agent =>
    {
      let s = agent.start;
      let e = agent.end
      grid[s[0]][s[1]].isStart = true;
      grid[e[0]][e[1]].isFinish = true;
    })
  return grid;
};

const createNode = (col, row, obstacle) => {
  return {
    col,
    row,
    isStart: false,
    isFinish: false,
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
