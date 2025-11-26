/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router';
import AuthController from '../app/controllers/auth_controller.js';
import { middleware } from './kernel.js';
import RoleController from '../app/controllers/role_controller.js';
import SuppliersController from '../app/controllers/suppliers_controller.js';
import StorageController from '../app/controllers/storage_controller.js';

router
  .group(() => {
    router
      .group(() => {
        router.post('login', [AuthController, 'login']);
        router.post('logout', [AuthController, 'logout']);
        router.post('update-email', [AuthController, 'updateEmail']).use(middleware.auth());
        router.post('update-password', [AuthController, 'updatePassword']).use(middleware.auth());
        router.get('profile', [AuthController, 'profile']).use(middleware.auth());
      })
      .prefix('auth');

    router
      .group(() => {
        router.get('/profile-picture/:file', [StorageController, 'show']);
      })
      .prefix('storage');

    router
      .group(() => {
        router
          .post('/', [SuppliersController, 'store'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'supplier:store'])]);
        router
          .get('/:id', [SuppliersController, 'show'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'supplier:show'])]);
        router
          .get('/', [SuppliersController, 'index'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'supplier:index'])]);
        router
          .put('/:id', [SuppliersController, 'update'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'supplier:update'])]);
        router
          .delete('/:id', [SuppliersController, 'destroy'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'supplier:destroy'])]);
      })
      .prefix('supplier');

    router
      .group(() => {
        router
          .get('/', [RoleController, 'index'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'role:index', 'user:create'])]);
      })
      .prefix('role');
  })
  .prefix('/api/v1');
