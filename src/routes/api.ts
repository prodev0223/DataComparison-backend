import { Router } from 'express';
import Paths from './constants/Paths';

const apiRouter = Router();
  
// ** Add Discrepancies Router ** //
const discrepanciesRouter = Router();

// Add Discrepancy Router
apiRouter.use(Paths.Discrepancy.Base, discrepanciesRouter);

export default apiRouter;
