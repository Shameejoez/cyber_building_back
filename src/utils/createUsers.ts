import { fakerRU, faker } from '@faker-js/faker';
import type { User } from '../generated/prisma/index.js';
import bcrypt from 'bcrypt'

const ROLES = ['Кровельщик', "Арматурщик", "Бетонщик", "Монтажник", "Сварщик", "Стропальщик", "Водитель", "Складовщик"]


const getDepartmentIdByRole = (role: string) => {
  switch (role) {
    case "Кровельщик":
      return 3; // Отдел кровельных покрытий
    case "Арматурщик":
    case "Бетонщик":
    case "Сварщик":
    case "Стропальщик":
      return 1; // Отдел монолитного строительства
    case "Монтажник":
      return 5; // Отдел монтажа
    case "Водитель":
      return 6; // Гараж 
    case "Складовщик":
      return 7; // Склад строительных материалов
    default:
      return 4; // Благоустройство (департамент по умолчанию)
  }
};


export function createRandomUser(): Omit<User, "id" | 'createdAt' | 'updatedAt'>{
  const trueRole = ROLES[fakerRU.number.int({min: 0, max: 6})] as string
  return  {
    surename: fakerRU.person.lastName(),
    email: faker.internet.email(),
    password: bcrypt.hashSync("12345", 10),
    role: trueRole,
    name: fakerRU.person.firstName(),
    departamentId: getDepartmentIdByRole(trueRole),
    workPlace: fakerRU.string.nanoid()
  };
}

export const users = faker.helpers.multiple(createRandomUser, {
  count: 5,
});
