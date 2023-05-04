// **** Functions **** //
import { readJSONSync } from "fs-extra";
import { Player } from "@src/models/player";
import { FilterType } from "@src/models/FilterType";
import { ParsedType } from "@src/models/ParsedType";

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

const checkPlayerExist = (players: any[], _player: Player)=> {
  players.forEach((player, index)=>{
    if(player.id === _player.id)return index;
  })

  return -1;
}

const parsePlayerFromSource = (data: any)=> {
  let players = [];
  let rushingPlayers = data.rushing.players;
  let receivingPlayers = data.receiving.players;

  for(let player of rushingPlayers){
	players.push({
		id: player.id,
		rushAttempts: player.attempts,
		rushTds: player.touchdowns,
		rushYdsGained: player.yards,
	})
  }

  for(let player of receivingPlayers){
      let checkExist = checkPlayerExist(players, player);
      
      if(checkExist>=0){
		players[checkExist] = {...players[checkExist], ...{
			rec: player.receptions,
			receivingYards: player.yards
		}}
      }else{
		players.push({
			id: player.id,
			rec: player.receptions,
			receivingYards: player.yards,
		});
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

    for(let player of data.players){
        players.push(player)
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

    let newStatistic: ParsedType = {
        home: undefined,
        away: undefined,
        homePlayers: undefined,
        awayPlayers: undefined,
        game: undefined
    };

	if(mode == FilterType.All || mode == FilterType.Team){
        newStatistic.home = parseHomeAwayFromSource(statistics.home);
        newStatistic.away = parseHomeAwayFromSource(statistics.away);
    }

    if(mode == FilterType.All || mode == FilterType.Player){
        newStatistic.homePlayers = parsePlayerFromSource(statistics.home);
        newStatistic.awayPlayers = parsePlayerFromSource(statistics.away);
    }

    if(mode == FilterType.All || mode == FilterType.Game){
        newStatistic.game = parseGameFromSource(game)
    }

    return newStatistic;
}



/**
 * 
 * @param inputData data from external file
 * @returns 
 */
const parseExternalInputToCompareFormat = async(inputData: any, mode=0)=> {
	const { game } = inputData;
	let newStatistic: ParsedType = {
        home: undefined,
        away: undefined,
        homePlayers: undefined,
        awayPlayers: undefined,
        game: undefined
    };

	if(mode == FilterType.All || mode == FilterType.Team){
        newStatistic.home = parseHomeAwayFromExternal(game.home);
        newStatistic.away = parseHomeAwayFromExternal(game.away);
    }

    if(mode == FilterType.All || mode == FilterType.Player){
        newStatistic.homePlayers = parsePlayerFromExternal(game.home);
        newStatistic.awayPlayers = parsePlayerFromExternal(game.away);
    }

    if(mode == FilterType.All || mode == FilterType.Game){
        newStatistic.game = parseGameFromExternal(game)
    }

	return newStatistic;
}

const compareDiscrepancy = (source: any, external: any , mode = 0)=> {
    let discrepancies: any = {};
	
    // compare game and compare home/away statistic
    let arrToCompare = ['home','away', 'game'];
    for(let key in source){
        discrepancies[key] = {};
        if(arrToCompare.indexOf(key)>=0){
            for(let _subKey in source[key]){
                if(source[key][_subKey] != external[key][_subKey]){
                    discrepancies[key][_subKey] = parseInt(source[key][_subKey]) - parseInt(external[key][_subKey])
                }
            }
            for(let _subKey in external[key]){
                if(source[key][_subKey] != external[key][_subKey] && discrepancies[key][_subKey] == undefined ){
                    discrepancies[key][_subKey] = parseInt(source[key][_subKey]) - parseInt(external[key][_subKey])
                }
            }
        }
    }

	// compare players
    arrToCompare = (mode == FilterType.All || mode == FilterType.Player) ? ['homePlayers', 'awayPlayers'] : [];
    for(let key in source){
        if(arrToCompare.indexOf(key)>=0){
			discrepancies[key] = [];
            let sourceArr = source[key];
            let externalArr = external[key];

            // find player to compare
            for(let i = 0; i<sourceArr.length; i++){
                discrepancies[key].push({id:sourceArr[i].id})
                let length = discrepancies[key].length;
                for(let j = 0; j<externalArr.length; j++){
                    if(sourceArr[i].id === externalArr[j].id){
                        for(let _subKey in sourceArr[i]){
                            if(sourceArr[i][_subKey] != externalArr[j][_subKey]){
								discrepancies[key][length-1][_subKey] = parseInt(sourceArr[i][_subKey]) - parseInt(externalArr[j][_subKey])
                            }
                        }

                        for(let _subKey in externalArr[j]){
                            if(sourceArr[i][_subKey] != externalArr[j][_subKey]&& discrepancies[key][length-1][_subKey]!=undefined ){
								discrepancies[key][length-1][_subKey] = parseInt(sourceArr[i][_subKey]) - parseInt(externalArr[j][_subKey])
                            }
                        }
                    }
                }
            }
        }
    }
    return discrepancies
}

/**
 * Get by mode0
 */
const getDataByField = async(mode = 0)=> {
    const externalData = readJSONSync(__dirname + '/' + 'external.json');
    const sourceData = readJSONSync(__dirname + '/' + 'source.json');
	const newExternalData = await parseExternalInputToCompareFormat(externalData, mode);
    const newSourceData = await parseSourceInputToCompareFormat(sourceData, mode);
    const comparedDiscrepancies = await compareDiscrepancy(newSourceData,newExternalData, mode);
    
    return {
        external:newExternalData,
        source: newSourceData,
        comparedDiscrepancies: comparedDiscrepancies
    };
}

/**
 * Get all.
 */
const getAll = async()=> {
    return getDataByField();
}

const filterByGame = ()=> {
    return getDataByField(FilterType.Game);
}

const filterByPlayer = ()=> {
    return getDataByField(FilterType.Player);
}

const filterByTeam = ()=> {
    return getDataByField(FilterType.Team);
}

// **** Export default **** //

export default {
    getAll,
	filterByGame,
    filterByPlayer,
    filterByTeam
} as const;
