import DiscrepancyRepo from '@src/repos/DiscrepancyRepo';

/**
 * Get all discrepancy.
 */
const getAll = ()=> {
    return DiscrepancyRepo.getAll();
}

const filterByGame = ()=> {
  return DiscrepancyRepo.filterByGame();
}

const filterByPlayer = ()=> {
  return DiscrepancyRepo.filterByPlayer();
}

const filterByTeam = ()=> {
  return DiscrepancyRepo.filterByTeam();
}

export default {
  getAll,
  filterByPlayer,
  filterByGame,
  filterByTeam
} as const;
