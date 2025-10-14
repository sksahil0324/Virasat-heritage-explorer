/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as addMorePhotos from "../addMorePhotos.js";
import type * as addSampleImages from "../addSampleImages.js";
import type * as audio from "../audio.js";
import type * as auth_emailOtp from "../auth/emailOtp.js";
import type * as auth from "../auth.js";
import type * as cleanupUnsplashImages from "../cleanupUnsplashImages.js";
import type * as crons from "../crons.js";
import type * as favorites from "../favorites.js";
import type * as heritageSites from "../heritageSites.js";
import type * as http from "../http.js";
import type * as makeAdmin from "../makeAdmin.js";
import type * as media from "../media.js";
import type * as seedData from "../seedData.js";
import type * as updateKonarkModel from "../updateKonarkModel.js";
import type * as updateRemainingUrls from "../updateRemainingUrls.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  addMorePhotos: typeof addMorePhotos;
  addSampleImages: typeof addSampleImages;
  audio: typeof audio;
  "auth/emailOtp": typeof auth_emailOtp;
  auth: typeof auth;
  cleanupUnsplashImages: typeof cleanupUnsplashImages;
  crons: typeof crons;
  favorites: typeof favorites;
  heritageSites: typeof heritageSites;
  http: typeof http;
  makeAdmin: typeof makeAdmin;
  media: typeof media;
  seedData: typeof seedData;
  updateKonarkModel: typeof updateKonarkModel;
  updateRemainingUrls: typeof updateRemainingUrls;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
