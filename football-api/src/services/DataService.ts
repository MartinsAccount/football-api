import { LEAGUES } from '../core/constants/constants';
import ApiURLs from './ApiURLs';
import FetchService from './FetchService';

type ILeagues = keyof typeof LEAGUES;

class DataService {}

export default new DataService();
