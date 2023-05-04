// **** Functions **** //
import { readJSONSync } from "fs-extra";
import { Player } from "@src/models/player";

/* #region Parse data for source.json */
/**
 * 
 * @param data from statistic home/away
 * @returns 
 */
const parseHomeAwayFromSource = (data: any)=> {
  let rushingObj = data.rushing.totals;
  let receivingObj = data.receiving.totals;
  return {
      id: data.id,
      rushAttempts: rushingObj.attempts,
      rushTds: rushingObj.touchdowns,
      rushYdsGained: rushingObj.yards,
      rec: receivingObj.receptions,
      receivingYards: receivingObj.yards,
  }
}

const checkPlayerExist = (players: Player[] , _player: Player)=> {
  players.forEach((player, index)=>{
    if(player.id === _player.id)return index;
  })

  return -1;
}

const parsePlayerFromSource = (data: any)=> {
  let players: Player[] = [];
  let rushingPlayers = data.rushing.players;
  let receivingPlayers = data.receiving.players;

  for(let player of rushingPlayers){
      players.push(player)
  }

  for(let player of receivingPlayers){
      let checkExist = checkPlayerExist(players, player);
      
      if(checkExist>=0){
          players[checkExist] = {...players[checkExist], ...player}
      }else{
          players.push(player);
      }
  }

  return players;
}

const parseGameFromSource = (data: any)=> {
    return {
        gameId: data.id,
        attendance: data.attendance,
    }
}
/* #endregion */

/* #region Parse data for external.json */
const parseHomeAwayFromExternal = (data: any)=> {
  return {
      id: data.id,
      rushAttempts: data.rushAttempts,
      rushTds: data.rushTds,
      rushYdsGained: data.rushYdsGained,
      rec: data.rec,
      receivingYards: data.receivingYards,
  }
}

const parsePlayerFromExternal = (data: any)=> {
    let players: Player[] = [];
    let rushingPlayers = data.rushing.players;
    let receivingPlayers = data.receiving.players;

    for(let player of rushingPlayers){
        players.push(player)
    }

    for(let player of receivingPlayers){
        let checkExist = checkPlayerExist(players, player);
        if(checkExist>=0){
            players[checkExist] = {...players[checkExist] , ...player}
        }else{
            players.push(player);
        }
    }
    return players;
}

const parseGameFromExternal = (data: any)=> {
    return {
        gameId: data.id,
        attendance: data.attendance,
    }
}
/* #endregion */

/**
 * parse source data to new structure that can compare with external file
 * @param inputData data from source file
 * @returns 
 */
const parseSourceInputToCompareFormat = async(inputData: any , mode = 0)=> {
    const { statistics, game } = inputData;

    var newStatistic = {
        home: parseHomeAwayFromSource(statistics.home),
        away: parseHomeAwayFromSource(statistics.away),
        homePlayers: parsePlayerFromSource(statistics.home),
        awayPlayers: parsePlayerFromSource(statistics.away),
        game: parseGameFromSource(game)
    };

    return newStatistic;
}



/**
 * 
 * @param inputData data from external file
 * @returns 
 */
const parseExternalInputToCompareFormat = async(inputData: any, mode=0)=> {
	const { game } = inputData;
	let newStatistic = {
		home: parseHomeAwayFromExternal(game.home),
		away: parseHomeAwayFromExternal(game.away),
		homePlayers: parsePlayerFromExternal(game.home),
		awayPlayers: parsePlayerFromExternal(game.away),
		game: parseGameFromExternal(game)
	};
	return newStatistic;
}

/**
 * Get by mode0
 */
const getDataByField = async(mode = 0)=> {
    const externalData = readJSONSync(__dirname + '/' + 'external.json');
    const sourceData = readJSONSync(__dirname + '/' + 'source.json');
	const newExternalData = parseExternalInputToCompareFormat (externalData , mode);
    const newSourceData = parseSourceInputToCompareFormat(sourceData , mode);

    return newExternalData;
}

/**
 * Get all.
 */
const getAll = async()=> {
    return getDataByField();
}

async function filterByGame() {
    return getDataByField(1);
}

// **** Export default **** //

export default {
    getAll,
} as const;
