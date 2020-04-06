/* eslint-disable vue/no-v-html */
<template>
  <v-container>
    <v-row>
      <div class="mx-auto mt-3 mb-3 display-1 font-weight-light">
        Battleship
      </div>
    </v-row>
    <v-row>
      <div class="mx-auto mb-n6">
        <v-alert v-show="gameFlow.placingShips" outlined type="info">
          Place the ships
        </v-alert>
        <v-alert v-show="gameFlow.playerWin" outlined gray type="success">
          You have won!
        </v-alert>
        <v-alert v-show="gameFlow.computerWin" outlined gray type="error">
          Computer has won!
        </v-alert>
      </div>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card class="mx-auto mt-5 mr-md-12" width="320">
          <div class="xCoords">A</div>
          <div class="xCoords">B</div>
          <div class="xCoords">C</div>
          <div class="xCoords">D</div>
          <div class="xCoords">E</div>
          <div class="xCoords">F</div>
          <div class="xCoords">G</div>
          <div class="xCoords">H</div>
          <div class="xCoords">I</div>
          <div class="xCoords">J</div>
          <div class="grid">
            <div
              v-for="n in 100"
              :id="'P' + getCoordinates(n)"
              :key="getCoordinates(n)"
              class="gridCell"
            >
              <span class="yCoords">{{ getNumber(getCoordinates(n)) }}</span>
            </div>
            <div
              v-for="(ship, index) in playerBoard.ships"
              :id="index"
              :key="index"
              :data-length="ship.length"
              :data-direction="ship.direction"
              :style="{
                top: parseInt(ship.positions[0][0]) * 32 + 'px',
                left: parseInt(ship.positions[0][1]) * 32 + 'px',
                width:
                  ship.direction === 'horizontal'
                    ? (parseInt(ship.positions[ship.positions.length - 1][1]) -
                        parseInt(ship.positions[0][1]) +
                        1) *
                        32 +
                      1 +
                      'px'
                    : '33px',
                height:
                  ship.direction === 'vertical'
                    ? (parseInt(ship.positions[ship.positions.length - 1][0]) -
                        parseInt(ship.positions[0][0]) +
                        1) *
                        32 +
                      1 +
                      'px'
                    : '33px',
                opacity: '0.7',
              }"
              class="ship"
              :class="{
                gridSnap: gameFlow.placingShips,
                moveCursor: gameFlow.placingShips,
              }"
              @dblclick="rotateShip($event)"
            ></div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="mx-auto mt-5 ml-md-12" width="320">
          <div class="xCoords">A</div>
          <div class="xCoords">B</div>
          <div class="xCoords">C</div>
          <div class="xCoords">D</div>
          <div class="xCoords">E</div>
          <div class="xCoords">F</div>
          <div class="xCoords">G</div>
          <div class="xCoords">H</div>
          <div class="xCoords">I</div>
          <div class="xCoords">J</div>
          <div class="grid PC">
            <div
              v-for="n in 100"
              :id="getCoordinates(n)"
              :key="getCoordinates(n)"
              class="gridCell"
              :class="{ targetCursor: gameFlow.gameStarted }"
              @mouseenter="toggleHoverClass(true, $event)"
              @mouseleave="toggleHoverClass(false, $event)"
              @click="attack(getCoordinates(n))"
            >
              <span class="yCoords">{{ getNumber(getCoordinates(n)) }}</span>
            </div>
          </div>
        </v-card>
      </v-col>
      <div class="ship-types">
        <div>
          <span id="smallShip0" class="ship-little">
            <span class="ship-part"></span>
            <span class="ship-part"></span>
            <span class="ship-part"></span>
            <span class="ship-part"></span>
            <span class="ship-part"></span>
          </span>
        </div>
        <div>
          <span id="smallShip1" class="ship-little">
            <span class="ship-part"></span>
            <span class="ship-part"></span>
            <span class="ship-part"></span>
            <span class="ship-part"></span>
          </span>
        </div>
        <div>
          <span id="smallShip2" class="ship-little">
            <span class="ship-part"></span>
            <span class="ship-part"></span>
            <span class="ship-part"></span>
          </span>
        </div>
        <div>
          <span id="smallShip3" class="ship-little">
            <span class="ship-part"></span>
            <span class="ship-part"></span>
            <span class="ship-part"></span>
          </span>
        </div>
        <div>
          <span id="smallShip4" class="ship-little">
            <span class="ship-part"></span>
            <span class="ship-part"></span>
          </span>
        </div>
      </div>
    </v-row>
    <v-row
      ><div class="mx-auto mt-7">
        <v-btn
          v-if="!gameFlow.gameStarted"
          text
          color="primary"
          @click="
            gameFlow.gameStarted = true;
            gameFlow.placingShips = false;
            gameFlow.playerTurn = true;
            gameFlow.playerWin = false;
            gameFlow.computerWin = false;
          "
          >Start Game</v-btn
        ><v-btn
          v-if="gameFlow.gameStarted"
          text
          @click="
            gameFlow.gameStarted = false;
            gameFlow.placingShips = true;
            gameFlow.playerTurn = false;
            gameFlow.playerWin = false;
            gameFlow.computerWin = false;
            $emit('resetGame');
          "
          >Reset Game</v-btn
        >
      </div></v-row
    >
  </v-container>
</template>

<script>
import { gameBoardHelper } from '../plugins/gameBoardHelper';
import interact from 'interactjs';
export default {
  props: {
    computerBoard: {
      type: Object,
      required: true,
    },
    playerBoard: {
      type: Object,
      required: true,
    },
    gameFlow: {
      type: Object,
      required: true,
    },
    player: {
      type: Object,
      required: true,
    },
    computer: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  mounted() {
    // Drag 'n Snapping
    const that = this;
    let x = 0;
    let y = 0;
    let eventTarget;
    let newCoordinates;
    interact('.gridSnap')
      .draggable({
        modifiers: [
          interact.modifiers.snap({
            targets: [interact.createSnapGrid({ x: 32, y: 32 })],
            range: Infinity,
            relativePoints: [{ x: 0, y: 0 }],
            offset: 'parent',
          }),
          interact.modifiers.restrict({
            restriction: 'parent',
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
            endOnly: true,
          }),
        ],
        inertia: false,
      })
      .on('dragmove', function (event) {
        const length = event.target.getAttribute('data-length');
        const direction = event.target.getAttribute('data-direction');
        x += event.dx;
        y += event.dy;
        eventTarget = event.target;
        event.target.style.webkitTransform = event.target.style.transform =
          'translate(' + x + 'px, ' + y + 'px)';
        newCoordinates = [
          Math.round(
            (parseInt(event.target.style.top.replace('px', '')) + y) / 32
          ).toString() +
            Math.round(
              (parseInt(event.target.style.left.replace('px', '')) + x) / 32
            ).toString(),
        ];
        for (let i = 1; i < length; i++) {
          if (length === 1) return;
          if (direction === 'horizontal') {
            newCoordinates.push(
              Math.round(
                (parseInt(event.target.style.top.replace('px', '')) + y) / 32
              ).toString() +
                Math.round(
                  (parseInt(event.target.style.left.replace('px', '')) + x) /
                    32 +
                    i
                ).toString()
            );
          } else if (direction === 'vertical') {
            newCoordinates.push(
              Math.round(
                (parseInt(event.target.style.top.replace('px', '')) + y) / 32 +
                  i
              ).toString() +
                Math.round(
                  (parseInt(event.target.style.left.replace('px', '')) + x) / 32
                ).toString()
            );
          }
        }
      })
      .on('dragend', function () {
        let shipPositions = that.playerBoard.ships.filter((obj) => {
          return obj.id === parseInt(eventTarget.getAttribute('id'));
        })[0].positions;
        if (
          newCoordinates.some(
            (position) =>
              !gameBoardHelper
                .getAvailableSpots(
                  gameBoardHelper.getArrayOfCoordinates(),
                  gameBoardHelper.getUnavailableSpots(that.playerBoard)
                )
                .concat(shipPositions)
                .includes(position)
          )
        ) {
          eventTarget.style.webkitTransform = eventTarget.style.transform =
            'translate(' + 0 + 'px, ' + 0 + 'px)';
        } else {
          let ship = that.playerBoard.ships.filter((obj) => {
            return obj.id === parseInt(event.target.getAttribute('id'));
          });
          ship[0].positions = newCoordinates;
          eventTarget.style.webkitTransform = eventTarget.style.transform =
            'translate(' + 0 + 'px, ' + 0 + 'px)';
        }
        x = 0;
        y = 0;
      });
  },

  methods: {
    rotateShip(event) {
      if (this.gameFlow.gameStarted) return;
      let availableSpots = gameBoardHelper.getAvailableSpots(
        gameBoardHelper.getArrayOfCoordinates(),
        gameBoardHelper.getUnavailableSpots(this.playerBoard)
      );
      const positions = this.playerBoard.ships.filter((obj) => {
        return obj.id === parseInt(event.target.getAttribute('id'));
      })[0].positions;
      availableSpots.push(positions[0]);
      if (event.target.getAttribute('data-direction') === 'vertical') {
        let newPositions = [];
        for (let i = 0; i < positions.length; i++) {
          if (i === 0) newPositions.push(positions[0]);
          else
            newPositions.push(
              positions[0][0].toString() + (parseInt(positions[0][1]) + i)
            );
        }
        if (
          newPositions.some((position) => !availableSpots.includes(position))
        ) {
          return;
        }
        [event.target.style.width, event.target.style.height] = [
          event.target.style.height,
          event.target.style.width,
        ];
        this.playerBoard.ships[
          parseInt(event.target.getAttribute('id'))
        ].positions = newPositions;
        event.target.setAttribute('data-direction', 'horizontal');
      } else if (event.target.getAttribute('data-direction') === 'horizontal') {
        let newPositions = [];
        for (let i = 0; i < positions.length; i++) {
          if (i === 0) newPositions.push(positions[0]);
          else
            newPositions.push(
              parseInt(positions[0][0]) + i + positions[0][1].toString()
            );
        }
        if (
          newPositions.some((position) => !availableSpots.includes(position))
        ) {
          return;
        }
        [event.target.style.width, event.target.style.height] = [
          event.target.style.height,
          event.target.style.width,
        ];
        this.playerBoard.ships[
          parseInt(event.target.getAttribute('id'))
        ].positions = newPositions;
        event.target.setAttribute('data-direction', 'vertical');
      }
    },

    attack(coordinates) {
      if (this.gameFlow.playerTurn === true) {
        const preHitComputerMissedLength = this.computerBoard.missedHits.length;
        this.player.hit(coordinates, this.computerBoard);
        const afterHitComputerMissedLength = this.computerBoard.missedHits
          .length;
        if (preHitComputerMissedLength !== afterHitComputerMissedLength) {
          document.getElementById(coordinates).classList.add('miss');
          this.gameFlow.playerTurn = false;
          this.computerAttack(this.computer, this.gameFlow, this.playerBoard);
          return;
        }
        document.getElementById(coordinates).classList.add('hit');
        for (let ship in this.computerBoard.ships) {
          if (this.computerBoard.ships[ship].isSunk() === true) {
            const shipID = this.computerBoard.ships[ship].id;
            const shipParts = document.getElementById('smallShip' + shipID);
            shipParts.children.forEach((part) => {
              part.className = 'ship-part-killed';
            });
          }
        }
        if (this.computerBoard.takenHits.length === 17) {
          this.gameFlow.playerWin = true;
          return;
        }
        return;
      }
    },
    computerAttack(computerObject, gameFlowObject, board) {
      const preHitPlayerMissedLength = board.missedHits.length;
      computerObject.makeAttack(board);
      const afterHitPlayerMissedLength = board.missedHits.length;
      if (preHitPlayerMissedLength !== afterHitPlayerMissedLength) {
        document
          .getElementById('P' + board.missedHits[board.missedHits.length - 1])
          .classList.add('miss');
        gameFlowObject.playerTurn = true;
        return;
      }
      document
        .getElementById('P' + board.takenHits[board.takenHits.length - 1])
        .classList.add('hit');
      if (this.playerBoard.takenHits.length === 17) {
        this.gameFlow.computerWin = true;
        return;
      }
      return this.computerAttack(computerObject, gameFlowObject, board);
    },

    toggleHoverClass(boolean, event) {
      if (
        boolean === true &&
        this.gameFlow.gameStarted &&
        this.gameFlow.playerTurn === true &&
        !event.target.classList.contains('hit') &&
        !event.target.classList.contains('miss')
      )
        event.target.classList.add('hover');
      else if (boolean === false) event.target.classList.remove('hover');
    },

    getCoordinates(n) {
      if (n < 11) {
        return '0' + (n - 1);
      } else if (n.toString()[1] === '0') {
        return (n - 1).toString()[0] + '9';
      } else {
        return n.toString()[0] + (parseInt(n.toString()[1]) - 1);
      }
    },

    getNumber(coords) {
      if (coords === '00') return '1';
      else if (parseInt(coords) % 10 === 0)
        return (parseInt(coords[0]) + 1).toString();
      else return '';
    },
  },
};
</script>

<style>
@media only screen and (min-width: 1400px) {
  .ship-types {
    display: block;
    position: absolute;
    top: 24%;
    left: 78%;
    box-sizing: border-box;
  }
}

@media only screen and (max-width: 1399px) {
  .ship-types {
    display: block;
    position: absolute;
    top: 24%;
    left: 80%;
    box-sizing: border-box;
  }
}

@media only screen and (max-width: 1270px) {
  .ship-types {
    display: block;
    position: absolute;
    top: 24%;
    left: 83%;
    box-sizing: border-box;
  }
}

@media only screen and (max-width: 1160px) {
  .ship-types {
    display: block;
    position: absolute;
    top: 24%;
    left: 86%;
    box-sizing: border-box;
  }
}
@media only screen and (max-width: 1030px) {
  .ship-types {
    display: block;
    position: absolute;
    top: 24%;
    left: 89%;
    box-sizing: border-box;
  }
}

@media only screen and (max-width: 1050px) {
  .ship-types {
    display: block;
    position: absolute;
    top: 24%;
    left: 89%;
    box-sizing: border-box;
  }
}

@media only screen and (max-width: 960px) {
  .ship-types {
    display: block;
    position: absolute;
    top: 24%;
    left: 68%;
    box-sizing: border-box;
  }
}

@media only screen and (max-width: 890px) {
  .ship-types {
    display: block;
    position: absolute;
    top: 24%;
    left: 71%;
    box-sizing: border-box;
  }
}
@media only screen and (max-width: 752px) {
  .ship-types {
    display: block;
    position: absolute;
    top: 24%;
    left: 74%;
    box-sizing: border-box;
  }
}

@media only screen and (max-width: 660px) {
  .ship-types {
    display: block;
    position: absolute;
    top: 24%;
    left: 77%;
    box-sizing: border-box;
  }
}
@media only screen and (max-width: 856px) {
  .ship-types {
    display: block;
    position: absolute;
    top: 24%;
    left: 82%;
    box-sizing: border-box;
  }
}

@media only screen and (max-width: 415px) {
  .ship-types {
    display: none;
    position: absolute;
    top: 24%;
    left: 88%;
    box-sizing: border-box;
  }
}

.ship-little:last-child {
  margin-right: 0;
}
.ship-little {
  margin: 0 7px 0;
  margin-right: 7px;
  display: inline-block;
}
.ship-part {
  width: 7px;
  height: 7px;
  margin: 0 1px 0 0;
  background: #c5c5ff;
  display: block;
  float: left;
}

.ship-part-killed {
  background: #ffaeae;
  display: block;
  float: left;
  width: 7px;
  height: 7px;
  margin: 0 1px 0 0;
}

.hit {
  background-color: red;
  opacity: 0.7;
}

.miss::before {
  position: absolute;
  height: 4px;
  width: 4px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  content: '';
  background-color: rgb(51, 51, 51);
  border-radius: 50%;
}

.miss {
  position: relative;
  box-shadow: rgb(180, 180, 255) 1px 0px 0px 0px,
    rgb(180, 180, 255) 0px 1px 0px 0px, rgb(180, 180, 255) 1px 1px 0px 0px,
    rgb(180, 180, 255) 1px 0px 0px 0px inset,
    rgb(180, 180, 255) 0px 1px 0px 0px inset;
  background-color: rgb(238, 238, 238);
}

.targetCursor {
  cursor: cell;
}

.PC > .hover {
  border: 2px solid #40bf44;
  background: rgba(64, 191, 68, 0.05);
  width: 2em;
  height: 2em;
  content: '';
  display: block;
  z-index: 2;
}

.blue {
  background-color: aqua;
  opacity: 0.5;
  width: 32px;
  height: 32px;
}

.grid-container {
  display: grid;
  grid-gap: 0 0;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-areas: '. . . . . . . . . .' '. . . . . . . . . .' '. . . . . . . . . .' '. . . . . . . . . .' '. . . . . . . . . .' '. . . . . . . . . .' '. . . . . . . . . .' '. . . . . . . . . .' '. . . . . . . . . .';
}

#grid-snap {
  width: 40%;
  background-color: #29e;
  color: #fff;
  font-size: 1.2em;
  border-radius: 4px;
  padding: 2%;
  margin: 5%;
  touch-action: none;
}

.xCoords {
  display: inline-block;
  width: 32px;
  text-align: center;
}

.yCoords {
  margin: -22px;
}

.grid {
  grid-template-columns: repeat(10, 32px);
  grid-template-rows: repeat(10, 32px);
  position: relative;
  display: grid;
  border: thin black;
}

.gridCell {
  box-shadow: rgb(180, 180, 255) 1px 0px 0px 0px,
    rgb(180, 180, 255) 0px 1px 0px 0px, rgb(180, 180, 255) 1px 1px 0px 0px,
    rgb(180, 180, 255) 1px 0px 0px 0px inset,
    rgb(180, 180, 255) 0px 1px 0px 0px inset;
}

.ship {
  position: absolute;
  border: 2px solid rgb(0, 0, 255);
  background-color: rgba(0, 0, 255, 0.05);
  z-index: 4;
}

.moveCursor {
  cursor: move;
}

body {
  user-select: none;
}
</style>
