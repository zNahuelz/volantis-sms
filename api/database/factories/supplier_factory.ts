import factory from '@adonisjs/lucid/factories';
import Supplier from '#models/supplier';

export const SupplierFactory = factory
  .define(Supplier, async ({ faker }) => {
    return {
      name: faker.company.name(),
      ruc: `${faker.helpers.arrayElement(['10', '20'])}${faker.string.numeric(9)}`,
      phone: faker.phone.number({ style: 'national' }),
      email: faker.internet.email({ provider: 'supplier.com' }),
      address: `${faker.location.street()} ${faker.location.city()}`,
    };
  })
  .build();
