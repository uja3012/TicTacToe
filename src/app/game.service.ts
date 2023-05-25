import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

@Injectable({
	providedIn: 'root',
  })
export class GameService {

	board:any = [];
	boardLength: number = 3;
	activePlayer: string = "X";
	turnCount:number= 0;
	isGameRunning: boolean = false;
	isGameOver: boolean = false;
	winner: boolean = false;

	boardSize = new BehaviorSubject<number>(9);
	boardSizeObservable = this.boardSize.asObservable();

	private storeWinnerInfoUrl = 'http://localhost:5000'; 

	constructor(private http: HttpClient) {
		this.newGame()
	}

	newGame() {
		this.activePlayer = "X";
		this.turnCount = 0;
		this.isGameRunning = false;
		this.isGameOver = false;
		this.winner = false;
		this.createBoard();
	}

	createBoard() {
		this.board = [];		
		this.boardLength = Math.sqrt(this.boardSize.value);
		for (let i = 0; i < this.boardSize.value; i++) {
			this.board.push({ id: i, state: null })
		};
	}

	get getBoard() {
		return this.board
	}

	set setBoard(board: any) {
		this.board = [...board]
	}

	changePlayerTurn(squareClicked: { id: string | number; state: any; }) {

		this.updateBoard(squareClicked)
		if (!this.isGameOver) this.activePlayer = this.activePlayer == "X" ? "O" : "X"
		this.turnCount++;
		this.isGameOver = this.isGameOver ? true : false;
	}

	updateBoard(squareClicked: { id: string | number; state: any; }) {
		this.board[squareClicked.id].state = squareClicked.state
		if (this.isWinner) {
			this.winner = true;
			this.isGameRunning = false;
			this.isGameOver = true;
			this.storeWinnerInfo().subscribe(value => console.log(value));
		}
	}

	get gameOver(): boolean {
		return ( this.turnCount > (this.boardSize.value -1) || this.winner ) ? true : false
	}

	get isWinner(): boolean {
		return ( this.checkDiag() || this.checkRows() || this.checkCols() ) ? true : false;
	}

	checkRows(): boolean {

		const INC = this.boardLength , NUMTIMES =  this.boardSize.value - this.boardLength;

		for (let i = 0; i < NUMTIMES; i += INC){

			let state: string[] = [];
			
			for(let j = 0; j < this.boardLength; j++){
				state.push(this.board[i+j].state);
				//console.log('row',this.boardLength, state.length, state);
				if( state.length == this.boardLength && state.every( r => r == state[0] ) && state[0]!= null ){
					return true;
				}				

			}

		}
		return false
	}

	checkCols(): boolean {

		const INC = this.boardLength , NUMTIMES =  this.boardSize.value - this.boardLength;

		for (let i = 0; i < this.boardLength; i++){

			let state: string[] = [];
			for(let j = 0; j <= NUMTIMES; j += INC){
				state.push(this.board[i+j].state);
				//console.log('cols',this.boardLength, state.length, state)
				if( state.length == this.boardLength && state.every( r => r == state[0] && state[0]!= null) ){
					return true;
				}				

			}

		}
		return false
	}

	checkDiag() {
		
		const INC = this.boardLength , NUMTIMES =  this.boardSize.value - this.boardLength;

		let state_dia_1: string[] = []; let j = 0;
		while(j < this.boardLength){
			for (let i = 0; i <= NUMTIMES; i += INC){
				state_dia_1.push(this.board[i+j].state);				
				if(state_dia_1.length == this.boardLength && state_dia_1.every( r => r == state_dia_1[0] ) && state_dia_1[0] != null){
					return true;
				}
				j++;
			}
		}
		

		let state_dia_2: string[] = [], l = 0, NUMTIMES_dai_2 = this.boardSize.value - 1;
		while(l < this.boardLength){
			for (let m = this.boardLength-1; m <= NUMTIMES_dai_2; m += INC){
				state_dia_2.push(this.board[m-l].state);
				if(state_dia_2.length == this.boardLength && state_dia_2.every(r => r == state_dia_2[0] ) && state_dia_2[0] != null){
					return true;
				}
				l++;
			}
		}
		return false
	}

	// api integration with python
	storeWinnerInfo() {
		let data = {
			winner: this.activePlayer ? this.activePlayer:'',
			dateTime: new Date().toLocaleString()
		} ;

		console.log('data', data);

		return this.http.put(this.storeWinnerInfoUrl + '/winnerInfo', data, httpOptions);
	  }

}
