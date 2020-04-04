<template>
  <v-app>
    <v-content
      ><the-game
        :player-board="playerBoard"
        :computer-board="computerBoard"
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
      initialTopPosition: '',
      initialLeftPosition: '',
      movedShipID: '',
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
    updateCoordinates(newCoordinates) {
      for (let ship in this.computerBoard.ships) {
        if (this.computerBoard.ships[ship].id.toString() === this.movedShipID) {
          this.computerBoard.ships[ship].positions = newCoordinates;
        }
      }
      document.getElementById(
        this.movedShipID
      ).style.top = this.initialTopPosition;
      document.getElementById(
        this.movedShipID
      ).style.left = this.initialLeftPosition;
    },
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
        },
        isSunk() {
          let that = this;
          return (
            that.positions.length === that.hitPositions.length &&
            positions.sort().every(function (value, index) {
              return value === that.hitPositions.sort()[index];
            })
          );
        },
      };
    },

    gameBoardFactory() {
      return {
        ships: [],
        missed: [],
        receiveAttack(position) {
          for (let ship in this.ships) {
            let currentShip = this.ships[ship];
            if (currentShip.positions.includes(position)) {
              currentShip.hit(position);
              if (currentShip.isSunk() === true) {
                return 'sunk';
              } else {
                return 'not sunk';
              }
            }
          }
          this.missed.push(position);
        },
        placeShip(ship) {
          this.ships.push(ship);
        },
      };
    },

    placeShips(board) {
      board.placeShip(
        this.shipFactory(5, this.getShipCoordinates(5, board), board)
      );
      board.placeShip(
        this.shipFactory(4, this.getShipCoordinates(4, board), board)
      );
      board.placeShip(
        this.shipFactory(3, this.getShipCoordinates(3, board), board)
      );
      board.placeShip(
        this.shipFactory(3, this.getShipCoordinates(3, board), board)
      );
      board.placeShip(
        this.shipFactory(2, this.getShipCoordinates(2, board), board)
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
    },

    getShipCoordinates(length, board) {
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
        return this.getShipCoordinates(length, board);
      }
      if (positions.length !== length) {
        return this.getShipCoordinates(length, board);
      }
      if (positions.some((position) => parseInt(position) > 99)) {
        return this.getShipCoordinates(length, board);
      }
      return positions.sort((a, b) => a - b);
    },

    getRandomNumber(min, max) {
      return (Math.random() * (max - min + 1)) << 0;
    },
  },
};
</script>
