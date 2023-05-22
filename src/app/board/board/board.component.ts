import { Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import { GameService } from 'src/app/game.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit{

  //board: any = [];
  boardLength: number = 0;
  boardCounter: number = 1;

  @ViewChild('boardSize') boardSize!: ElementRef;

  constructor( public gameService: GameService ) { }

  ngOnInit() {    
    this.gameService.boardSizeObservable.subscribe(
      val => {
        this.gameService.newGame();
        this.boardLength = this.gameService.boardLength;
        console.log('change',this.gameService.board)
      }
    );

  }

  getIndex(){
    return 0;
  }

  onSelected(){
    this.gameService.boardSize.next(this.boardSize.nativeElement.value);   
  }

  resetGame(){
    this.gameService.boardSize.next(9);
    this.gameService.newGame()
  }

}
