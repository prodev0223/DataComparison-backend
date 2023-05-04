import DiscrepancyRepo from '@src/repos/DiscrepancyRepo';

/**
 * Get all discrepancy.
 */
const getAll = ()=> {
    return DiscrepancyRepo.getAll();
}

export default {
  getAll,
} as const;
