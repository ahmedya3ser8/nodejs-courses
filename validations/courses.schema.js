import { z } from "zod";

const addCourseschema = z.object({
  title: z.string('title must be string').min(1, 'title is required'),
  price: z.number('price must be number').min(1, 'price is required')
})

export default addCourseschema;
