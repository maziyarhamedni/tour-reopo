import express from 'express';
import viewController from '../controller/viewController';
const viewRouter = express.Router();

const viewControl = new viewController;
viewRouter.get('/', viewControl.getHomePage);

viewRouter.get(
  '/overview',viewControl.getOverview
);

viewRouter.get(
  '/tour/:slug',viewControl.getTour
);
viewRouter.get('/login',viewControl.getLoginform)



export default viewRouter;