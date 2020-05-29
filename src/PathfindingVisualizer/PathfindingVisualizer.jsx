import React, { Component } from 'react';
import Node from './Node/Node';
import Button from './Button/Button';
import Modal from 'react-modal';
import './Help/Help.css'
import { dijkstra, getNodesInShortestPathOrder } from '../Algorithms/dijkstra';
import { maze } from '../Algorithms/maze';
import Help from '../Pictures/543-512.png';
import normalSquare from '../Pictures/NormalSquare.png';
import Start from '../Pictures/Start.png';
import Finish from '../Pictures/Finish.png';
import Wall from '../Pictures/Wall.png';
import Visited from '../Pictures/Visited.png';
import Path from '../Pictures/Path.png';
import './PathfindingVisualizer.css';


Modal.setAppElement('#root')

const NR_OF_ROW = 24;
const NR_OF_COL = 75;
var START_NODE_ROW = 10;
var START_NODE_COL = 15;
var FINISH_NODE_ROW = 10;
var FINISH_NODE_COL = 60;

export default class PathfindingVisualizer extends Component {
    constructor() {
        super();
        this.state = {
            grid: [],
            mouseIsPressed: false,
            needsReset: false,
            selectStart: false,
            selectFinish: false,
            isBlocked: false,
            modalIsOpen: false,
        };
    }

    componentDidMount() {
        const grid = getInitialGrid();
        this.setState({ grid });
    }

    handleMouseDown(row, col) {
        if (this.state.isBlocked) return;

        if ((row === START_NODE_ROW) && (col === START_NODE_COL)) {
            this.setState({ selectStart: true, mouseIsPressed: true, });
            return;
        }
        if ((row === FINISH_NODE_ROW) && (col === FINISH_NODE_COL)) {
            this.setState({ selectFinish: true, mouseIsPressed: true, });
            return;
        }
        

        var newGrid = getNewGridWithWallToggledPress(this.state.grid, row, col);
        this.setState({ grid: newGrid, mouseIsPressed: true });
    }

    handleMouseEnter(row, col) {
        if (this.state.isBlocked) return;
        if (!this.state.mouseIsPressed) return;

        if (this.state.selectStart) {

            // Creates a new grid with the Start Node changed
            START_NODE_ROW = row;
            START_NODE_COL = col;

            var newGrid = this.state.grid.slice();
            const node = newGrid[START_NODE_ROW][START_NODE_COL];            
            const newNode = {
                ...node,
                isWall: false,
            };
            newGrid[row][col] = newNode;

            this.setState({ grid: newGrid });
            this.clearPath();

            return;
        }

        if (this.state.selectFinish) {
            // Creates a new grid with the Finish Node changed
            FINISH_NODE_ROW = row;
            FINISH_NODE_COL = col;

            newGrid = this.state.grid.slice();
            const node = newGrid[row][col];
            const newNode = {
                ...node,
                isWall: false,
            };
            newGrid[row][col] = newNode;

            this.clearPath();

            return;
        }

        newGrid = getNewGridWithWallToggledHold(this.state.grid, row, col);
        this.setState({ grid: newGrid });
    }

    handleMouseUp() {
        if (this.state.isBlocked) return;

        this.setState({ mouseIsPressed: false, selectStart: false, selectFinish: false, });
    }

    /*selectStartNode() {
        this.setState({ selectStart: true, });
    }

    selectEndNode() {
        this.setState({ selectFinish: true, });
    }*/

    resetBoard() {
        if (this.state.isBlocked) return;

        var newGrid = getInitialGrid();
        this.setState({ grid: newGrid });

        for (let row = 0; row < NR_OF_ROW; ++row) {
            for (let col = 0; col < NR_OF_COL; ++col) {
                var node = newGrid[row][col];

          

                if ((row !== START_NODE_ROW || col !== START_NODE_COL) && (row !== FINISH_NODE_ROW || col !== FINISH_NODE_COL)) {
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                        'node node';
                }
                else {
                    if (row === START_NODE_ROW && col === START_NODE_COL) {
                        document.getElementById(`node-${node.row}-${node.col}`).className =
                            'node node-start';
                    }
                    else {
                        document.getElementById(`node-${node.row}-${node.col}`).className =
                            'node node-finish';
                    }
                }
            }
        }
    }

    clearPath() {
        if (this.state.isBlocked) return;

        const previousWalls = [];
        for (let row = 0; row < NR_OF_ROW; ++row) {
            for (let col = 0; col < NR_OF_COL; ++col) {
                if (this.state.grid[row][col].isWall === true) {
                    previousWalls.push(this.state.grid[row][col]);
                }
            }
        }

        var newGrid = getInitialGrid();
        this.setState({ grid: newGrid });

        if (previousWalls.length !== 0) {
            for (let i = 0; i < previousWalls.length; i++) {
                const node = previousWalls[i];
                newGrid[node.row][node.col].isWall = true;
            }
        }

        for (let row = 0; row < NR_OF_ROW; ++row) {
            for (let col = 0; col < NR_OF_COL; ++col) {
                var node = newGrid[row][col];



                if ((row !== START_NODE_ROW || col !== START_NODE_COL) && (row !== FINISH_NODE_ROW || col !== FINISH_NODE_COL)) {
                    if (node.isWall === false) {
                        document.getElementById(`node-${node.row}-${node.col}`).className =
                            'node node';
                        }
                }
                else {
                    if (row === START_NODE_ROW && col === START_NODE_COL) {
                        document.getElementById(`node-${node.row}-${node.col}`).className =
                            'node node-start';
                    }
                    else {
                        document.getElementById(`node-${node.row}-${node.col}`).className =
                            'node node-finish';
                    }
                }
            }
        }

        this.setState({ grid: newGrid });
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
                var node = visitedNodesInOrder[i];
                node.isVisited = true;
                if ((node.row !== START_NODE_ROW || node.col !== START_NODE_COL) && (node.row !== FINISH_NODE_ROW || node.col !== FINISH_NODE_COL)) {
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                        'node node-visited';
                }
            }, 6 * i);
        }
    }

    animateShortestPath(nodesInShortestPathOrder) {
        if (nodesInShortestPathOrder.length !== 1)
        for (let i = 1; i < nodesInShortestPathOrder.length - 1; i++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-shortest-path';
            }, 50 * i);
            }
        this.setState({ isBlocked: false, });
    }

    visualizeDijkstra() {
        if (this.state.isBlocked) return;

        this.clearPath();
        this.setState({ isBlocked: true, });

        const { grid } = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }

    animateMaze(newGrid) {
        for (let i = 0; i < NR_OF_ROW; ++i) {
            for (let j = 0; j < NR_OF_COL; ++j) {
                setTimeout(() => {
                    const node = newGrid[i][j];
                    if (newGrid[i][j].isWall === true) {
                        document.getElementById(`node-${node.row}-${node.col}`).className =
                            'node node-wall';
                    }
                }, (i + j) * 5);
            }
        }
        setTimeout(() => { this.setState({ grid: newGrid, isBlocked: false, }); }, 200);
    }

    createMaze() {
        if (this.state.isBlocked) return;

        this.clearPath();
        this.setState({ isBlocked: true, });

        const { grid } = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const n = NR_OF_ROW;
        const m = NR_OF_COL;
        const newGrid = maze(grid, n, m, startNode, finishNode);
        this.animateMaze(newGrid);
    }

    handleOpenModal() {
        this.setState({ modalIsOpen: true })
    }

    handleCloseModal() {
        this.setState({ modalIsOpen: false })
    }

    render() {
        const { grid, mouseIsPressed, modalIsOpen } = this.state;
        
        return (
            <>
                <p className="H"><img src={Help} alt="Help" width="35" height="35" align="right" onClick={() => this.handleOpenModal()} /></p>

                <button className="button1" onClick={() => this.visualizeDijkstra()}>
                        Visualize Dijkstra's Algorithm
                </button>

                <button className="button1" onClick={() => this.createMaze()}>
                    Create Maze
                </button>


                <button className="button3" onClick={() => this.clearPath()}>
                    Clear Path
                </button>

                <button className="button3" onClick={() => this.resetBoard()}>
                    Reset Board
                </button>
                <br />
                <br />
                <br />
                <img className = "text" src={normalSquare} width="35" height="35" alt="normalSquare" />
                <span className="text"> <b> &nbsp; Unvisited Node &emsp; &emsp; &emsp; &emsp; </b> </span>

                <img className="text" src={Start} width="35" height="35" alt="Start" />
                <span className="text"> <b> &nbsp; Start Node &emsp; &emsp; &emsp; &emsp; </b> </span>

                <img className="text" src={Finish} width="35" height="35" alt="Finish" />
                <span className="text"> <b> &nbsp; Target Node &emsp; &emsp; &emsp; &emsp; </b> </span>

                <img className="text" src={Wall} width="35" height="35" alt="Wall" />
                <span className="text"> <b> &nbsp; Wall &emsp; &emsp; &emsp; &emsp; </b> </span>

                <img className="text" src={Visited} width="35" height="35" alt="Visited" />
                <span className="text"> <b> &nbsp; Visited Node &emsp; &emsp; &emsp; &emsp; </b> </span>

                <img className="text" src={Path} width="35" height="35" alt="Path" />
                <span className="text"> <b> &nbsp; Path Node &emsp; &emsp; &emsp; &emsp; </b> </span>

                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={() => this.handleCloseModal()}
                >
                    <div className="Modal">
                        <p className = "title" align = "center"> Pathfinding Visualiser </p>
                        <p className="text1" align="center"  > <b> Learn Computer Science by having fun with mazes! </b> </p>
                        <br />
                        <p className="text2"> This website shows in a visually pleasing way how <b> Dijkstra's Algorithm </b> works. <br/>
                            &emsp; &emsp; &nbsp;
                            <b> Dijkstra's Algorithm </b> is a method used in finding the shortest distance between two points in a maze. </p>
                        <p className="text2"> Click on the board to create a <b> wall </b> (inaccessible block). Or if you're feeling lazy, why not just click on the <b> Create Maze </b> button,
                            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                            and let the website do it for you? </p>
                        <p className="text2"> You can drag the <b> Start </b> and <b> Target Nodes </b> with your mouse along the grid. </p>
                        <p className="text2"> When you feel ready to see the magic happen, click on <b> Visualize Dijkstra's Algorithm</b>, sit back, and enjoy the show! </p>
                        <br />
                        <p align="center"> <button class="button3" onClick={() => this.handleCloseModal()}> Close </button> </p>
                        <div align="left" class = "text3"> &nbsp; &nbsp; Created by: Samuel Gherasim </div> 

                        </div>
                </Modal>

                <div className="grid">
                    {grid.map((row, rowIdx) => {
                        return (
                            <div key={rowIdx}>
                                {row.map((node, nodeIdx) => {
                                    const { row, col, isFinish, isStart, isWall, wasWall, isVisited } = node;
                                    return (
                                        <Node
                                            key={nodeIdx}
                                            col={col}
                                            isFinish={isFinish}
                                            isStart={isStart}
                                            isWall={isWall}
                                            wasWall={wasWall}
                                            isVisited={isVisited}
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
    for (let row = 0; row < NR_OF_ROW; row++) {
        const currentRow = [];
        for (let col = 0; col < NR_OF_COL; col++) {
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
        isWall: false,
        wasWall: false, // TO IMPLEMENT
        previousNode: null,
    };
};

const getNewGridWithWallToggledPress = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
    };

    newNode.isWall = !(newNode.isWall);
    newGrid[row][col] = newNode;
    return newGrid;
};

const getNewGridWithWallToggledHold = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall: true,
    };

    newGrid[row][col] = newNode;
    return newGrid;
};

