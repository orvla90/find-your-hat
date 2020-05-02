//Get imputs from user
const prompt = require('prompt-sync')({sigint: true});
//Different values of the field
const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
  constructor() {
    this.field = [];
    this.poss = [0,0];
  }
  //print function
  print(){
    for (var i = 0; i < this.field.length; i++) {
      console.log(this.field[i].join(''));
    }
  }
  //get all the fild with fieldCharacter
  get_empty_field(row, col){
    let final_field = new Array(row);
    for (var i = 0; i < row; i++) {
      final_field[i]= new Array(col);
      for (var j = 0; j < col ; j++) {
        final_field[i][j] = fieldCharacter;
      }
    }
    return final_field;
  }
  //get the start poss
  get_start_poss(row, col){
    let start_row = Math.floor(Math.random()*row);
    let start_col = Math.floor(Math.random()*col);
    return [start_row, start_col];
  }
  //get complete game field
  get_new_field(row, col){
    //start with empty field
    let empty_field = this.get_empty_field(row, col);
    this.field = empty_field;
    //number of holes is 30% of the field
    let number_holes = Math.floor((row*col)/3);
    //place the holes
    for (var i = 0; i < number_holes; i++) {
      let hole_row = Math.floor(Math.random()*row);
      let hole_col = Math.floor(Math.random()*col);
      if (hole_col !== 0 || hole_row !== 0) {
        this.field[hole_row][hole_col] = hole;
      }
    }
    //place the hat
    let place_hat = [Math.floor(Math.random()*(row-2))+2,
                      Math.floor(Math.random()*(col-2))+2];
    this.field[place_hat[0]][place_hat[1]] = hat;
    //place the start possition, different than hat possition
    let found_start_place = false;
    while (!found_start_place) {
      this.poss = this.get_start_poss(row, col);
      if (this.poss !== place_hat) {
        found_start_place = true;
      }
    }
    this.field[this.poss[0]][this.poss[1]] = pathCharacter;
  }
  //check if your move in the field
  check_valid_move(direction){
    if (
        (direction === 'u' || direction === 'U' || direction === 'up')
        && this.poss[0] === 0) {
      return false;
    }else if (
        (direction === 'd' || direction === 'D' || direction === 'down')
        && this.poss[0] === this.field.length) {
      return false;
    }else if (
        (direction === 'r' || direction === 'R' || direction === 'right')
        && this.poss[1] >= this.field[0].length-1) {
      return false;
    }else if (
        (direction === 'l' || direction === 'L' || direction === 'left')
        && this.poss[1] === 0) {
      return false;
    }else {
      return true;
    }
  }
  //check if you step in a hole
  check_poss_is_hole(){
    return(this.field[this.poss[0]][this.poss[1]] === hole);
  }
  //check if you get the hat
  check_poss_is_hat(){
    return(this.field[this.poss[0]][this.poss[1]] === hat);
  }
  //finish the game
  end_game(win){
    if (win) {
      console.log('You found the hat');
    }else {
      console.log('You got in a hole');
    }
    return true;
  }
  //take the move
  make_move(direction){
    if (direction === 'u' || direction === 'U' || direction === 'up') {
      this.poss[0] += -1;
    }else if (direction === 'd' || direction === 'D' || direction === 'down') {
      this.poss[0] += 1;
    }else if (direction === 'r' || direction === 'R' || direction === 'right') {
      this.poss[1] +=1;
    }else if (direction === 'l' || direction === 'L' || direction === 'left') {
      this.poss[1] += -1;
    }
  }
  //move function
  move(direction){
    if (!this.check_valid_move(direction)) {
      return false;
    }else {
      this.make_move(direction);
      if (this.check_poss_is_hole()) {
        this.end_game(false);
        return 'End';
      }else if (this.check_poss_is_hat()) {
        this.end_game(true);
        return 'End';
      }else {
        this.field[this.poss[0]][this.poss[1]] = pathCharacter;
        return true;
      }
    }
  }

}
//start the field
const game_field = new Field;
//Ask for dimentions of the dessire field and convert in numbers
let field_rows = prompt('How many rows do you want?');
field_rows=Number(field_rows);
let field_cols = prompt('How many columns do you want?');
field_cols = Number(field_cols);
//Make the game fiel
game_field.get_new_field(field_rows, field_cols);

//let the game begins
let playing= true;

console.clear();
console.log('This is your board. Try to find the hat');
game_field.print();

while (playing) {
  //Ask for direction
  let direction = prompt('Choose your move, up(u), down(d), right(r) or left(l): ');
  //Take the move, if the game ends, movement takes 'End'
  let movement = game_field.move(direction);
  if (movement === 'End') {
    //Ask if we want to play again and reset the game if so
    let want_play_again = prompt('Do you want to play again??(y / n)');
    if (want_play_again === 'y') {
      game_field.get_new_field(field_rows, field_cols);
      console.clear();
      console.log('This is your new board. Try to find the hat');
      game_field.print();
    }else {
      //finish the game
      playing = false;
      console.clear();
    }
  }else {
    //The game continue
    console.clear();
    game_field.print()
  }
}
