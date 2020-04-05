<template>
  <v-container>
    <v-row>
      <div class="mx-auto">
        <v-alert outlined gray type="info">Place the ships</v-alert>
      </div>
    </v-row>
    <v-row justify="center">
      <v-col cols="6">
        <v-card class="mx-auto mt-5 mr-12" width="320">
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
              :key="getCoordinates(n)"
              class="gridCell"
              v-html="
                getNumber(getCoordinates(n)) !== false
                  ? getNumber(getCoordinates(n))
                  : ''
              "
            ></div>
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
              :class="{ gridSnap: placingShips, moveCursor: placingShips }"
            ></div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card class="mx-auto mt-5 ml-12" width="320">
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
              :key="getCoordinates(n)"
              class="gridCell"
              v-html="
                getNumber(getCoordinates(n)) !== false
                  ? getNumber(getCoordinates(n))
                  : ''
              "
            ></div>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row
      ><div class="mx-auto mt-7">
        <v-btn text color="primary">Start Game</v-btn
        ><v-btn text>Reset Game</v-btn>
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
    placingShips: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {};
  },
  created() {
    console.log('Reload');
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
          that.$emit('shipMove', that.playerBoard);
        }

        x = 0;
        y = 0;
      });
  },

  methods: {
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
      if (coords === '00') return '<span class="yCoords">1</span>';
      else if (parseInt(coords) % 10 === 0)
        return (
          '<span class="yCoords">' +
          (parseInt(coords[0]) + 1).toString() +
          '</span>'
        );
      else return false;
    },
  },
};
</script>

<style>
.cell {
  width: 33px;
  height: 33px;
  border: 1px solid hsl(0, 0%, 50%);
  margin: 0;
  padding: 0;
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
