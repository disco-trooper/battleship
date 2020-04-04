const gameBoardHelper = (() => {
  function getAvailableSpots(arrayOfCoordinates, unavailableSpots) {
    return arrayOfCoordinates.filter(
      (position) => !unavailableSpots.includes(position)
    );
  }

  function getUnavailableSpots(board) {
    let unavailableSpots = [];
    for (let ship in board.ships) {
      board.ships[ship].positions.forEach((position) => {
        unavailableSpots.push(position);
      });
    }
    return unavailableSpots;
  }

  function getArrayOfCoordinates() {
    let arrayOf100Numbers = [...Array(100).keys()].map((x) => ++x);
    let arrayOfCoordinates = [];
    for (let i = 0; i < arrayOf100Numbers.length; i++) {
      if (arrayOf100Numbers[i] < 11) {
        arrayOfCoordinates.push('0' + (arrayOf100Numbers[i] - 1));
      } else if (arrayOf100Numbers[i].toString()[1] === '0') {
        arrayOfCoordinates.push((arrayOf100Numbers[i] - 1).toString()[0] + '9');
      } else {
        arrayOfCoordinates.push(
          arrayOf100Numbers[i].toString()[0] +
            (parseInt(arrayOf100Numbers[i].toString()[1]) - 1)
        );
      }
    }
    return arrayOfCoordinates;
  }

  return { getArrayOfCoordinates, getAvailableSpots, getUnavailableSpots };
})();

export { gameBoardHelper };
