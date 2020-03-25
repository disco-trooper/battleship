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

  describe('shipFactory()', () => {
    it('shipFactory returns ship', () => {
      expect(wrapper.vm.shipFactory(2, ['B2', 'C2'])).toHaveProperty(
        'length',
        2
      );
      expect(
        wrapper.vm.shipFactory(2, ['B2', 'C2'])
      ).toHaveProperty('positions', ['B2', 'C2']);
    });

    it('hit() hits ship', () => {
      let ship = wrapper.vm.shipFactory(1, ['C3']);
      ship.hit('C3');
      expect(ship.hitPositions).toEqual(['C3']);
    });

    it('hit() misses ship', () => {
      let ship = wrapper.vm.shipFactory(1, ['C3']);
      ship.hit('C4');
      expect(ship.hitPositions).toEqual([]);
    });

    it("isSunk() method doesn't sink ship", () => {
      let ship = wrapper.vm.shipFactory(1, ['C3']);
      expect(ship.isSunk()).toBe(false);
    });

    it('isSunk() method sinks ship', () => {
      let ship = wrapper.vm.shipFactory(1, ['C3']);
      ship.hit('C3');
      expect(ship.isSunk()).toBe(true);
    });
  });

  describe('gameBoardFactory()', () => {
    it('returns game board', () => {
      let board = wrapper.vm.gameBoardFactory();
      expect(board).toHaveProperty('missed');
      expect(board).toHaveProperty('ships');
      expect(board).toHaveProperty('placeShip');
      expect(board).toHaveProperty('receiveAttack');
    });

    it('places ship', () => {
      let board = wrapper.vm.gameBoardFactory();
      let ship = wrapper.vm.shipFactory(1, ['C2', 'C3']);
      board.placeShip(ship);
      expect(board.ships).toContain(ship);
    });

    it('receives attack', () => {
      let board = wrapper.vm.gameBoardFactory();
      let ship = wrapper.vm.shipFactory(1, ['C2', 'C3']);
      board.placeShip(ship);
      expect(board.receiveAttack('C2')).toBe('not sunk');
      expect(board.missed).toEqual([]);
      expect(board.ships[0].hitPositions).toEqual(['C2']);
      expect(board.ships[0].isSunk()).toBe(false);
    });

    it('logs missed attack', () => {
      let board = wrapper.vm.gameBoardFactory();
      let ship = wrapper.vm.shipFactory(1, ['C2', 'C3']);
      board.placeShip(ship);
      board.receiveAttack('C4');
      expect(board.ships[0].hitPositions).toEqual([]);
      expect(board.missed).toEqual(['C4']);
    });

    it('sinks ship', () => {
      let board = wrapper.vm.gameBoardFactory();
      let ship = wrapper.vm.shipFactory(1, ['C2', 'C3']);
      board.placeShip(ship);
      expect(board.receiveAttack('C2')).toBe('not sunk');
      expect(board.receiveAttack('C3')).toBe('sunk');
      expect(board.missed).toEqual([]);
      expect(board.ships[0].hitPositions).toEqual(['C2', 'C3']);
      expect(board.ships[0].isSunk()).toBe(true);
    });
  });

  describe('Player', () => {
    it('exists', () => {
      expect(wrapper.vm.player).toBeDefined();
    });

    it('hits enemy ship', () => {
      let board = wrapper.vm.gameBoardFactory();
      let ship = wrapper.vm.shipFactory(2, ['C2', 'C3']);
      let player = wrapper.vm.player;
      board.placeShip(ship);
      player.hit('C2', board);
      expect(board.missed).toEqual([]);
      expect(board.ships[0].hitPositions).toEqual(['C2']);
      expect(board.ships[0].isSunk()).toBe(false);
    });
  });

  describe('Computer', () => {
    it('makes attack', () => {
      let board = wrapper.vm.gameBoardFactory();
      let ship = wrapper.vm.shipFactory(2, ['C2', 'C3']);
      let computer = wrapper.vm.computer;
      let characters = wrapper.vm.characters;
      board.placeShip(ship);
      computer.makeAttack(board, characters);
      expect(computer.previousAttack).not.toEqual([]);
    });
  });
});
