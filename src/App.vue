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
      characters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
      ship: this.shipFactory(2, ['A1', 'A2']),
      ship2: this.shipFactory(3, ['D3', 'E3', 'F3']),
      computerBoard: this.gameBoardFactory(),
      playerBoard: this.gameBoardFactory(),
      player: {
        hit(position, board) {
          board.receiveAttack(position);
        },
      },
      computer: {
        previousAttacks: [],
        makeAttack(board, characters) {
          let randomNumber = Math.floor(Math.random() * 10) + 1;
          let attack =
            characters[Math.floor(Math.random() * 10)] + randomNumber;
          while (this.previousAttacks.includes(attack)) {
            randomNumber = Math.floor(Math.random() * 10) + 1;
            attack = characters[Math.floor(Math.random() * 10)] + randomNumber;
          }
          board.receiveAttack(attack);
          this.previousAttacks.push(attack);
        },
      },
    };
  },
  created() {
    this.computerBoard.placeShip(this.ship);
    this.computerBoard.placeShip(this.ship2);
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

    // getShipCoordinates(board) {
    //   let characters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    //   let characterIndexes = {
    //     A: 0,
    //     B: 1,
    //     C: 2,
    //     D: 3,
    //     E: 4,
    //     F: 5,
    //     G: 6,
    //     H: 7,
    //     I: 8,
    //     J: 9,
    //   };
    //   let randomNumber = Math.floor(Math.random() * 10) + 1;
    //   let unavailableSpots = [];

    //   // Gets unavailable spots
    //   for (let ship in board.ships) {
    //     board.ships[ship].positions.forEach((position) => {
    //       unavailableSpots.push(position);
    //       if (position[0] === 'A') {
    //         unavailableSpots.push(position[0] + (parseInt(position[1]) - 1));
    //         unavailableSpots.push(position[0] + (parseInt(position[1]) + 1));
    //         unavailableSpots.push('B' + (parseInt(position[1]) - 1));
    //         unavailableSpots.push('B' + parseInt(position[1]));
    //         unavailableSpots.push('B' + (parseInt(position[1]) + 1));
    //       } else if (position[0] === 'J') {
    //         unavailableSpots.push(position[0] + (parseInt(position[1]) - 1));
    //         unavailableSpots.push(position[0] + (parseInt(position[1]) + 1));
    //         unavailableSpots.push('I' + (parseInt(position[1]) - 1));
    //         unavailableSpots.push('I' + parseInt(position[1]));
    //         unavailableSpots.push('I' + (parseInt(position[1]) + 1));
    //       } else {
    //         let previousCharacter =
    //           characters[characterIndexes[position[0]] - 1];
    //         let nextCharacter = characters[characterIndexes[position[0]] + 1];
    //         unavailableSpots.push();
    //       }
    //     });
    //   }
    //   console.log(unavailableSpots);
    // },

    makeArrayUnique(array) {
      return [...new Set(array)];
    },
  },
};
</script>
