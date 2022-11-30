export const playerHeadersFixture = [
  { text: 'PLAYER', value: 'player' },
  { text: 'TEAM', value: 'team' },
  { text: 'NUMBER', value: 'number', sortable: true },
  { text: 'POSITION', value: 'position' },
  { text: 'HEIGHT', value: 'indicator.height' },
  { text: 'WEIGHT (lbs)', value: 'indicator.weight', sortable: true },
  { text: 'LAST ATTENDED', value: 'lastAttended', width: 200 },
  { text: 'COUNTRY', value: 'country' },
];

export const playerItemsFixture = [{
  player: 'Giannis Antetokounmpo',
  team: 'MIL',
  number: 34,
  position: 'F',
  indicator: { height: '6-11', weight: 242 },
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
}, {
  player: 'HC',
  team: 'MIL',
  number: 34,
  position: 'F',
  indicator: { height: '6-11', weight: 243 },
  lastAttended: 'Filathlitikos',
  country: 'Greece',
}, {
  player: 'Lebron James',
  team: 'LAL',
  number: 7,
  position: 'F',
  indicator: { height: '6-9', weight: 185 },
  lastAttended: 'St. Vincent-St. Mary HS (OH)',
  country: 'USA',
}];

export const playerItemsWithDuplicationFixture = [
  ...playerItemsFixture,
  {
    player: 'HC',
    team: 'MIL',
    number: 34,
    position: 'F',
    indicator: { height: '6-11', weight: 243 },
    lastAttended: 'Filathlitikos',
    country: 'Greece',
  },
];

export const playerItemsWithSimilarNameFixture = [
  {
    player: 'HC 1',
    team: 'MIL',
    number: 34,
    position: 'F',
    indicator: { height: '6-11', weight: 243 },
    lastAttended: 'Filathlitikos',
    country: 'Greece',
  },
  ...playerItemsFixture,
];
