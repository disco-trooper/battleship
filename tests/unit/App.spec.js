import { shallowMount } from '@vue/test-utils';
import App from '@/App.vue';

describe('App.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(App);
  });

  it('renders a vue instance', () => {
    expect(wrapper.isVueInstance()).toBe(true);
  });

  it('generateShipCoordinates() returns coordinates', () => {
    let board = wrapper.vm.gameBoardFactory();
    let ship = wrapper.vm.shipFactory(
      5,
      wrapper.vm.generateShipCoordinates(5, board),
      board
    );
    board.placeShip(ship);
    expect(board.ships[0].positions.length).toBe(5);
  });

  describe('shipFactory()', () => {
    it('shipFactory returns ship', () => {
      let board = wrapper.vm.gameBoardFactory();
      let ship = wrapper.vm.shipFactory(2, ['12', '22'], board);
      expect(ship).toHaveProperty('length', 2);
      expect(ship).toHaveProperty('positions', ['12', '22']);
    });

    it('hit() hits ship', () => {
      let board = wrapper.vm.gameBoardFactory();
      let ship = wrapper.vm.shipFactory(1, ['23'], board);
      ship.hit('23');
      expect(ship.hitPositions).toEqual(['23']);
    });

    it('hit() misses ship', () => {
      let board = wrapper.vm.gameBoardFactory();
      let ship = wrapper.vm.shipFactory(1, ['23'], board);
      ship.hit('24');
      expect(ship.hitPositions).toEqual([]);
    });

    it("isSunk() method doesn't sink ship", () => {
      let board = wrapper.vm.gameBoardFactory();
      let ship = wrapper.vm.shipFactory(1, ['23'], board);
      expect(ship.isSunk()).toBe(false);
    });

    it('isSunk() method sinks ship', () => {
      let board = wrapper.vm.gameBoardFactory();
      let ship = wrapper.vm.shipFactory(1, ['23'], board);
      ship.hit('23');
      expect(ship.isSunk()).toBe(true);
    });
  });

  describe('gameBoardFactory()', () => {
    it('returns game board', () => {
      let board = wrapper.vm.gameBoardFactory();
      expect(board).toHaveProperty('missedHits');
      expect(board).toHaveProperty('takenHits');
      expect(board).toHaveProperty('ships');
      expect(board).toHaveProperty('placeShip');
      expect(board).toHaveProperty('receiveAttack');
    });

    it('places ship', () => {
      let board = wrapper.vm.gameBoardFactory();
      let ship = wrapper.vm.shipFactory(1, ['22', '23'], board);
      board.placeShip(ship);
      expect(board.ships).toContain(ship);
    });

    it('receives attack', () => {
      let board = wrapper.vm.gameBoardFactory();
      let ship = wrapper.vm.shipFactory(1, ['22', '23'], board);
      board.placeShip(ship);
      expect(board.receiveAttack('22')).toBe(false);
      expect(board.missedHits).toEqual([]);
      expect(board.ships[0].hitPositions).toEqual(['22']);
      expect(board.ships[0].isSunk()).toBe(false);
    });

    it('logs missed attack', () => {
      let board = wrapper.vm.gameBoardFactory();
      let ship = wrapper.vm.shipFactory(1, ['22', '23'], board);
      board.placeShip(ship);
      board.receiveAttack('24');
      expect(board.ships[0].hitPositions).toEqual([]);
      expect(board.missedHits).toEqual(['24']);
    });

    it('sinks ship', () => {
      let board = wrapper.vm.gameBoardFactory();
      let ship = wrapper.vm.shipFactory(1, ['22', '23'], board);
      board.placeShip(ship);
      expect(board.receiveAttack('22')).toBe(false);
      expect(board.receiveAttack('23')).toBe(true);
      expect(board.missedHits).toEqual([]);
      expect(board.ships[0].hitPositions).toEqual(['22', '23']);
      expect(board.ships[0].isSunk()).toBe(true);
    });
  });

  describe('Player', () => {
    it('exists', () => {
      let player = wrapper.vm.player;
      expect(player).toBeDefined();
    });

    it('hits enemy ship', () => {
      let board = wrapper.vm.gameBoardFactory();
      let ship = wrapper.vm.shipFactory(2, ['22', '23'], board);
      let player = wrapper.vm.player;
      board.placeShip(ship);
      player.hit('22', board);
      expect(board.missedHits).toEqual([]);
      expect(board.ships[0].hitPositions).toEqual(['22'], board);
      expect(board.ships[0].isSunk()).toBe(false);
    });
  });

  describe('Computer', () => {
    it('makes attack', () => {
      let board = wrapper.vm.gameBoardFactory();
      let ship = wrapper.vm.shipFactory(2, ['22', '23'], board);
      let computer = wrapper.vm.computer;
      let characters = wrapper.vm.characters;
      board.placeShip(ship);
      computer.makeAttack(board, characters);
      expect(computer.previousAttack).not.toEqual([]);
    });
  });
});
