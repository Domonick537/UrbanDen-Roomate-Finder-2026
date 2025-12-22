export interface LocationData {
  states: {
    [key: string]: {
      name: string;
      cities: {
        [key: string]: {
          name: string;
          neighborhoods: string[];
        };
      };
    };
  };
}

export const locationData: LocationData = {
  states: {
    CA: {
      name: 'California',
      cities: {
        'los-angeles': {
          name: 'Los Angeles',
          neighborhoods: [
            'Any Neighborhood',
            'Downtown',
            'Hollywood',
            'West Hollywood',
            'Silver Lake',
            'Echo Park',
            'Los Feliz',
            'Santa Monica',
            'Venice',
            'Culver City',
            'Koreatown',
            'Mid-Wilshire',
            'Westwood',
            'Brentwood',
            'Pasadena',
          ],
        },
        'san-francisco': {
          name: 'San Francisco',
          neighborhoods: [
            'Any Neighborhood',
            'Financial District',
            'SoMa',
            'Mission District',
            'Castro',
            'Nob Hill',
            'Russian Hill',
            'Marina District',
            'Pacific Heights',
            'Haight-Ashbury',
            'Richmond District',
            'Sunset District',
            'Potrero Hill',
            'Dogpatch',
          ],
        },
        'san-diego': {
          name: 'San Diego',
          neighborhoods: [
            'Any Neighborhood',
            'Downtown',
            'Gaslamp Quarter',
            'North Park',
            'South Park',
            'Hillcrest',
            'Pacific Beach',
            'La Jolla',
            'Ocean Beach',
            'Mission Beach',
            'Mission Valley',
            'Chula Vista',
          ],
        },
        'oakland': {
          name: 'Oakland',
          neighborhoods: [
            'Any Neighborhood',
            'Downtown',
            'Temescal',
            'Rockridge',
            'Grand Lake',
            'Fruitvale',
            'Jack London Square',
            'West Oakland',
            'Lake Merritt',
          ],
        },
      },
    },
    NY: {
      name: 'New York',
      cities: {
        'new-york-city': {
          name: 'New York City',
          neighborhoods: [
            'Any Neighborhood',
            'Manhattan - Upper West Side',
            'Manhattan - Upper East Side',
            'Manhattan - Midtown',
            'Manhattan - Chelsea',
            'Manhattan - West Village',
            'Manhattan - East Village',
            'Manhattan - Lower East Side',
            'Manhattan - SoHo',
            'Manhattan - Tribeca',
            'Manhattan - Financial District',
            'Brooklyn - Williamsburg',
            'Brooklyn - Greenpoint',
            'Brooklyn - Park Slope',
            'Brooklyn - Prospect Heights',
            'Brooklyn - Brooklyn Heights',
            'Brooklyn - DUMBO',
            'Brooklyn - Bushwick',
            'Queens - Astoria',
            'Queens - Long Island City',
            'Queens - Forest Hills',
          ],
        },
        'buffalo': {
          name: 'Buffalo',
          neighborhoods: [
            'Any Neighborhood',
            'Allentown',
            'Elmwood Village',
            'Downtown',
            'North Buffalo',
            'South Buffalo',
            'West Side',
          ],
        },
      },
    },
    TX: {
      name: 'Texas',
      cities: {
        'austin': {
          name: 'Austin',
          neighborhoods: [
            'Any Neighborhood',
            'Downtown',
            'East Austin',
            'South Congress',
            'West Campus',
            'Hyde Park',
            'North Loop',
            'Mueller',
            'Zilker',
            'Clarksville',
            'Bouldin Creek',
            'Travis Heights',
          ],
        },
        'dallas': {
          name: 'Dallas',
          neighborhoods: [
            'Any Neighborhood',
            'Downtown',
            'Uptown',
            'Deep Ellum',
            'Bishop Arts District',
            'Lakewood',
            'Highland Park',
            'Knox-Henderson',
            'Lower Greenville',
          ],
        },
        'houston': {
          name: 'Houston',
          neighborhoods: [
            'Any Neighborhood',
            'Downtown',
            'Midtown',
            'Montrose',
            'Heights',
            'Rice Village',
            'Museum District',
            'East Downtown',
            'Washington Avenue',
          ],
        },
      },
    },
    FL: {
      name: 'Florida',
      cities: {
        'miami': {
          name: 'Miami',
          neighborhoods: [
            'Any Neighborhood',
            'Brickell',
            'Downtown',
            'Wynwood',
            'Design District',
            'Coconut Grove',
            'Coral Gables',
            'South Beach',
            'Miami Beach',
            'Little Havana',
            'Edgewater',
          ],
        },
        'orlando': {
          name: 'Orlando',
          neighborhoods: [
            'Any Neighborhood',
            'Downtown',
            'Thornton Park',
            'College Park',
            'Winter Park',
            'Mills 50',
            'Lake Nona',
          ],
        },
        'tampa': {
          name: 'Tampa',
          neighborhoods: [
            'Any Neighborhood',
            'Downtown',
            'Ybor City',
            'Hyde Park',
            'Seminole Heights',
            'South Tampa',
            'Westshore',
          ],
        },
      },
    },
    IL: {
      name: 'Illinois',
      cities: {
        'chicago': {
          name: 'Chicago',
          neighborhoods: [
            'Any Neighborhood',
            'Loop',
            'River North',
            'West Loop',
            'Lincoln Park',
            'Lakeview',
            'Wrigleyville',
            'Logan Square',
            'Wicker Park',
            'Bucktown',
            'Ukrainian Village',
            'Pilsen',
            'Hyde Park',
            'Gold Coast',
            'Old Town',
          ],
        },
      },
    },
    WA: {
      name: 'Washington',
      cities: {
        'seattle': {
          name: 'Seattle',
          neighborhoods: [
            'Any Neighborhood',
            'Downtown',
            'Capitol Hill',
            'Queen Anne',
            'Fremont',
            'Ballard',
            'Wallingford',
            'University District',
            'Green Lake',
            'Belltown',
            'Pioneer Square',
            'International District',
          ],
        },
      },
    },
    MA: {
      name: 'Massachusetts',
      cities: {
        'boston': {
          name: 'Boston',
          neighborhoods: [
            'Any Neighborhood',
            'Back Bay',
            'Beacon Hill',
            'North End',
            'South End',
            'Fenway',
            'Allston',
            'Brighton',
            'Jamaica Plain',
            'Brookline',
            'Cambridge',
            'Somerville',
          ],
        },
      },
    },
    CO: {
      name: 'Colorado',
      cities: {
        'denver': {
          name: 'Denver',
          neighborhoods: [
            'Any Neighborhood',
            'LoDo',
            'RiNo',
            'Capitol Hill',
            'Highlands',
            'Cherry Creek',
            'Washington Park',
            'Five Points',
            'Baker',
            'LoHi',
          ],
        },
      },
    },
    GA: {
      name: 'Georgia',
      cities: {
        'atlanta': {
          name: 'Atlanta',
          neighborhoods: [
            'Any Neighborhood',
            'Midtown',
            'Buckhead',
            'Virginia Highland',
            'Inman Park',
            'Old Fourth Ward',
            'Poncey-Highland',
            'East Atlanta',
            'West Midtown',
            'Downtown',
          ],
        },
      },
    },
    OR: {
      name: 'Oregon',
      cities: {
        'portland': {
          name: 'Portland',
          neighborhoods: [
            'Any Neighborhood',
            'Pearl District',
            'Downtown',
            'Alberta Arts District',
            'Hawthorne',
            'Division',
            'Mississippi',
            'Nob Hill',
            'Sellwood',
            'Buckman',
          ],
        },
      },
    },
    AZ: {
      name: 'Arizona',
      cities: {
        'phoenix': {
          name: 'Phoenix',
          neighborhoods: [
            'Any Neighborhood',
            'Downtown',
            'Arcadia',
            'Biltmore',
            'Midtown',
            'Scottsdale',
            'Tempe',
            'Old Town Scottsdale',
          ],
        },
      },
    },
    NC: {
      name: 'North Carolina',
      cities: {
        'charlotte': {
          name: 'Charlotte',
          neighborhoods: [
            'Any Neighborhood',
            'Uptown',
            'South End',
            'NoDa',
            'Plaza Midwood',
            'Dilworth',
            'Myers Park',
            'Ballantyne',
          ],
        },
        'raleigh': {
          name: 'Raleigh',
          neighborhoods: [
            'Any Neighborhood',
            'Downtown',
            'North Hills',
            'Five Points',
            'Glenwood South',
            'Oakwood',
            'Cameron Village',
          ],
        },
      },
    },
    PA: {
      name: 'Pennsylvania',
      cities: {
        'philadelphia': {
          name: 'Philadelphia',
          neighborhoods: [
            'Any Neighborhood',
            'Center City',
            'Rittenhouse Square',
            'Old City',
            'Fishtown',
            'Northern Liberties',
            'University City',
            'South Philly',
            'Fairmount',
          ],
        },
      },
    },
    TN: {
      name: 'Tennessee',
      cities: {
        'nashville': {
          name: 'Nashville',
          neighborhoods: [
            'Any Neighborhood',
            'Downtown',
            'The Gulch',
            'East Nashville',
            'Germantown',
            '12 South',
            'Green Hills',
            'Music Row',
          ],
        },
      },
    },
    ON: {
      name: 'Ontario',
      cities: {
        'toronto': {
          name: 'Toronto',
          neighborhoods: [
            'Any Neighborhood',
            'Downtown',
            'Yorkville',
            'The Annex',
            'Little Italy',
            'Queen West',
            'Leslieville',
            'The Beaches',
            'Liberty Village',
            'King West',
            'Entertainment District',
            'Distillery District',
            'High Park',
            'Junction',
          ],
        },
        'ottawa': {
          name: 'Ottawa',
          neighborhoods: [
            'Any Neighborhood',
            'Downtown',
            'ByWard Market',
            'Centretown',
            'Glebe',
            'Westboro',
            'Hintonburg',
            'Old Ottawa South',
          ],
        },
      },
    },
    BC: {
      name: 'British Columbia',
      cities: {
        'vancouver': {
          name: 'Vancouver',
          neighborhoods: [
            'Any Neighborhood',
            'Downtown',
            'Gastown',
            'Yaletown',
            'West End',
            'Kitsilano',
            'Mount Pleasant',
            'Main Street',
            'Commercial Drive',
            'Fairview',
            'False Creek',
          ],
        },
        'victoria': {
          name: 'Victoria',
          neighborhoods: [
            'Any Neighborhood',
            'Downtown',
            'James Bay',
            'Fairfield',
            'Fernwood',
            'Oak Bay',
            'Rockland',
          ],
        },
      },
    },
    QC: {
      name: 'Quebec',
      cities: {
        'montreal': {
          name: 'Montreal',
          neighborhoods: [
            'Any Neighborhood',
            'Downtown',
            'Old Montreal',
            'Plateau Mont-Royal',
            'Mile End',
            'Griffintown',
            'Little Italy',
            'Verdun',
            'Rosemont',
            'Hochelaga',
            'NDG',
          ],
        },
        'quebec-city': {
          name: 'Quebec City',
          neighborhoods: [
            'Any Neighborhood',
            'Old Quebec',
            'Saint-Roch',
            'Limoilou',
            'Montcalm',
            'Sainte-Foy',
          ],
        },
      },
    },
    AB: {
      name: 'Alberta',
      cities: {
        'calgary': {
          name: 'Calgary',
          neighborhoods: [
            'Any Neighborhood',
            'Downtown',
            'Beltline',
            'Kensington',
            'Inglewood',
            'Mission',
            'Bridgeland',
            'Marda Loop',
          ],
        },
        'edmonton': {
          name: 'Edmonton',
          neighborhoods: [
            'Any Neighborhood',
            'Downtown',
            'Oliver',
            'Whyte Avenue',
            'Garneau',
            'Westmount',
            'Old Strathcona',
          ],
        },
      },
    },
    OTHER: {
      name: 'Other',
      cities: {
        'other': {
          name: 'Other',
          neighborhoods: ['Any Neighborhood'],
        },
      },
    },
  },
};

export const getCountries = (): Array<{ code: string; name: string }> => {
  return [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'OTHER', name: 'Other' },
  ];
};

const usStates = ['CA', 'NY', 'TX', 'FL', 'IL', 'WA', 'MA', 'CO', 'GA', 'OR', 'AZ', 'NC', 'PA', 'TN'];
const canadianProvinces = ['ON', 'BC', 'QC', 'AB'];

export const getStates = (): Array<{ code: string; name: string }> => {
  return Object.entries(locationData.states).map(([code, data]) => ({
    code,
    name: data.name,
  }));
};

export const getStatesForCountry = (countryCode: string): Array<{ code: string; name: string }> => {
  if (countryCode === 'US') {
    return Object.entries(locationData.states)
      .filter(([code]) => usStates.includes(code))
      .map(([code, data]) => ({
        code,
        name: data.name,
      }));
  } else if (countryCode === 'CA') {
    return Object.entries(locationData.states)
      .filter(([code]) => canadianProvinces.includes(code))
      .map(([code, data]) => ({
        code,
        name: data.name,
      }));
  } else if (countryCode === 'OTHER') {
    return Object.entries(locationData.states)
      .filter(([code]) => code === 'OTHER')
      .map(([code, data]) => ({
        code,
        name: data.name,
      }));
  }
  return [];
};

export const getCitiesForState = (
  stateCode: string
): Array<{ id: string; name: string }> => {
  const state = locationData.states[stateCode];
  if (!state) return [];

  return Object.entries(state.cities).map(([id, data]) => ({
    id,
    name: data.name,
  }));
};

export const getNeighborhoodsForCity = (
  stateCode: string,
  cityId: string
): string[] => {
  const state = locationData.states[stateCode];
  if (!state) return [];

  const city = state.cities[cityId];
  if (!city) return [];

  return city.neighborhoods;
};
