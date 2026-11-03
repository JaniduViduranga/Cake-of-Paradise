import { Schema, model } from 'mongoose';

const gallerySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Standard', 'Standard Cakes', 'Birthday Cakes', 'Wedding Cakes', 'Cupcakes', 'Cup Cakes', 'Other'],
      default: 'Standard Cakes',
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
  }
);

export default model('Gallery', gallerySchema, 'gallery');

