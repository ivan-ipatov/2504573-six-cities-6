export const CreateCommentMessages = {
  text: {
    invalidFormat: 'text is required',
    lengthField: 'min length is 5, max is 2024'
  },
  rating: {
    invalidFormat: 'rating must be a integer',
    min: 'minimum rating value must be 1',
    max: 'maximum rating value must be 5'
  },
} as const;
