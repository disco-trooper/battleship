<template>
  <v-row justify="center">
    <v-col cols="6">
      <v-card class="mx-auto" width="330"
        ><div class="grid-container">
          <div
            v-for="n in 100"
            :id="coordinates(n)"
            :key="n"
            class="cell"
          ></div></div
      ></v-card>
    </v-col>
    <v-col cols="6">
      <v-card class="mx-auto" width="330"
        ><div class="grid-container">
          <div
            v-for="n in 100"
            :id="coordinates(n)"
            :key="n"
            class="cell"
          ></div></div
      ></v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    coordinates(n) {
      let characters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
      if (n < 11) {
        return 'A' + n.toString();
      } else if (n.toString()[1] === '0') {
        return characters[n.toString()[0] - 1] + '1' + n.toString()[1];
      } else if (n > 10) {
        return characters[n.toString()[0]] + n.toString()[1];
      }
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

.grid-container {
  display: grid;
  grid-gap: 0 0;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-areas: '. . . . . . . . . .' '. . . . . . . . . .' '. . . . . . . . . .' '. . . . . . . . . .' '. . . . . . . . . .' '. . . . . . . . . .' '. . . . . . . . . .' '. . . . . . . . . .' '. . . . . . . . . .';
}
</style>
