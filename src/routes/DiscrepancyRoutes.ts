import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { IReq, IRes } from './types/express/misc';

const getAll = async(_: IReq, res: IRes)=> {
    const data = {}
    return res.status(HttpStatusCodes.OK).json(data);
}

export default {
  getAll,
} as const;
