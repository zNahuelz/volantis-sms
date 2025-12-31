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
import StorageController from '../app/controllers/storage_controller.js';
import SupplierController from '../app/controllers/supplier_controller.js';
import UserController from '../app/controllers/user_controller.js';
import CustomerController from '../app/controllers/customer_controller.js';
import PresentationController from '../app/controllers/presentation_controller.js';
import StoreController from '../app/controllers/store_controller.js';
import SettingController from '../app/controllers/setting_controller.js';
import AbilityController from '../app/controllers/ability_controller.js';
import ProductController from '../app/controllers/product_controller.js';
import BuyOrderController from '../app/controllers/buy_order_controller.js';

router
  .group(() => {
    router
      .group(() => {
        router
          .post('/', [AbilityController, 'store'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'ability:store'])]);
        router
          .get('/:id', [AbilityController, 'show'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'ability:show'])]);
        router
          .get('/', [AbilityController, 'index'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'ability:index'])]);
        router
          .get('/index/all', [AbilityController, 'list'])
          .use([
            middleware.auth(),
            middleware.ability(['sys:admin', 'ability:list', 'role:store']),
          ]);
        router
          .put('/:id', [AbilityController, 'update'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'ability:update'])]);
      })
      .prefix('ability');
    router
      .group(() => {
        router.post('login', [AuthController, 'login']);
        router.post('logout', [AuthController, 'logout']);
        router.post('update-email', [AuthController, 'updateEmail']).use(middleware.auth());
        router.post('update-password', [AuthController, 'updatePassword']).use(middleware.auth());
        router
          .post('reset-password-r/:id', [AuthController, 'resetPassword'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'auth:remotePasswordReset'])]);
        router.get('profile', [AuthController, 'profile']).use(middleware.auth());
      })
      .prefix('auth');
    router
      .group(() => {
        router
          .post('/', [BuyOrderController, 'store'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'buyOrder:store'])]);
        router
          .get('/:id', [BuyOrderController, 'show'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'buyOrder:show'])]);
        router
          .get('/', [BuyOrderController, 'index'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'buyOrder:index'])]);
        router
          .put('/:id', [BuyOrderController, 'update'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'buyOrder:update'])]);
        router
          .delete('/:id', [BuyOrderController, 'destroy'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'buyOrder:destroy'])]);
      })
      .prefix('buy-order');
    router
      .group(() => {
        router
          .post('/', [CustomerController, 'store'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'customer:store'])]);
        router
          .get('/', [CustomerController, 'index'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'customer:index'])]);
        router
          .put('/:id', [CustomerController, 'update'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'customer:update'])]);
        router
          .get('/:id', [CustomerController, 'show'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'customer:show'])]);
        router
          .delete('/:id', [CustomerController, 'destroy'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'customer:destroy'])]);
      })
      .prefix('customer');

    router
      .group(() => {
        router
          .post('/', [PresentationController, 'store'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'presentation:store'])]);
        router
          .get('/', [PresentationController, 'index'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'presentation:index'])]);
        router
          .get('/index/all', [PresentationController, 'list'])
          .use([
            middleware.auth(),
            middleware.ability(['sys:admin', 'presentation:list', 'product:store']),
          ]);
        router
          .put('/:id', [PresentationController, 'update'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'presentation:update'])]);
        router
          .get('/:id', [PresentationController, 'show'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'presentation:show'])]);
        router
          .delete('/:id', [PresentationController, 'destroy'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'presentation:destroy'])]);
      })
      .prefix('presentation');

    router
      .group(() => {
        router
          .post('/', [ProductController, 'store'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'product:store'])]);
        router
          .get('/random-barcode', [ProductController, 'generateRandomBarcode'])
          .use([
            middleware.auth(),
            middleware.ability(['sys:admin', 'product:store', 'utils:generateRandomBarcode']),
          ]);
        router
          .get('/', [ProductController, 'index'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'product:index'])]);
        router
          .put('/:id', [ProductController, 'update'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'product:update'])]);
        router
          .get('/:id', [ProductController, 'show'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'product:show'])]);
        router
          .get('/show/:barcode', [ProductController, 'showByBarcode'])
          .use([
            middleware.auth(),
            middleware.ability(['sys:admin', 'product:showByBarcode', 'product:store']),
          ]);
        router
          .delete('/:id', [ProductController, 'destroy'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'product:destroy'])]);
      })
      .prefix('product');

    router
      .group(() => {
        router
          .post('/', [SettingController, 'store'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'setting:store'])]);
        router
          .get('/:id', [SettingController, 'show'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'setting:show'])]);
        router
          .get('/key/:key', [SettingController, 'showByKey'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'setting:showByKey'])]);
        router
          .get('/', [SettingController, 'index'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'setting:index'])]);
        router
          .put('/:id', [SettingController, 'update'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'setting:update'])]);
        router
          .delete('/:id', [SettingController, 'destroy'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'setting:destroy'])]);
      })
      .prefix('setting');

    router
      .group(() => {
        router
          .post('/', [SupplierController, 'store'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'supplier:store'])]);
        router
          .get('/:id', [SupplierController, 'show'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'supplier:show'])]);
        router
          .get('/', [SupplierController, 'index'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'supplier:index'])]);
        router
          .get('/index/all', [SupplierController, 'list'])
          .use([
            middleware.auth(),
            middleware.ability(['sys:admin', 'supplier:list', 'buyOrder:store']),
          ]);
        router
          .put('/:id', [SupplierController, 'update'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'supplier:update'])]);
        router
          .delete('/:id', [SupplierController, 'destroy'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'supplier:destroy'])]);
      })
      .prefix('supplier');

    router
      .group(() => {
        router.get('/profile-picture/:file', [StorageController, 'showProfilePicture']);
        router
          .post('/profile-picture', [StorageController, 'updateProfilePicture'])
          .use(middleware.auth());
        router
          .delete('/profile-picture/:id', [StorageController, 'removeProfilePicture'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'user:removeProfilePicture'])]);
      })
      .prefix('storage');

    router
      .group(() => {
        router
          .post('/', [StoreController, 'store'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'store:store'])]);
        router
          .get('/:id', [StoreController, 'show'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'store:show'])]);
        router
          .get('/', [StoreController, 'index'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'store:index'])]);
        router
          .get('/index/all', [StoreController, 'list'])
          .use([
            middleware.auth(),
            middleware.ability(['sys:admin', 'store:list', 'user:store', 'buyOrder:store']),
          ]);
        router
          .put('/:id', [StoreController, 'update'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'store:update'])]);
        router
          .delete('/:id', [StoreController, 'destroy'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'store:destroy'])]);
      })
      .prefix('store');

    router
      .group(() => {
        router
          .post('/', [UserController, 'store'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'user:store'])]);
        router
          .get('/', [UserController, 'index'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'user:index'])]);
        router
          .put('/:id', [UserController, 'update'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'user:update'])]);
        router
          .get('/:id', [UserController, 'show'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'user:show'])]);
        router
          .delete('/:id', [UserController, 'destroy'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'user:destroy'])]);
      })
      .prefix('user');

    router
      .group(() => {
        router
          .post('/', [RoleController, 'store'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'role:store'])]);
        router
          .get('/:id', [RoleController, 'show'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'role:show'])]);
        router
          .get('/', [RoleController, 'index'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'role:index'])]);
        router
          .get('/index/all', [RoleController, 'list'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'role:list', 'user:store'])]);
        router
          .put('/:id', [RoleController, 'update'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'role:update'])]);
        router
          .delete('/:id', [RoleController, 'destroy'])
          .use([middleware.auth(), middleware.ability(['sys:admin', 'role:destroy'])]);
      })
      .prefix('role');
  })
  .prefix('/api/v1');
