import { normalize, schema } from 'normalizr';
import { Tweet } from './types/types';

const user = new schema.Entity('users');

export const tweetSchema = new schema.Entity('tweets', {
  author: user
});