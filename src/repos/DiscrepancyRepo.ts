// **** Functions **** //
import { readJSONSync } from "fs-extra";

/* #region Parse data for source.json */
const parseHomeAwayFromSource = (data: any)=> {
    return {
        rushAttempts: 0,
        rushTds: 0,
        rushYdsGained: 0,
        rec: 0,
        receivingYards: 0,
    }
}

const parsePlayerFromSource = (data: any)=> {

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
        rushAttempts: 0,
        rushTds: 0,
        rushYdsGained: 0,
        rec: 0,
        receivingYards: 0,
    }
}

const parsePlayerFromExternal = (data: any)=> {

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
        players: parsePlayerFromSource(statistics),
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
    return inputData;
}

/**
 * Get by mode0
 */
const getDataByField = async(mode = 0)=> {
    const externalData = readJSONSync(__dirname + '/' + 'external.json');
    const sourceData = readJSONSync(__dirname + '/' + 'source.json');
    const newExternalData = parseSourceInputToCompareFormat(externalData , mode);
    const newSourceData = parseExternalInputToCompareFormat(sourceData , mode);

    return newSourceData;
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
