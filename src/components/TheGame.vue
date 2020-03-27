<template>
  <v-row justify="center">
    <v-col cols="6">
      <v-card class="mx-auto" width="330">
        <div class="grid-container">
          <div
            v-for="n in 100"
            :id="getCoordinates(n)"
            :key="getCoordinates(n)"
            class="cell"
          >
            <div
              :class="{ blue: colorMeBlue(computerShips, getCoordinates(n)) }"
            ></div>
          </div>
        </div>
      </v-card>
    </v-col>
    <v-col cols="6">
      <v-card class="mx-auto" width="330"
        ><div class="grid-container">
          <div
            v-for="n in 100"
            :id="getCoordinates(n)"
            :key="getCoordinates(n)"
            class="cell"
          >
            {{ getCoordinates(n) }}
          </div>
        </div></v-card
      >
    </v-col>
    <div>{{ computerShips }}</div>
  </v-row>
</template>

<script>
export default {
  props: {
    computerBoard: {
      type: Object,
      required: true,
    },
  },
  data() {
    return { computerShips: this.getShipsCoordinates(this.computerBoard) };
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
    getShipsCoordinates(board) {
      let coordinates = [];
      for (let ship in board.ships) {
        coordinates.push(board.ships[ship].positions);
      }
      return coordinates;
    },
    colorMeBlue(ships, id) {
      return ships.some((ship) => ship.includes(id));
    },
  },
};
</script>

<style>
.cell {
  width: 33px;
  height: 33px;
  border: 1px solid black;
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
</style>
