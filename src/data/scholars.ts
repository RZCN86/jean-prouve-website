import { Scholar, ScholarDatabase } from '@/types';

// Sample scholar data for Jean Prouvé research
export const scholars: Scholar[] = [
  {
    id: 'catherine-coley',
    name: 'Catherine Coley',
    institution: 'École Nationale Supérieure d\'Architecture de Nancy',
    country: 'France',
    region: 'europe',
    specialization: ['architecturalHistory', 'prefabricatedConstruction'],
    biography: 'Catherine Coley is a leading expert on Jean Prouvé\'s architectural innovations and prefabricated construction systems. She has spent over two decades researching Prouvé\'s work and its influence on contemporary architecture.',
    contact: {
      email: 'c.coley@nancy.archi.fr',
      website: 'https://www.nancy.archi.fr/coley',
    },
    publications: [
      {
        id: 'pub-1',
        title: 'Jean Prouvé: The Poetics of the Technical Object',
        type: 'book',
        year: 2019,
        publisher: 'Birkhäuser',
        abstract: 'A comprehensive analysis of Prouvé\'s approach to industrial design and architecture, examining how he transformed technical constraints into poetic expressions.',
        keywords: ['industrial design', 'prefabrication', 'technical innovation', 'modernism'],
        url: 'https://www.birkhauser.com/books/9783035617891'
      },
      {
        id: 'pub-2',
        title: 'Prefabrication and Lightness in Prouvé\'s Architecture',
        type: 'article',
        year: 2021,
        publisher: 'Architectural Review',
        abstract: 'An examination of how Prouvé\'s lightweight construction systems influenced modern prefabricated architecture.',
        keywords: ['prefabrication', 'lightweight construction', 'modern architecture'],
      }
    ],
    exhibitions: [
      {
        id: 'exh-1',
        title: 'Jean Prouvé: Architecture for Better Days',
        venue: 'Centre Pompidou-Metz',
        year: 2022,
        description: 'A major retrospective examining Prouvé\'s architectural philosophy and its relevance to contemporary sustainable design.',
        role: 'Co-curator'
      }
    ]
  },
  {
    id: 'hiroshi-watanabe',
    name: 'Hiroshi Watanabe',
    institution: 'Tokyo University of the Arts',
    country: 'Japan',
    region: 'asia',
    specialization: ['industrialDesign', 'materialStudies'],
    biography: 'Professor Watanabe specializes in the intersection of industrial design and architecture, with particular focus on Jean Prouvé\'s material innovations and their application in Japanese contemporary design.',
    contact: {
      email: 'h.watanabe@geidai.ac.jp',
      website: 'https://www.geidai.ac.jp/watanabe',
    },
    publications: [
      {
        id: 'pub-3',
        title: 'Material Consciousness: Prouvé\'s Influence on Japanese Design',
        type: 'book',
        year: 2020,
        publisher: 'A+U Publishing',
        abstract: 'Exploring how Jean Prouvé\'s material philosophy influenced post-war Japanese industrial design and architecture.',
        keywords: ['material studies', 'Japanese design', 'industrial design', 'post-war architecture'],
      },
      {
        id: 'pub-4',
        title: 'Steel and Aluminum in Prouvé\'s Furniture Design',
        type: 'conference',
        year: 2023,
        publisher: 'International Conference on Design History',
        abstract: 'Analysis of Prouvé\'s innovative use of metal in furniture design and its lasting impact on contemporary furniture.',
        keywords: ['furniture design', 'metal work', 'industrial materials'],
      }
    ],
    exhibitions: [
      {
        id: 'exh-2',
        title: 'Metal and Form: Prouvé\'s Legacy in Asia',
        venue: 'Tokyo National Museum of Modern Art',
        year: 2023,
        description: 'Exhibition showcasing the influence of Prouvé\'s metalwork on Asian designers and architects.',
        role: 'Lead curator'
      }
    ]
  },
  {
    id: 'maria-santos',
    name: 'Maria Santos',
    institution: 'MIT School of Architecture',
    country: 'United States',
    region: 'northAmerica',
    specialization: ['modernism', 'prefabricatedConstruction'],
    biography: 'Dr. Santos is a professor of architectural history at MIT, focusing on 20th-century modernism and prefabricated construction systems. Her research on Prouvé examines his influence on American post-war architecture.',
    contact: {
      email: 'm.santos@mit.edu',
      website: 'https://architecture.mit.edu/santos',
    },
    publications: [
      {
        id: 'pub-5',
        title: 'Prouvé in America: Influence on Post-War Prefabrication',
        type: 'article',
        year: 2022,
        publisher: 'Journal of Architectural Education',
        abstract: 'Examining how Jean Prouvé\'s prefabrication techniques influenced American architects in the post-war housing boom.',
        keywords: ['American architecture', 'post-war housing', 'prefabrication', 'modernism'],
      },
      {
        id: 'pub-6',
        title: 'The Maison Tropicale: Colonial Architecture and Modern Innovation',
        type: 'thesis',
        year: 2018,
        abstract: 'A detailed study of Prouvé\'s Maison Tropicale project and its implications for colonial and post-colonial architecture.',
        keywords: ['Maison Tropicale', 'colonial architecture', 'tropical design'],
      }
    ],
    exhibitions: []
  },
  {
    id: 'alessandro-rossi',
    name: 'Alessandro Rossi',
    institution: 'Politecnico di Milano',
    country: 'Italy',
    region: 'europe',
    specialization: ['architecturalHistory', 'materialStudies'],
    biography: 'Professor Rossi is an architectural historian specializing in 20th-century European architecture and material innovation. His work on Prouvé focuses on the relationship between craft and industrial production.',
    contact: {
      email: 'a.rossi@polimi.it',
      website: 'https://www.polimi.it/rossi',
    },
    publications: [
      {
        id: 'pub-7',
        title: 'Craft and Industry: Prouvé\'s Dual Legacy',
        type: 'book',
        year: 2021,
        publisher: 'Electa',
        abstract: 'An exploration of how Prouvé bridged traditional craftsmanship with industrial production methods.',
        keywords: ['craftsmanship', 'industrial production', 'European modernism'],
      }
    ],
    exhibitions: [
      {
        id: 'exh-3',
        title: 'European Modernism: From Craft to Industry',
        venue: 'Triennale Milano',
        year: 2021,
        description: 'Exhibition exploring the transition from craft to industrial production in European modernist design.',
        role: 'Academic advisor'
      }
    ]
  },
  {
    id: 'sarah-mitchell',
    name: 'Sarah Mitchell',
    institution: 'University of Melbourne',
    country: 'Australia',
    region: 'oceania',
    specialization: ['modernism', 'industrialDesign'],
    biography: 'Dr. Mitchell researches the global spread of modernist design principles, with particular interest in how Prouvé\'s work influenced architecture and design in the Asia-Pacific region.',
    contact: {
      email: 's.mitchell@unimelb.edu.au',
      website: 'https://www.unimelb.edu.au/mitchell',
    },
    publications: [
      {
        id: 'pub-8',
        title: 'Modernism in the Pacific: Prouvé\'s Global Influence',
        type: 'article',
        year: 2023,
        publisher: 'Architectural History',
        abstract: 'Tracing the influence of Jean Prouvé\'s design principles on modernist architecture in Australia and New Zealand.',
        keywords: ['Pacific modernism', 'global influence', 'architectural history'],
      }
    ],
    exhibitions: []
  },
  {
    id: 'carlos-mendoza',
    name: 'Carlos Mendoza',
    institution: 'Universidad de Buenos Aires',
    country: 'Argentina',
    region: 'southAmerica',
    specialization: ['prefabricatedConstruction', 'modernism'],
    biography: 'Professor Mendoza studies the adaptation of European modernist principles in Latin American architecture, with focus on Prouvé\'s prefabrication techniques and their application in social housing projects.',
    contact: {
      email: 'c.mendoza@fadu.uba.ar',
    },
    publications: [
      {
        id: 'pub-9',
        title: 'Prefabrication and Social Housing in Latin America',
        type: 'book',
        year: 2020,
        publisher: 'Editorial Nobuko',
        abstract: 'Examining how Prouvé\'s prefabrication concepts influenced social housing developments across Latin America.',
        keywords: ['social housing', 'Latin American architecture', 'prefabrication'],
      }
    ],
    exhibitions: []
  }
];

// Organize scholars by region and specialization
export const scholarDatabase: ScholarDatabase = {
  byRegion: {
    europe: scholars.filter(s => s.region === 'europe'),
    northAmerica: scholars.filter(s => s.region === 'northAmerica'),
    asia: scholars.filter(s => s.region === 'asia'),
    africa: scholars.filter(s => s.region === 'africa'),
    oceania: scholars.filter(s => s.region === 'oceania'),
    southAmerica: scholars.filter(s => s.region === 'southAmerica'),
  },
  bySpecialization: {
    architecturalHistory: scholars.filter(s => s.specialization.includes('architecturalHistory')),
    industrialDesign: scholars.filter(s => s.specialization.includes('industrialDesign')),
    prefabricatedConstruction: scholars.filter(s => s.specialization.includes('prefabricatedConstruction')),
    modernism: scholars.filter(s => s.specialization.includes('modernism')),
    materialStudies: scholars.filter(s => s.specialization.includes('materialStudies')),
  },
};

// Helper functions for scholar data
export const getScholarsByRegion = (region: string): Scholar[] => {
  return scholars.filter(scholar => scholar.region === region);
};

export const getScholarsBySpecialization = (specialization: string): Scholar[] => {
  return scholars.filter(scholar => scholar.specialization.includes(specialization));
};

export const getScholarById = (id: string): Scholar | undefined => {
  return scholars.find(scholar => scholar.id === id);
};

export const getAllRegions = (): string[] => {
  return Array.from(new Set(scholars.map(scholar => scholar.region)));
};

export const getAllSpecializations = (): string[] => {
  const allSpecs = scholars.flatMap(scholar => scholar.specialization);
  return Array.from(new Set(allSpecs));
};

export const getAllScholars = (): Scholar[] => {
  return scholars;
};

export const searchScholars = (query: string): Scholar[] => {
  const lowercaseQuery = query.toLowerCase();
  return scholars.filter(scholar => 
    scholar.name.toLowerCase().includes(lowercaseQuery) ||
    scholar.institution.toLowerCase().includes(lowercaseQuery) ||
    scholar.biography.toLowerCase().includes(lowercaseQuery) ||
    scholar.specialization.some(spec => spec.toLowerCase().includes(lowercaseQuery)) ||
    scholar.publications.some(pub => 
      pub.title.toLowerCase().includes(lowercaseQuery) ||
      pub.abstract.toLowerCase().includes(lowercaseQuery) ||
      pub.keywords.some(keyword => keyword.toLowerCase().includes(lowercaseQuery))
    )
  );
};