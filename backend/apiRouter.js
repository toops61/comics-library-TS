// Imports
import {Router} from 'express';
import user from './controllers/user';

// Router
export const router = (() => {
    const apiRouter = Router();

    // User routes
    apiRouter.route('/users/subscribe').post(user.subscribe);
    apiRouter.route('/users/connect').post(user.connect);

    return apiRouter;
})();