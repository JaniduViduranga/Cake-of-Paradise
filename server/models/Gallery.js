import { Schema, model } from 'mongoose';

const gallerySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Standard',
        'Birthday',
        'Wedding Cake',
        'Cupcake',
        'Custom',
        'Wedding',
        'Cupcakes',
        'Anniversary',
      ],
      default: 'Standard',
    },
    imageUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual alias 'image' -> 'imageUrl' for backward compatibility
gallerySchema.virtual('image').get(function () {
  return this.imageUrl;
});

export default model('Gallery', gallerySchema, 'gallery');
