var move = function(gameData, helpers) {
	"use strict";

	var hero = gameData.activeHero,
		nearestWell = helpers.findNearestObjectDirectionAndDistance(gameData.board, hero, function(wellTile) {
			if (wellTile.type === 'HealthWell') {
				return true;
			}
		}),
		nearestNonTeamDiamondMine = helpers.findNearestObjectDirectionAndDistance(gameData.board, hero, function(mineTile) {
			if (mineTile.type === 'DiamondMine') {
				if (mineTile.owner) {
					return mineTile.owner.team !== hero.team;
				}

				return true;
			}

			return false;
		}),
		nearestEnemy = helpers.findNearestObjectDirectionAndDistance(gameData.board, hero, function(enemyTile) {
    		return enemyTile.type === 'Hero' && enemyTile.team !== hero.team;
  		}),
  		decision;

	if (hero.health < 50) {
		decision = {
			action: 'heal',
			move: nearestWell.direction
		};
	} else if (hero.health < 100 && nearestWell.distance < 2) {
		decision = {
			action: 'heal full',
			move: nearestWell.direction
		};
	} else if (nearestNonTeamDiamondMine.distance > nearestEnemy.distance) {
		decision = {
			action: 'fight',
			move: nearestEnemy.direction
		};
	} else {
		decision = {
			action: 'conquer',
			move: nearestNonTeamDiamondMine.direction
		};
	}

	//console.log(decision);

	return decision.move;
};

module.exports = move;