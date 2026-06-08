import { PipelineStage, Types } from 'mongoose';

export function createUserPopulatePipeline(): PipelineStage[] {
  return [
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'userId'
      }
    },
    {
      $unwind: '$userId'
    },
    {
      $addFields: {
        'userId.id': { $toString: '$userId._id' }
      }
    }
  ];
}

export function createFavoritePipeline(userId?: string): PipelineStage[] {
  if (!userId) {
    return [
      {
        $addFields: {
          isFavorite: false
        }
      }
    ];
  }

  return [
    {
      $lookup: {
        from: 'favorites',
        let: {
          offerId: '$_id'
        },
        pipeline: [
          {
            $match: {
              userId: new Types.ObjectId(userId),
              $expr: {
                $eq: ['$offerId', '$$offerId']
              }
            }
          }
        ],
        as: 'favorites'
      }
    },
    {
      $addFields: {
        isFavorite: {
          $gt: [{ $size: '$favorites' }, 0]
        }
      }
    },
    {
      $project: {
        favorites: 0
      }
    }
  ];
}
