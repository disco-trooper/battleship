<template>
  <v-app>
    <v-content
      ><the-game
        :player-board="playerBoard"
        :computer-board="computerBoard"
        :game-flow="gameFlow"
        :player="player"
        :computer="computer"
        @resetGame="
          computerBoard = gameBoardFactory();
          playerBoard = gameBoardFactory();
          placeShips(playerBoard);
          placeShips(computerBoard);
          removeClasses();
        "
      ></the-game
    ></v-content>
  </v-app>
</template>

<script>
import { gameBoardHelper } from '../src/plugins/gameBoardHelper';
import TheGame from './components/TheGame';

export default {
  name: 'App',
  components: { TheGame },
  data() {
    return {
      gameFlow: {
        playerTurn: false,
        placingShips: true,
        gameStarted: false,
        playerWin: false,
        computerWin: false,
      },
      computerBoard: this.gameBoardFactory(),
      playerBoard: this.gameBoardFactory(),
      player: {
        hit(position, board) {
          board.receiveAttack(position);
        },
      },
      computer: {
        previousAttacks: [],
        makeAttack(board) {
          let attack =
            Math.floor(Math.random() * 10).toString() +
            Math.floor(Math.random() * 10).toString();
          while (this.previousAttacks.includes(attack)) {
            attack =
              Math.floor(Math.random() * 10).toString() +
              Math.floor(Math.random() * 10).toString();
          }
          board.receiveAttack(attack);
          this.previousAttacks.push(attack);
        },
      },
    };
  },
  created() {
    this.placeShips(this.playerBoard);
    this.placeShips(this.computerBoard);
  },
  methods: {
    shipFactory(length, positions, board = 0) {
      return {
        id: board.ships.length,
        length,
        positions,
        direction:
          positions.length === 1
            ? ''
            : positions[0][0] === positions[1][0]
            ? 'horizontal'
            : 'vertical',
        hitPositions: [],
        hit(position) {
          if (this.positions.includes(position))
            this.hitPositions.push(position);
          this.hitPositions = [...new Set(this.hitPositions)];
        },
        isSunk() {
          let that = this;
          that.positions = that.positions.sort((a, b) => a - b);
          that.hitPositions = that.hitPositions.sort((a, b) => a - b);
          return that.positions.length === that.hitPositions.length;
        },
      };
    },

    gameBoardFactory() {
      return {
        ships: [],
        missedHits: [],
        takenHits: [],
        receiveAttack(position) {
          for (let ship in this.ships) {
            let currentShip = this.ships[ship];
            if (currentShip.positions.includes(position)) {
              currentShip.hit(position);
              this.takenHits.push(position);
              this.takenHits = [...new Set(this.takenHits)];
              return currentShip.isSunk();
            }
          }
          this.missedHits.push(position);
          this.missedHits = [...new Set(this.missedHits)];
          return 'missed';
        },
        placeShip(ship) {
          this.ships.push(ship);
        },
      };
    },

    placeShips(board) {
      board.placeShip(
        this.shipFactory(5, this.generateShipCoordinates(5, board), board)
      );
      board.placeShip(
        this.shipFactory(4, this.generateShipCoordinates(4, board), board)
      );
      board.placeShip(
        this.shipFactory(3, this.generateShipCoordinates(3, board), board)
      );
      board.placeShip(
        this.shipFactory(3, this.generateShipCoordinates(3, board), board)
      );
      board.placeShip(
        this.shipFactory(2, this.generateShipCoordinates(2, board), board)
      );
      let coordinates = [];
      for (let ship in board.ships) {
        coordinates.push(board.ships[ship].positions);
      }
      if (
        coordinates.flat().length !== [...new Set(coordinates.flat())].length
      ) {
        board.ships = [];
        this.placeShips(board);
      }
      return;
    },

    removeClasses() {
      let cells = document.getElementsByClassName('gridCell');
      cells.forEach((cell) => {
        cell.className = 'gridCell';
      });
      for (let i = 0; i < 5; i++) {
        const shipID = i;
        const shipParts = document.getElementById('smallShip' + shipID);
        shipParts.children.forEach((part) => {
          part.className = 'ship-part';
        });
      }
    },

    generateShipCoordinates(length, board) {
      let availableSpots = gameBoardHelper.getAvailableSpots(
        gameBoardHelper.getArrayOfCoordinates(),
        gameBoardHelper.getUnavailableSpots(board)
      );
      let positions = [];
      let direction;
      for (let i = 0; i < length; i++) {
        // 1st coordinates
        if (positions.length === 0) {
          let randomPosition = this.getRandomNumber(
            0,
            availableSpots.length - 1
          );
          positions.push(availableSpots[randomPosition]);
          availableSpots.splice(randomPosition, 1);
          // 2nd coordinates
        } else if (positions.length === 1) {
          let positionToTheRight =
            positions[0][0] + (parseInt(positions[0][1]) + 1);

          let positionToTheLeft =
            positions[0][0] + (parseInt(positions[0][1]) - 1);

          let positionToTheTop =
            parseInt(positions[0][0]) - 1 + positions[0][1];

          let positionToTheBottom =
            parseInt(positions[0][0]) + 1 + positions[0][1];

          if (Math.random() > 0.5) {
            if (availableSpots.includes(positionToTheRight)) {
              direction = 'right';
              positions.push(positionToTheRight);
              availableSpots.filter(
                (position) => position !== positionToTheRight
              );
            } else if (availableSpots.includes(positionToTheLeft)) {
              direction = 'left';
              positions.push(positionToTheLeft);
              availableSpots.filter(
                (position) => position !== positionToTheLeft
              );
            }
          } else {
            if (availableSpots.includes(positionToTheTop)) {
              direction = 'top';
              positions.push(positionToTheTop);
              availableSpots.filter(
                (position) => position !== positionToTheTop
              );
            } else if (availableSpots.includes(positionToTheBottom)) {
              direction = 'bottom';
              positions.push(positionToTheBottom);
              availableSpots.filter(
                (position) => position !== positionToTheBottom
              );
            }
          }
          // Rest of coordinates
        } else if (positions.length > 1) {
          let positionToTheRight =
            positions[i - 1][0] + (parseInt(positions[i - 1][1]) + 1);

          let positionToTheLeft =
            positions[i - 1][0] + (parseInt(positions[i - 1][1]) - 1);

          let positionToTheTop =
            parseInt(positions[i - 1][0]) - 1 + positions[i - 1][1];

          let positionToTheBottom =
            parseInt(positions[i - 1][0]) + 1 + positions[i - 1][1];
          if (direction === 'right') {
            if (availableSpots.includes(positionToTheRight)) {
              positions.push(positionToTheRight);
              availableSpots.filter(
                (position) => position !== positionToTheRight
              );
            } else {
              positions.push(positions[0][0] + (parseInt(positions[0][1]) - 1));
              availableSpots.filter(
                (position) =>
                  position !== positions[0][0] + (parseInt(positions[0][1]) - 1)
              );
              direction = 'left';
            }
          } else if (direction === 'left') {
            if (availableSpots.includes(positionToTheLeft)) {
              positions.push(positionToTheLeft);
              availableSpots.filter(
                (position) => position !== positionToTheLeft
              );
            } else {
              positions.push(positions[0][0] + (parseInt(positions[0][1]) + 1));
              availableSpots.filter(
                (position) =>
                  position !== positions[0][0] + (parseInt(positions[0][1]) + 1)
              );
              direction = 'right';
            }
          } else if (direction === 'top') {
            if (availableSpots.includes(positionToTheTop)) {
              positions.push(positionToTheTop);
              availableSpots.filter(
                (position) => position !== positionToTheTop
              );
            } else {
              positions.push(parseInt(positions[0][0]) + 1 + positions[0][1]);
              availableSpots.filter(
                (position) =>
                  position !== parseInt(positions[0][0]) + 1 + positions[0][1]
              );
              direction = 'bottom';
            }
          } else if (direction === 'bottom') {
            if (availableSpots.includes(positionToTheBottom)) {
              positions.push(positionToTheBottom);
              availableSpots.filter(
                (position) => position !== positionToTheBottom
              );
            } else {
              positions.push(parseInt(positions[0][0]) - 1 + positions[0][1]);
              availableSpots.filter(
                (position) =>
                  position !== parseInt(positions[0][0]) - 1 + positions[0][1]
              );
              direction = 'top';
            }
          }
        }
      }
      if (positions.some((position) => position.indexOf('-') !== -1)) {
        return this.generateShipCoordinates(length, board);
      }
      if (positions.length !== length) {
        return this.generateShipCoordinates(length, board);
      }
      if (positions.some((position) => parseInt(position) > 99)) {
        return this.generateShipCoordinates(length, board);
      }
      return positions.sort((a, b) => a - b);
    },

    getRandomNumber(min, max) {
      return (Math.random() * (max - min + 1)) << 0;
    },
  },
};
</script>
