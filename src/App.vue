<template>
  <v-app>
    <v-content><the-game></the-game></v-content>
  </v-app>
</template>

<script>
import TheGame from './components/TheGame';

export default {
  name: 'App',
  components: { TheGame },
  data() {
    return {
      ship: this.shipFactory(2, ['01', '02']),
      ship2: this.shipFactory(3, ['29', '39', '49']),
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
    for (let i = 0; i < 10; i++) {
      console.log(this.getShipCoordinates(1, this.computerBoard));
    }
    // this.computerBoard.placeShip(this.ship);
    // this.computerBoard.placeShip(this.ship2);
    // console.log(
    //   this.getAvailableSpots(
    //     this.getArrayOfCoordinates(),
    //     this.getUnavailableSpots(this.computerBoard)
    //   )
    // );
  },
  methods: {
    shipFactory(length, positions) {
      return {
        length,
        positions,
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

    getShipCoordinates(length, board) {
      let availableSpots = this.getAvailableSpots(
        this.getArrayOfCoordinates(),
        this.getUnavailableSpots(board)
      );
      let positions = [];
      for (let i = 0; i < length; i++) {
        if (positions.length === 0) {
          let randomPosition = this.getRandomNumber(
            0,
            availableSpots.length - 1
          );
          positions.push(availableSpots[randomPosition]);
          availableSpots.splice(randomPosition, 1);
          // Try different coordinates
        } else {
          let positionToTheRight =
            positions[i - 1][0] + parseInt(positions[i - 1][1] + 1);
          if (availableSpots.includes(positionToTheRight)) {
            positions.push(positionToTheRight);
            availableSpots.filter(
              (position) => position !== positionToTheRight
            );
          }
        }
      }
      return positions;
    },

    getAvailableSpots(arrayOfCoordinates, unavailableSpots) {
      return arrayOfCoordinates.filter(
        (position) => !unavailableSpots.includes(position)
      );
    },

    getUnavailableSpots(board) {
      let unavailableSpots = [];
      for (let ship in board.ships) {
        board.ships[ship].positions.forEach((position) => {
          unavailableSpots.push(position);
        });
      }
      return unavailableSpots;
    },

    getArrayOfCoordinates() {
      let arrayOf100Numbers = [...Array(100).keys()].map((x) => ++x);
      let arrayOfCoordinates = [];
      for (let i = 0; i < arrayOf100Numbers.length; i++) {
        if (arrayOf100Numbers[i] < 11) {
          arrayOfCoordinates.push('0' + (arrayOf100Numbers[i] - 1));
        } else if (arrayOf100Numbers[i].toString()[1] === '0') {
          arrayOfCoordinates.push(
            (arrayOf100Numbers[i] - 1).toString()[0] + '9'
          );
        } else {
          arrayOfCoordinates.push(
            arrayOf100Numbers[i].toString()[0] +
              (parseInt(arrayOf100Numbers[i].toString()[1]) - 1)
          );
        }
      }
      return arrayOfCoordinates;
    },

    getRandomNumber(min, max) {
      return (Math.random() * (max - min + 1)) << 0;
    },
  },
};
</script>
