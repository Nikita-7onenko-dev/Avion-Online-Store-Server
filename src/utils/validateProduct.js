
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1, 'Name is Necessary'),
  productType: z.array( z.enum(["Furniture", "Lighting", "Homeware", "Accessories"]) ).nonempty('Product type is required'),
  category: z.array( z.enum(["Chairs", "Sofas", "Light fittings", "Ceramics", "Plant pots"]) ).nonempty('Category is required'),
  designer: z.string().min(1, 'Invalid designer name'),
  price: z.number().nonnegative(),
  dateAdded: z.string().refine( val => !isNaN(Date.parse(val)), "Invalid ISO date string" ),
  popularityScore: z.number().positive(),
  description: z.string().min(10, 'Description is required'),
  features: z.array(z.string()).optional(),
  height: z.number().positive(),
  width: z.number().positive(),
  depth: z.number().positive(),
  image: z.string().optional(),
  public_id: z.string().optional(),
  aspectRatio: z.enum(['4/5', '8/5'])
})

export default function validateProduct(requestBody) {
    const validData = productSchema.parse(requestBody);
    return validData;
}