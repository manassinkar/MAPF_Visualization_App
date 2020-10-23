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
      numAgents: 1
    };
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
        if(i===0)
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

  makeMove(node,i,ci,maxLen,colour)
  {
    if(ci!==maxLen-1)
    {
      var time = 200*i + 100;
      if(i===0)
      {
        time = 100;
      }
      setTimeout(() => {
        var el = document.getElementById(`node-${node.row}-${node.col}`)
        el.style.backgroundColor = 'white';
      }, time);
    }

    setTimeout(() => {
      var el = document.getElementById(`node-${node.row}-${node.col}`)
      el.style.backgroundColor = colour;
    }, 200 * i);
  }

  isDone(agents)
  {
    for(var i=0;i<agents.length;i++)
    {
      var l = agents[i]['visitedNodesInOrder'].length;
      var ci = agents[i]['currMovesIndex']
      if(ci<=l-1)
      {
        return false;
      }
    }
    return true;
  }

  updateAgents(agents,grid)
  {
    for(var i=0;i<agents.length;i++)
    {
      let s = agents[i].start;
      let e = agents[i].end;
      const startNode = grid[s[0]][s[1]];
      const finishNode = grid[e[0]][e[1]];
      const m = agents[i].moves;
      const visitedNodesInOrder = dijkstra(grid, startNode, finishNode, m);
      agents[i]['visitedNodesInOrder'] = visitedNodesInOrder;
      agents[i]['waitTime'] = 0;
      agents[i]['currMovesIndex'] = 1;
    }
    return agents;
  }

  async makeFirstMove(agents)
  {
    await agents.forEach((agent) =>
    {
      var node = agent['visitedNodesInOrder'][agent['currMovesIndex']-1];
      var l = agent['visitedNodesInOrder'].length;
      var colour = agent['colour'];
      this.makeMove(node,0,0,l,colour);
    })
  }

  getNextMoves(agents)
  {
    var nextNodes = agents.map(agent => {
      if(agent['currMovesIndex']<agent['visitedNodesInOrder'].length)
      {
        return agent['visitedNodesInOrder'][agent['currMovesIndex']];
      }
      return null;
    });
    var nextMoves = nextNodes.map(node => {
      if(node!==null)
      {
        return { row: node.row, col: node.col }
      }
      return null;
    });
    return nextMoves;
  }

  async updateAgentsWaitStatus(nextMoves,agents)
  {
    var set = [];
    let r = 0,c = 0;
    const func = (item) => { return item['row'] === r && item['col'] === c }
    for(var j=0;j<nextMoves.length;j++)
    {
      if(agents[j]['waitTime']===0 && nextMoves[j]!==null)
      {
        r = nextMoves[j]['row'];
        c = nextMoves[j]['col'];
        var f = await set.filter(func)
        // console.log(r,c,f,set);
        if(f.length === 0)
        {
          set.push(nextMoves[j])
        }
        else
        {
          agents[j]['waitTime'] = 2;
        }
      }
    }
    return agents;
  }

  makeNextIteration(agents,i)
  {
    for(var k=0;k<agents.length;k++)
    {
      var currIdx = agents[k]['currMovesIndex'];
      var l = agents[k]['visitedNodesInOrder'].length
      var node = null;
      var colour = '';
      if(agents[k]['waitTime']>0)
      {
        if(currIdx<l)
        {
          node = agents[k]['visitedNodesInOrder'][currIdx];
          colour = 'Black';
          console.log("Waiting");
          this.makeMove(node,i,currIdx,l,colour);
        }
        agents[k]['waitTime'] -= 1;
      }
      else
      {
        if(currIdx<l)
        {
          node = agents[k]['visitedNodesInOrder'][currIdx];
          colour = agents[k]['colour'];
          this.makeMove(node,i,currIdx,l,colour);
          agents[k]['currMovesIndex'] += 1;
        }
      }
    }
  }

  async visualizePath() {
    // console.log(this.state.moves);
    const grid = this.state.grid;
    var agents = this.state.agents;
    agents = this.updateAgents(agents,grid);
    await this.makeFirstMove(agents);
    var i = 0;
    while(true)
    {
      if(this.isDone(agents)===true)
      {
        break;
      }
      var nextMoves = await this.getNextMoves(agents);
      agents = await this.updateAgentsWaitStatus(nextMoves,agents);
      this.makeNextIteration(agents,i);
      i++;
    }
  }

  async makeApiCalls() {
    /* const colours = ['Aqua','Blue','Brown','Chocolate','DarkBlue','DarkCyan','DarkGoldenRod','DarkGreen','DarkMagenta','Indigo','OrangeRed','Sienna','Red','Green','BlueViolet','CornflowerBlue','Crimson','DarkGray','DeepPink','Fuchsia']
    const numAgents = this.state.numAgents;
    let response = await axios('http://127.0.0.1:8000/app/maze');
    let initialMaze = response.data.maze;

    let startEndPromiseArray = [];
    for(var i=0; i<numAgents; i++){
      startEndPromiseArray.push(axios.post('http://127.0.0.1:8000/app/startend/', {
        maze: JSON.stringify(initialMaze)
      },{headers: {'Content-Type': 'application/json'}}));
    }
    var startEndData = await Promise.all(startEndPromiseArray);
    startEndData = startEndData.map(elem => { return { start: elem.data.start,end: elem.data.end, length: elem.data.length } });
    let astarLength = startEndData.map(elem => { return elem.length })
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
    result = result.map(res => { return { start: res.data.start, end: res.data.end, moves: res.data.moves } });
    let resultLength = result.map(res => { return res.moves.length });

    var sum = 0;
    for(i=0;i<numAgents;i++)
    {
      sum += resultLength[i] - astarLength[i];
    }
    console.log("On an average it is taking",sum/numAgents,"extra moves by our solution with respect to astar algorithm individually");

    for(i=0;i<result.length;i++)
    {
      result[i]['colour'] = colours[i];
    }

    console.log("result ",result);
 */
    let numberOfAgents = this.state.numAgents;
    let statesAll = require('./statesAll.json');
    let stateList = statesAll[numberOfAgents];
    let r = Math.round(Math.random() * 4);
    const stateObject = stateList[r];
    console.log("random index ", r);
    console.log("state object ", stateObject);

    /* let stateList = require('./states.json');
    let r = Math.round(Math.random() * 29);
    const stateObject = stateList[r];
    console.log("LENGTH ",stateObject.agents.length); */
    /* const stateObject = {
      grid: initialMaze,
      agents: result,
    } */
    // console.log(stateObject)

    await this.setState(stateObject);

  }

  async componentDidMount() {
    this.makeApiCalls();
    // const grid = getInitialGrid();
  }

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid, mouseIsPressed: true});
  }

  setInitialGrid = (draw) => {
    const grid = getInitialGrid(draw,this.state);
    this.setState({grid: grid});
  }

  handleFormSubmit = (event) => {
    event.preventDefault();
    this.makeApiCalls();
  }

  render() {
    const {grid, mouseIsPressed} = this.state;
    return (
      <div className="App row">
        
        <div className="column">

        <div className="cardClass">
            <div className="ui card" style={{margin: "0px 0px 0px 0px", 
  width: "80%", textAlign: "center"}}>
              <div className="content">
                <div className="header">Path Finding Visualizer!!</div>
                <div className="meta"></div>
                <div className="description">
                  <p>This is a path finding visualizer for multiple agents where every agent is trained using our Deep Learning Model to find the shortest route till the destination!</p>
                  <p>Just enter the number of Agents in the box and press the button below, get the grid by pressing 'Get the Grid Button' and then click on 'Visualize Path!' and have fun! </p>
                </div>
              </div>
            </div>
          </div>

        <div className="formParentDiv">
          <form className="ui form formClass" onSubmit={this.handleFormSubmit}>
            <div className="field">
              <label>Agents</label>
              <input type="number" 
                    name="num-agents" 
                    placeholder="Number of agents"
                    onChange={e => this.setState({numAgents: e.target.value})}
                    />
            </div>
          <button className="ui blue button"
                  type="submit"
                  value={this.state.numAgents}
                  >{this.state.numAgents}</button>
          </form>
        </div>
      
      <div className="buttonClass">
            <button className="ui blue button" disabled={!this.state.agents} onClick={() => this.setInitialGrid(this.state.grid)} >
             Get the Grid!
           </button>
            <button className="ui blue button" disabled={!this.state.agents} onClick={() => this.visualizePath()} style={{ marginLeft: "10px"}}>
             Visualize Path!
           </button>
        
      </div>

      </div>
        <div className="grid column">
          {grid.map((row, rowIdx) => {
            return (
              <div className="gridCell" key={rowIdx}>
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
