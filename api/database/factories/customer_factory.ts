import factory from '@adonisjs/lucid/factories';
import Customer from '../../app/models/customer.js';

export const CustomerFactory = factory
  .define(Customer, async ({ faker }) => {
    return {
      names: faker.person.firstName(),
      surnames: faker.person.lastName(),
      address: `${faker.location.street()} ${faker.location.city()}`,
      phone: `${faker.helpers.arrayElement(['991', '992', '993', '994', '999'])}${faker.string.numeric(6)}`,
      email: faker.internet.email({ provider: 'customer.com' }),
      dni: `${faker.helpers.arrayElement(['05', '06', '07', '08', '09'])}${faker.string.numeric(6)}`,
    };
  })
  .build();
