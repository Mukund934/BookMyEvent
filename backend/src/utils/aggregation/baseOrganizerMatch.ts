import mongoose from "mongoose";

export const baseOrganizerMatch = (userId: string) => ([
  {
    $lookup: {
      from: "events",
      localField: "event",
      foreignField: "_id",
      as: "event",
    },
  },
  { $unwind: "$event" },
  {
    $match: {
      "event.organizer": new mongoose.Types.ObjectId(userId),
    },
  },
]);