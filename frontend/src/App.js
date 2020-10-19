import React from 'react';
import PathfindingVisualizer from './PathfindingVisualizer/PathfindingVisualizer';

const App = () => {
  return (
    <PathfindingVisualizer></PathfindingVisualizer>
  );
}

/* const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export class App extends React.Component {
  constructor() {
    super();
    this.state = {
      intial_gird: [],
      maze_copy: [],
      grid: [],
      start: null,
      end: null,
      show_initial: true
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getInitialGrid = this.getInitialGrid.bind(this);
    //console.log("this is state");
    //console.log(this.state);
  }


  printData(){
    console.log("Print Data Function");
    console.log("this is state");
    console.log(this.state);
  }

  handleSubmit(e){
      e.preventDefault();
    console.log("inside handle submit");
    axios.get('http://127.0.0.1:8000/').then(res => {
        this.setState({maze_copy: res.data.maze_copy,
                      grid: res.data.moves,
                      start: res.data.start,
                      end: res.data.end,
                      show_initial: false})
        this.printData();
      })
  }

  getInitialGrid() {
    const grid = [];
    for (let row = 0; row < 50; row++) {
      const currentRow = [];
      for (let col = 0; col < 50; col++) {
        currentRow.push(createNode(col, row));
      }
      grid.push(currentRow);
    }
    return grid;
  };

    componentDidMount(){
      console.log("this is component didmount");
      const intial_gird = this.getInitialGrid();
      this.setState({intial_gird: intial_gird});
    } 
 */
  /* render(){
    const grid = this.state.intial_gird;
    let isShowInitial = this.state.show_initial;
    //console.log("bor ",grid);
    const renderGrid = ()=>{
      if(isShowInitial){
        return(
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
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
        );
      } else{
        return <button>Login</button>
      }
    }
    return (
      <div className="App">
        <div><h3>Visualize agent's path from source to destination</h3></div>
        {renderGrid()}

        <div className="container">
      <div id="task-container">
          <div  id="form-wrapper">
             <form onSubmit={this.handleSubmit} id="form">
                <div className="flex-wrapper">
                     <div style={{flex: 1}}>
                        <input id="submit" className="btn btn-warning" type="submit" name="Add" />
                      </div>
                  </div>
            </form>

          </div>
          </div>
          </div>
        <PathfindingVisualizer></PathfindingVisualizer>
        </div>
    )
  }
} */

/*const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 50; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};*/

/* const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
}; */

export default App;
