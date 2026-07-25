import mongoose from "mongoose";

export interface IUser {
  fullName: string;
  email: string;
  role: "User" | "Worker" | "Admin";
  phone: string;
  profileImage: string;
  bio: string;
  authUserId: string;
  skills: string[];
  experience: number;
  serviceCategory: string[];
  isAvailable: boolean;
  averageRating: number;
  totalReviews: number;
  totalJobsCompleted: number;
  address: string;
  isVerifiedWorker: boolean;
  isBlocked: boolean;
  lastActiveAt: string;
  workerApplicationStatus: "Pending" | "Approved" | "Rejected";
  adhaarCardNumber:string;
  panCardNumber:string
  citizenShip:string
  nativeLanguages:string[],
  profileImagePublicId:string,
  age:number
}

const userSchema = new mongoose.Schema<IUser>(
  {
    authUserId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    profileImage: {
      type: String,
      default: "",
    },
    profileImagePublicId:{
      type:String,
      default:"",
    },

    bio: {
      type: String,
      default: "",
      maxlength: 500,
      trim: true,
    },

    role: {
      type: String,
      enum: ["User", "Worker", "Admin"],
      default: "User",
    },
     age:{
      type:Number
     },

    skills: [String],

    experience: {
      type: Number,
      default: 0,
      min: 0,
    },

    serviceCategory: [String],

    isAvailable: {
      type: Boolean,
      default: false,
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalJobsCompleted: {
      type: Number,
      default: 0,
      min: 0,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    isVerifiedWorker: {
      type: Boolean,
      default: false,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    lastActiveAt: {
      type: String,
    //   default: Date.now,
    default:"",
    },
    workerApplicationStatus:{
      type:String,
      enum:["Pending", "Approved","Rejected"],
      default: "Pending"
    },
    adhaarCardNumber:{
      type:String,
      required: true,
    },
    panCardNumber:{
      type: String,
      required: true,
    },
    citizenShip:{
      type: String,
      required: true,
    },
    nativeLanguages: [String]
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;