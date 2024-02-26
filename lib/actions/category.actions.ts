"use server"

import { CreateCategoryParams } from "@/types"
import { handleError } from "../utils"
import { connectToDataBase } from "../database"
import Category from "../database/models/category.model"

export const createCategory = async ({categoryName}: CreateCategoryParams) =>{
    try {
        await connectToDataBase();

        const newcategory = await Category.create({name: categoryName})

        return JSON.parse(JSON.stringify(newcategory))
    } catch (error) {
        handleError(error)
    }

}


export const getAllCategories = async () =>{
    try {
        await connectToDataBase();

        const newcategory = await Category.find()

        return JSON.parse(JSON.stringify(newcategory))
    } catch (error) {
        handleError(error)
    }

}