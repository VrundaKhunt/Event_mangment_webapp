"use server"
import { revalidatePath } from 'next/cache'
import {
    CreateEventParams,
    DeleteEventParams,
    GetAllEventsParams,
    UpdateEventParams,
    GetRelatedEventsByCategoryParams,
    GetEventsByUserParams
} from "@/types"

import { handleError } from "../utils"
import { connectToDataBase } from "../database"
import User from "../database/models/user.model"
import Event from "../database/models/event.model"
import Category from "../database/models/category.model"

/**
 * @param query  Mongoose populate() method to populate certain fields in the query object.
 * @returns 
 */

const populateEvent = async (query: any) => {
    return query
        .populate({ path: 'organizer', model: User, select: '_id firstName lastName' })
        .populate({ path: 'category', model: Category, select: '_id name' })
}

export const createEvent = async ({ event, userId, path }: CreateEventParams) => {
    try {
        await connectToDataBase()

        const organizer = await User.findById(userId);

        if (!organizer) {
            throw new Error("organizer not found");
        }

        // create event db
        const newEvent = await Event.create({
            ...event,
            category: event.categoryId,
            organizer: userId
        })

        return JSON.parse(JSON.stringify(newEvent))
    } catch (error) {
        handleError(error)
    }
}

export const getEventById = async (eventId: string) => {
    try {
        await connectToDataBase();

        const event = await populateEvent(Event.findById(eventId));

        if (!event) {
            throw new Error("Event not found");
        }

        return JSON.parse(JSON.stringify(event));

    } catch (error) {
        handleError(error)
    }
}


// DELETE
export async function deleteEvent({ eventId, path }: DeleteEventParams) {
    try {
        await connectToDataBase()

        const deletedEvent = await Event.findByIdAndDelete(eventId)
        if (deletedEvent) revalidatePath(path)
    } catch (error) {
        handleError(error)
    }
}

export async function getAllEvents({ query, limit = 6, page, category }: GetAllEventsParams) {
    try {
        await connectToDataBase()


        const conditions = {}

        const skipAmount = (Number(page) - 1) * limit
        const eventsQuery = Event.find(conditions)
            .sort({ createdAt: 'desc' })
            .skip(0)
            .limit(limit)

        const events = await populateEvent(eventsQuery)
        const eventsCount = await Event.countDocuments(conditions)

        return {
            data: JSON.parse(JSON.stringify(events)),
            totalPages: Math.ceil(eventsCount / limit),
        }
    } catch (error) {
        handleError(error)
    }
}

// UPDATE
export async function updateEvent({ userId, event, path }: UpdateEventParams) {
    try {
        await connectToDataBase()

        const eventToUpdate = await Event.findById(event._id)
        if (!eventToUpdate || eventToUpdate.organizer.toHexString() !== userId) {
            throw new Error('Unauthorized or event not found')
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            event._id,
            { ...event, category: event.categoryId },
            { new: true }
        )
        revalidatePath(path)

        return JSON.parse(JSON.stringify(updatedEvent))
    } catch (error) {
        handleError(error)
    }
}

// GET RELATED EVENTS: EVENTS WITH SAME CATEGORY
export async function getRelatedEventsByCategory({
    categoryId,
    eventId,
    limit = 3,
    page = 1,
  }: GetRelatedEventsByCategoryParams) {
    try {
      await connectToDataBase()
  
      const skipAmount = (Number(page) - 1) * limit
      const conditions = { $and: [{ category: categoryId }, { _id: { $ne: eventId } }] }
  
      const eventsQuery = Event.find(conditions)
        .sort({ createdAt: 'desc' })
        .skip(skipAmount)
        .limit(limit)
  
      const events = await populateEvent(eventsQuery)
      const eventsCount = await Event.countDocuments(conditions)
  
      return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
    } catch (error) {
      handleError(error)
    }
  }
  

  
// GET EVENTS BY ORGANIZER
export async function getEventsByUser({ userId, limit = 6, page }: GetEventsByUserParams) {
    try {
      await connectToDataBase()
  
      const conditions = { organizer: userId }
      const skipAmount = (page - 1) * limit
  
      const eventsQuery = Event.find(conditions)
        .sort({ createdAt: 'desc' })
        .skip(skipAmount)
        .limit(limit)
  
      const events = await populateEvent(eventsQuery)
      const eventsCount = await Event.countDocuments(conditions)
  
      return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
    } catch (error) {
      handleError(error)
    }
  }