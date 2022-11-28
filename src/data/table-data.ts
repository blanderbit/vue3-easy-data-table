import { Header, Item } from '../types/main';

export const tableHeaders: Header[] = [
  { text: 'PLAYER', value: 'player' },
  { text: 'TEAM', value: 'team' },
  { text: 'NUMBER', value: 'number', sortable: true },
  { text: 'POSITION', value: 'position' },
  { text: 'HEIGHT', value: 'indicator.height' },
  { text: 'WEIGHT (lbs)', value: 'indicator.weight', sortable: true },
  { text: 'LAST ATTENDED', value: 'lastAttended', width: 200 },
  { text: 'COUNTRY', value: 'country' },
];

export const tableItems: Item[] = [
  {
    player: 'Stephen Curry',
    team: 'GSW',
    number: 30,
    position: 'G',
    indicator: { height: '6-2', weight: 185 },
    lastAttended: 'Davidson',
    country: 'USA',
  },
  {
    player: 'Kevin Durant',
    team: 'BKN',
    number: 7,
    position: 'F',
    indicator: { height: '6-10', weight: 240 },
    lastAttended: 'Texas-Austin',
    country: 'USA',
  },
  {
    player: 'Lebron James',
    team: 'LAL',
    number: 7,
    position: 'F',
    indicator: { height: '6-9', weight: 185 },
    lastAttended: 'St. Vincent-St. Mary HS (OH)',
    country: 'USA',
  },
  {
    player: 'Giannis Antetokounmpo',
    team: 'MIL',
    number: 34,
    position: 'F',
    indicator: { height: '6-11', weight: 242 },
    lastAttended: 'Filathlitikos',
    country: 'Greece',
  },
  {
    player: 'HC',
    team: 'MIL',
    number: 34,
    position: 'F',
    indicator: { height: '6-11', weight: 243 },
    lastAttended: 'Filathlitikos',
    country: 'Greece',
  },
  {
    player: 'Ochai Agbaji',
    team: 'UTA',
    number: 30,
    position: 'G',
    indicator: { height: '6-5', weight: 215 },
    lastAttended: 'Kansas',
    country: 'USA',
  },
  {
    player: 'Jarrett Allen',
    team: 'CLE',
    number: 31,
    position: 'C',
    indicator: { height: '6-9', weight: 243 },
    lastAttended: 'Texas',
    country: 'USA',
  },
  {
    player: 'Kyle Anderson',
    team: 'MIN',
    number: 5,
    position: 'F-G',
    indicator: { height: '6-9', weight: 230 },
    lastAttended: 'UCLA',
    country: 'USA',
  },
  {
    player: 'Precious Achiuwa',
    team: 'TOR',
    number: 5,
    position: 'F',
    indicator: { height: '6-8', weight: 225 },
    lastAttended: 'Memphis',
    country: 'Nigeria',
  },
  {
    player: 'Amir Coffey',
    team: 'LAC',
    number: 7,
    position: 'G-F',
    indicator: { height: '6-7', weight: 210 },
    lastAttended: 'Minnesota',
    country: 'USA',
  },
  {
    player: 'Jevon Carter',
    team: 'MIL',
    number: 5,
    position: 'G',
    indicator: { height: '6-1', weight: 200 },
    lastAttended: 'West Virginia',
    country: 'USA',
  },
];
