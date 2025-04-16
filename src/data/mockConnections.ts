import { Connection, ConnectionStatus, ConnectionType } from '@/types/connection';

export const connections: Connection[] = [
  {
    id: '1',
    address: 'Hoofdstraat 1',
    city: 'Amsterdam',
    postalCode: '1011AA',
    type: 'Elektriciteit',
    status: 'Actief',
    supplier: 'Essent',
    ean: '123456789012345678',
    hasFeedback: true,
    organization: 'Gemeente Amsterdam',
    entity: 'Stadsdeel Centrum',
    project: 'Renovatieproject Centrum',
    object: 'Gebouw A',
    gridOperatorWorkNumber: '12345',
    connectionAddress: 'Hoofdstraat 1A',
    gridOperatorContact: 'Jan de Boer',
    plannedConnectionDate: '2024-03-15',
    meteringType: 'Slimme meter',
    technicalSpecifications: {
      voltage: '230V',
      phases: '1',
      maxCapacity: '40A',
      connectionFee: '€150',
      meteringType: 'Slimme meter'
    },
    contract: {
      endDate: '2024-12-31',
      price: '€0.25/kWh',
      type: 'Variabel',
      startDate: '2023-01-01',
      conditions: 'Standaard voorwaarden'
    },
    history: [
      { date: '2023-01-01', action: 'Aansluiting gecreëerd', user: 'Systeem' },
      { date: '2023-02-15', action: 'Contract afgesloten', user: 'Klant' }
    ]
  },
  {
    id: '2',
    address: 'Kerkstraat 10',
    city: 'Rotterdam',
    postalCode: '3011AB',
    type: 'Gas',
    status: 'Inactief',
    supplier: 'Eneco',
    ean: '987654321098765432',
    hasFeedback: false,
    organization: 'Havenbedrijf Rotterdam',
    entity: 'Divisie Onderhoud',
    project: 'Nieuwbouwproject Haven',
    object: 'Installatie X',
    gridOperatorWorkNumber: '67890',
    connectionAddress: 'Kerkstraat 10B',
    gridOperatorContact: 'Piet Jansen',
    plannedConnectionDate: '2024-04-20',
    meteringType: 'Traditionele meter',
    technicalSpecifications: {
      voltage: null,
      phases: null,
      maxCapacity: 'G6',
      connectionFee: '€100',
      meteringType: 'Traditionele meter'
    },
    contract: {
      endDate: '2024-11-30',
      price: '€0.80/m3',
      type: 'Vast',
      startDate: '2023-01-01',
      conditions: 'Standaard voorwaarden'
    },
    history: [
      { date: '2022-12-01', action: 'Aansluiting gecreëerd', user: 'Systeem' },
      { date: '2023-01-10', action: 'Contract afgesloten', user: 'Klant' },
      { date: '2023-03-20', action: 'Aansluiting beëindigd', user: 'Klant' }
    ]
  },
  {
    id: '3',
    address: 'Marktplein 5',
    city: 'Den Haag',
    postalCode: '2511AA',
    type: 'Elektriciteit',
    status: 'Actief',
    supplier: 'Vattenfall',
    ean: '543216789054321678',
    hasFeedback: true,
    organization: 'Gemeente Den Haag',
    entity: 'Afdeling Economie',
    project: 'Evenementen Marktplein',
    object: 'Kraam 1',
    gridOperatorWorkNumber: '24680',
    connectionAddress: 'Marktplein 5C',
    gridOperatorContact: 'Klaas Smit',
    plannedConnectionDate: '2024-05-01',
    meteringType: 'Slimme meter',
    technicalSpecifications: {
      voltage: '230V',
      phases: '1',
      maxCapacity: '25A',
      connectionFee: '€75',
      meteringType: 'Slimme meter'
    },
    contract: {
      endDate: '2024-10-31',
      price: '€0.28/kWh',
      type: 'Variabel',
      startDate: '2023-01-01',
      conditions: 'Standaard voorwaarden'
    },
    history: [
      { date: '2023-01-01', action: 'Aansluiting gecreëerd', user: 'Systeem' },
      { date: '2023-02-01', action: 'Contract afgesloten', user: 'Klant' }
    ]
  },
  {
    id: '4',
    address: 'Stationsweg 22',
    city: 'Utrecht',
    postalCode: '3511AB',
    type: 'Warmte',
    status: 'Actief',
    supplier: 'Stadsverwarming Utrecht',
    ean: '678905432167890543',
    hasFeedback: false,
    organization: 'NS',
    entity: 'Stationsbeheer',
    project: 'Renovatie Station Utrecht',
    object: 'Wachtruimte A',
    gridOperatorWorkNumber: null,
    connectionAddress: null,
    gridOperatorContact: null,
    plannedConnectionDate: null,
    meteringType: null,
    technicalSpecifications: {
      voltage: null,
      phases: null,
      maxCapacity: null,
      connectionFee: null,
      meteringType: null
    },
    contract: {
      endDate: '2024-09-30',
      price: '€0.70/GJ',
      type: 'Vast',
      startDate: '2023-01-01',
      conditions: 'Standaard voorwaarden'
    },
    history: [
      { date: '2023-01-01', action: 'Aansluiting gecreëerd', user: 'Systeem' },
      { date: '2023-01-15', action: 'Contract afgesloten', user: 'Klant' }
    ]
  },
  {
    id: '5',
    address: 'Dorpsstraat 15',
    city: 'Eindhoven',
    postalCode: '5611AB',
    type: 'Water',
    status: 'Actief',
    supplier: 'Brabant Water',
    ean: '432109876543210987',
    hasFeedback: true,
    organization: 'Gemeente Eindhoven',
    entity: 'Groenvoorziening',
    project: 'Parkonderhoud Centrum',
    object: 'Fontein 1',
    gridOperatorWorkNumber: null,
    connectionAddress: null,
    gridOperatorContact: null,
    plannedConnectionDate: null,
    meteringType: null,
    technicalSpecifications: {
      voltage: null,
      phases: null,
      maxCapacity: null,
      connectionFee: null,
      meteringType: null
    },
    contract: {
      endDate: '2024-08-31',
      price: '€1.20/m3',
      type: 'Vast',
      startDate: '2023-01-01',
      conditions: 'Standaard voorwaarden'
    },
    history: [
      { date: '2023-01-01', action: 'Aansluiting gecreëerd', user: 'Systeem' },
      { date: '2023-01-20', action: 'Contract afgesloten', user: 'Klant' }
    ]
  },
  {
    id: '6',
    address: 'Nieuwstraat 8',
    city: 'Groningen',
    postalCode: '9711AB',
    type: 'Elektriciteit',
    status: 'Inactief',
    supplier: 'ENGIE',
    ean: '789012345678901234',
    hasFeedback: false,
    organization: 'Rijksuniversiteit Groningen',
    entity: 'Faculteit der Letteren',
    project: 'Nieuwbouw Bibliotheek',
    object: 'Leeszaal 1',
    gridOperatorWorkNumber: '13579',
    connectionAddress: 'Nieuwstraat 8A',
    gridOperatorContact: 'Marieke de Vries',
    plannedConnectionDate: '2024-06-10',
    meteringType: 'Slimme meter',
    technicalSpecifications: {
      voltage: '230V',
      phases: '1',
      maxCapacity: '35A',
      connectionFee: '€120',
      meteringType: 'Slimme meter'
    },
    contract: {
      endDate: '2024-07-31',
      price: '€0.27/kWh',
      type: 'Variabel',
      startDate: '2023-01-01',
      conditions: 'Standaard voorwaarden'
    },
    history: [
      { date: '2022-12-15', action: 'Aansluiting gecreëerd', user: 'Systeem' },
      { date: '2023-01-05', action: 'Contract afgesloten', user: 'Klant' },
      { date: '2023-03-10', action: 'Aansluiting beëindigd', user: 'Klant' }
    ]
  },
  {
    id: '7',
    address: 'Havenkade 3',
    city: 'Maastricht',
    postalCode: '6211AB',
    type: 'Gas',
    status: 'Actief',
    supplier: 'Budget Energie',
    ean: '234567890123456789',
    hasFeedback: true,
    organization: 'Gemeente Maastricht',
    entity: 'Toerisme & Recreatie',
    project: 'Evenementen Vrijthof',
    object: 'Terras 1',
    gridOperatorWorkNumber: '86420',
    connectionAddress: 'Havenkade 3B',
    gridOperatorContact: 'Tom Sanders',
    plannedConnectionDate: '2024-07-01',
    meteringType: 'Traditionele meter',
    technicalSpecifications: {
      voltage: null,
      phases: null,
      maxCapacity: 'G4',
      connectionFee: '€90',
      meteringType: 'Traditionele meter'
    },
    contract: {
      endDate: '2024-06-30',
      price: '€0.78/m3',
      type: 'Vast',
      startDate: '2023-01-01',
      conditions: 'Standaard voorwaarden'
    },
    history: [
      { date: '2023-01-01', action: 'Aansluiting gecreëerd', user: 'Systeem' },
      { date: '2023-01-25', action: 'Contract afgesloten', user: 'Klant' }
    ]
  },
  {
    id: '8',
    address: 'Bosweg 12',
    city: 'Arnhem',
    postalCode: '6811AB',
    type: 'Warmte',
    status: 'Actief',
    supplier: 'Nutsbedrijf Arnhem',
    ean: '345678901234567890',
    hasFeedback: false,
    organization: ' Burgers Zoo',
    entity: 'Dierenverblijven',
    project: 'Nieuwbouw Savanne',
    object: 'Olifantenverblijf',
    gridOperatorWorkNumber: null,
    connectionAddress: null,
    gridOperatorContact: null,
    plannedConnectionDate: null,
    meteringType: null,
    technicalSpecifications: {
      voltage: null,
      phases: null,
      maxCapacity: null,
      connectionFee: null,
      meteringType: null
    },
    contract: {
      endDate: '2024-05-31',
      price: '€0.68/GJ',
      type: 'Vast',
      startDate: '2023-01-01',
      conditions: 'Standaard voorwaarden'
    },
    history: [
      { date: '2023-01-01', action: 'Aansluiting gecreëerd', user: 'Systeem' },
      { date: '2023-01-18', action: 'Contract afgesloten', user: 'Klant' }
    ]
  },
  {
    id: '9',
    address: 'Kanaalstraat 7',
    city: 'Tilburg',
    postalCode: '5011AB',
    type: 'Water',
    status: 'Actief',
    supplier: 'Waterleiding Maatschappij',
    ean: '456789012345678901',
    hasFeedback: true,
    organization: 'Gemeente Tilburg',
    entity: 'Sportbedrijf',
    project: 'Zwembad Reeshof',
    object: 'Douches Heren',
    gridOperatorWorkNumber: null,
    connectionAddress: null,
    gridOperatorContact: null,
    plannedConnectionDate: null,
    meteringType: null,
    technicalSpecifications: {
      voltage: null,
      phases: null,
      maxCapacity: null,
      connectionFee: null,
      meteringType: null
    },
    contract: {
      endDate: '2024-04-30',
      price: '€1.18/m3',
      type: 'Vast',
      startDate: '2023-01-01',
      conditions: 'Standaard voorwaarden'
    },
    history: [
      { date: '2023-01-01', action: 'Aansluiting gecreëerd', user: 'Systeem' },
      { date: '2023-01-22', action: 'Contract afgesloten', user: 'Klant' }
    ]
  },
  {
    id: '10',
    address: 'Plein 1945 nr. 14',
    city: 'Haarlem',
    postalCode: '2011AB',
    type: 'Elektriciteit',
    status: 'Actief',
    supplier: 'Greenchoice',
    ean: '567890123456789012',
    hasFeedback: false,
    organization: 'Gemeente Haarlem',
    entity: 'Monumentenzorg',
    project: 'Restauratie Stadhuis',
    object: 'Verlichting Gevel',
    gridOperatorWorkNumber: '97531',
    connectionAddress: 'Plein 1945 nr. 14C',
    gridOperatorContact: 'Linda Bakker',
    plannedConnectionDate: '2024-08-15',
    meteringType: 'Slimme meter',
    technicalSpecifications: {
      voltage: '230V',
      phases: '1',
      maxCapacity: '32A',
      connectionFee: '€110',
      meteringType: 'Slimme meter'
    },
    contract: {
      endDate: '2024-03-31',
      price: '€0.26/kWh',
      type: 'Variabel',
      startDate: '2023-01-01',
      conditions: 'Standaard voorwaarden'
    },
    history: [
      { date: '2023-01-01', action: 'Aansluiting gecreëerd', user: 'Systeem' },
      { date: '2023-01-28', action: 'Contract afgesloten', user: 'Klant' }
    ]
  }
];

// Fix contract missing properties in each mock connection
connections.forEach(connection => {
  if (connection.contract) {
    // Add missing required properties to contract
    connection.contract.startDate = connection.contract.startDate || '2023-01-01';
    connection.contract.conditions = connection.contract.conditions || 'Standaard voorwaarden';
  }
});

export default connections;
