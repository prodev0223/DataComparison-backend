import { Router } from 'express';
import Paths from './constants/Paths';
import DiscrepancyRoutes from './DiscrepancyRoutes';

const apiRouter = Router(); 
// ** Add Discrepancies Router ** //
const discrepanciesRouter = Router();

// Get all 
discrepanciesRouter.get(
  Paths.Discrepancy.All,
  DiscrepancyRoutes.getAll,
);

discrepanciesRouter.get(
  Paths.Discrepancy.Team,
  DiscrepancyRoutes.getAll,
);

apiRouter.use(Paths.Discrepancy.Base, discrepanciesRouter);

export default apiRouter;
