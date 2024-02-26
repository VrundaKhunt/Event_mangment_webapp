import { z } from "zod"

/*validation*/
export const eventFormSchema = z.object({
    title: z.string().min(1,'Title must be filled'),
    description: z.string().min(3,'Description must be there for better insight').max(400,'Description must be less than 400 characters'),
    location: z.string().min(3,'Location must be at least 2 characters').max(150,'Location must be less than 150 characters'),
    imageUrl: z.string(),
    startDateTime: z.date(),
    endDateTime: z.date(),
    categoryId: z.string(),
    price: z.string(),
    isFree: z.boolean(),
    url: z.string().url(),

  })