import {z} from 'zod';

const registerUserSchema = z.looseObject({
  email: z.email("Invalid email format" ),
  password: z.string().min(6, { error: "Password must be at least 6 characters long" }).optional(),
  username: z.string().min(2, {error: 'Name too short, it must be at least 2 characters'})
    .max(33, {error: 'Name too long, it must be at most 33 characters'})
    .regex(/^[A-Za-zА-Яа-яЁё\s-]+$/, {error: "Name can contain only letters, spaces and dashes"}).optional(),

  phone: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
});

export default function validateUserData(requestBody) {
  const validData = registerUserSchema.parse(requestBody);
  return validData;
}