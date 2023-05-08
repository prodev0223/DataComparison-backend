import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import DiscrepancyService from '@src/services/DiscrepancyService';
import { IReq, IRes } from './types/express/misc';

const getAll = async(_: IReq, res: IRes)=> {
  const data = await DiscrepancyService.getAll();
  return res.status(HttpStatusCodes.OK).json(data);
}

const getByGame = async(_: IReq, res: IRes)=> {
  const data = await DiscrepancyService.filterByGame();
  return res.status(HttpStatusCodes.OK).json(data);
}

const getByPlayer = async(_: IReq, res: IRes)=> {
  const data = await DiscrepancyService.filterByPlayer();
  return res.status(HttpStatusCodes.OK).json(data);
}

const getByTeam = async(_: IReq, res: IRes)=> {
  const data = await DiscrepancyService.filterByTeam();
  return res.status(HttpStatusCodes.OK).json(data);
}

export default {
  getAll,
  getByGame,
  getByPlayer,
  getByTeam,
} as const;
