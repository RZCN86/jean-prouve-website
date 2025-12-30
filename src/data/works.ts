import { ArchitecturalWork, WorkCategory, FurnitureWork, WorksDatabase, ExpertAnalysis, TechnicalAnalysis, HistoricalContext, ContemporaryInfluence } from '@/types';

// Sample expert analyses
export const expertAnalyses: ExpertAnalysis[] = [
  {
    id: 'mt-analysis-1',
    workId: 'maison-tropicale',
    title: '热带住宅的气候适应性设计分析',
    content: '热带住宅项目展现了普鲁维对气候建筑学的深刻理解。通过采用高架结构、大面积开窗和遮阳系统，建筑有效应对了热带地区的高温高湿环境。轻型钢结构不仅减少了材料运输成本，也便于在偏远地区快速装配。这一设计理念对当代可持续建筑设计具有重要启发意义。',
    author: '玛丽·克劳德·贝塔克',
    authorBio: '法国国家科学研究中心建筑史研究员，专注于20世纪现代建筑与殖民地建筑研究',
    institution: '法国国家科学研究中心',
    type: 'technical',
    date: '2023-03-15',
    tags: ['气候建筑', '预制建筑', '热带设计', '可持续性'],
    references: [
      'Prouvé, J. (1971). Une architecture par l\'industrie. Zurich: Artemis.',
      'Sulzer, P. (2000). Jean Prouvé: Œuvre complète / Complete Works. Basel: Birkhäuser.',
      'Clayssen, D. (1983). Jean Prouvé: L\'idée constructive. Paris: Dunod.'
    ]
  },
  {
    id: 'mt-analysis-2',
    workId: 'maison-tropicale',
    title: '工业化建造的社会意义',
    content: '热带住宅不仅是一个建筑项目，更是普鲁维对战后住房危机的回应。通过工业化生产和标准化设计，这一项目试图为发展中国家提供经济、高效的住房解决方案。虽然由于政治和经济因素未能大规模实施，但其设计理念对后续的人道主义建筑和灾后重建项目产生了深远影响。',
    author: '皮埃尔·里布莱',
    authorBio: '巴黎建筑学院教授，社会住房和人道主义建筑专家',
    institution: '巴黎建筑学院',
    type: 'cultural',
    date: '2023-05-22',
    tags: ['社会住房', '人道主义建筑', '发展中国家', '标准化'],
    references: [
      'Riboulet, P. (1998). Onze leçons sur la composition urbaine. Paris: Presses de l\'ENPC.',
      'Banham, R. (1960). Theory and Design in the First Machine Age. London: Architectural Press.'
    ]
  }
];

// Sample technical analysis
export const technicalAnalyses: TechnicalAnalysis[] = [
  {
    id: 'mt-tech-analysis',
    workId: 'maison-tropicale',
    title: '热带住宅建造技术深度分析',
    constructionMethod: '采用完全预制化的建造方式，所有构件在法国工厂生产完成后运输至非洲现场装配。主体结构采用轻型钢框架，外墙使用铝合金板材，屋顶设计为双层通风结构以适应热带气候。整个建筑可在数周内完成装配。',
    materials: [
      {
        material: '轻型钢结构',
        properties: ['高强度', '轻质化', '耐腐蚀', '可预制'],
        usage: '主承重框架，采用标准化截面和连接方式',
        advantages: ['运输便利', '装配快速', '结构可靠'],
        limitations: ['需要防腐处理', '热胀冷缩考虑']
      },
      {
        material: '铝合金板材',
        properties: ['耐候性强', '重量轻', '易加工', '美观'],
        usage: '外墙围护系统和屋面材料',
        advantages: ['免维护', '反射性好', '现代美感'],
        limitations: ['成本较高', '热传导性强']
      },
      {
        material: '玻璃',
        properties: ['透明', '采光', '密封性', '现代感'],
        usage: '门窗系统，最大化自然采光和通风',
        advantages: ['视觉通透', '自然采光', '空间延伸'],
        limitations: ['隔热性能', '安全考虑']
      }
    ],
    innovations: [
      '完全可拆卸的建筑系统设计',
      '适应热带气候的双层屋顶通风系统',
      '标准化模块的灵活组合方式',
      '工厂预制与现场装配的完美结合'
    ],
    challenges: [
      '长距离运输的包装和保护问题',
      '热带环境下的材料耐久性考验',
      '当地施工技术水平的适应性',
      '标准化与地域特色的平衡'
    ],
    impact: '热带住宅项目开创了现代预制建筑的先河，其完全工业化的建造方式和气候适应性设计为后续的装配式建筑发展奠定了理论和实践基础。该项目的技术创新直接影响了20世纪后半期的建筑工业化进程。',
    author: '让-路易·科恩',
    date: '2023-04-10'
  }
];

// Sample historical context
export const historicalContexts: HistoricalContext[] = [
  {
    id: 'mt-historical',
    workId: 'maison-tropicale',
    period: '1949-1951年，战后重建时期',
    socialContext: '二战结束后，欧洲面临严重的住房短缺问题，同时法属殖民地也需要现代化的基础设施。社会对快速、经济的建造解决方案需求迫切，传统建造方式已无法满足大规模重建的需要。',
    politicalContext: '法国政府推行殖民地现代化政策，试图通过技术输出维持殖民关系。同时，国际上开始关注发展中国家的住房问题，联合国等国际组织开始倡导适宜技术的概念。',
    economicContext: '战后经济重建需要高效的资源配置，工业化生产成为降低成本、提高效率的重要手段。钢铁和铝材工业的发展为新型建筑材料的应用提供了条件。',
    culturalSignificance: '热带住宅体现了现代主义建筑"为大众服务"的理想，同时也反映了当时欧洲对"原始"热带环境的现代主义改造思维。这一项目成为现代建筑适应不同文化和气候环境的重要实验。',
    influences: [
      '包豪斯工业设计理念',
      '勒·柯布西耶的现代建筑五要素',
      '美国工业化住宅实验',
      '热带建筑学理论发展'
    ],
    author: '安妮·拉克鲁瓦',
    date: '2023-06-08'
  }
];

// Sample contemporary influence
export const contemporaryInfluences: ContemporaryInfluence[] = [
  {
    id: 'mt-contemporary',
    workId: 'maison-tropicale',
    title: '热带住宅对当代建筑的持续影响',
    description: '热带住宅项目虽然诞生于20世纪中期，但其设计理念和技术创新对当代建筑实践仍具有重要指导意义。在全球化和可持续发展的背景下，该项目的预制化、标准化和气候适应性设计重新获得关注。',
    influencedWorks: [
      '迪特·里希特的模块化住宅系统',
      '坂茂的纸管建筑应急住宅',
      'IKEA的BoKlok住宅项目',
      '中国的装配式住宅产业化项目'
    ],
    influencedArchitects: [
      '诺曼·福斯特 - 高技派建筑',
      '伦佐·皮亚诺 - 轻型结构专家',
      '坂茂 - 应急建筑设计师',
      '王澍 - 本土材料现代化应用'
    ],
    modernApplications: [
      '灾后应急住房快速部署',
      '偏远地区基础设施建设',
      '可持续建筑的预制化实践',
      '数字化设计与智能制造结合'
    ],
    relevanceToday: '在当今气候变化和城市化加速的背景下，热带住宅的设计理念显得尤为重要。其强调的工业化生产、快速装配、气候适应和资源节约等特点，正是当代绿色建筑和智慧建造所追求的目标。该项目为解决当代住房危机和环境挑战提供了宝贵的历史经验。',
    author: '弗雷德里克·米格约',
    date: '2023-07-20'
  }
];

// Work categories
export const workCategories: WorkCategory[] = [
  {
    id: 'residential',
    name: '住宅建筑',
    description: '普鲁维设计的住宅项目，展现其对居住空间的创新理念'
  },
  {
    id: 'industrial',
    name: '工业建筑',
    description: '工厂、车间等工业建筑，体现功能性与美学的完美结合'
  },
  {
    id: 'educational',
    name: '教育建筑',
    description: '学校、大学等教育设施，注重空间的灵活性和实用性'
  },
  {
    id: 'experimental',
    name: '实验性项目',
    description: '探索新技术和建造方法的前瞻性项目'
  },
  {
    id: 'furniture',
    name: '家具设计',
    description: '工业化生产的家具作品，体现设计与制造的统一'
  }
];

// Sample architectural works
export const architecturalWorks: ArchitecturalWork[] = [
  {
    id: 'maison-tropicale',
    title: '热带住宅 (Maison Tropicale)',
    year: 1949,
    location: '非洲',
    category: workCategories[0], // residential
    description: '为热带气候设计的预制住宅，采用轻型钢结构和可拆卸组件，体现了普鲁维对工业化建造的前瞻性思考。',
    images: [
      {
        id: 'mt-1',
        src: '/images/works/maison-tropicale-1.jpg',
        alt: '热带住宅外观',
        caption: '热带住宅的整体外观，展现轻型结构的优雅',
        width: 800,
        height: 600
      },
      {
        id: 'mt-2',
        src: '/images/works/maison-tropicale-2.jpg',
        alt: '热带住宅内部',
        caption: '开放式内部空间设计',
        width: 800,
        height: 600
      }
    ],
    technicalDrawings: [
      {
        id: 'mt-drawing-1',
        src: '/images/works/maison-tropicale-plan.jpg',
        alt: '热带住宅平面图',
        caption: '建筑平面图和结构细节',
        width: 1200,
        height: 800
      }
    ],
    specifications: [
      { property: '建筑面积', value: '120', unit: 'm²' },
      { property: '结构材料', value: '钢结构' },
      { property: '墙体材料', value: '铝板' },
      { property: '建造周期', value: '3', unit: '个月' }
    ],
    commentary: {
      id: 'mt-commentary',
      title: '技术创新与气候适应',
      content: '热带住宅代表了普鲁维在预制建筑领域的重要突破。通过使用轻型钢结构和标准化组件，这一设计不仅适应了热带气候的特殊需求，也展现了工业化建造的巨大潜力。',
      author: '建筑史学家 Catherine Coley',
      type: 'technical'
    },
    expertAnalyses: expertAnalyses.filter(analysis => analysis.workId === 'maison-tropicale'),
    technicalAnalysis: technicalAnalyses.find(analysis => analysis.workId === 'maison-tropicale'),
    historicalContext: historicalContexts.find(context => context.workId === 'maison-tropicale'),
    contemporaryInfluence: contemporaryInfluences.find(influence => influence.workId === 'maison-tropicale'),
    status: 'reconstructed'
  },
  {
    id: 'cite-universitaire',
    title: '大学城学生宿舍 (Cité Universitaire)',
    year: 1954,
    location: '南锡，法国',
    category: workCategories[2], // educational
    description: '南锡大学城的学生宿舍项目，采用模块化设计和预制构件，为战后重建提供了高效的解决方案。',
    images: [
      {
        id: 'cu-1',
        src: '/images/works/cite-universitaire-1.jpg',
        alt: '大学城宿舍外观',
        caption: '模块化宿舍建筑群',
        width: 800,
        height: 600
      },
      {
        id: 'cu-2',
        src: '/images/works/cite-universitaire-2.jpg',
        alt: '宿舍内部空间',
        caption: '功能性室内设计',
        width: 800,
        height: 600
      }
    ],
    technicalDrawings: [
      {
        id: 'cu-drawing-1',
        src: '/images/works/cite-universitaire-plan.jpg',
        alt: '宿舍平面图',
        caption: '标准化单元平面图',
        width: 1200,
        height: 800
      }
    ],
    specifications: [
      { property: '总建筑面积', value: '2400', unit: 'm²' },
      { property: '宿舍单元数', value: '80', unit: '间' },
      { property: '结构体系', value: '预制混凝土' },
      { property: '完工时间', value: '1954' }
    ],
    commentary: {
      id: 'cu-commentary',
      title: '模块化设计的社会意义',
      content: '大学城项目展现了普鲁维对社会住房问题的关注。通过标准化和工业化生产，他成功地在保证质量的同时降低了建造成本，为战后重建提供了可行的解决方案。',
      author: '社会学家 Pierre Riboulet',
      type: 'cultural'
    },
    status: 'existing'
  },
  {
    id: 'usine-calberson',
    title: '卡尔贝松工厂 (Usine Calberson)',
    year: 1948,
    location: '巴黎，法国',
    category: workCategories[1], // industrial
    description: '运输公司总部和仓库建筑，采用大跨度钢结构和玻璃幕墙，体现了工业建筑的功能美学。',
    images: [
      {
        id: 'uc-1',
        src: '/images/works/usine-calberson-1.jpg',
        alt: '卡尔贝松工厂外观',
        caption: '工厂建筑的现代主义立面',
        width: 800,
        height: 600
      }
    ],
    technicalDrawings: [
      {
        id: 'uc-drawing-1',
        src: '/images/works/usine-calberson-plan.jpg',
        alt: '工厂平面图',
        caption: '工厂布局和结构系统',
        width: 1200,
        height: 800
      }
    ],
    specifications: [
      { property: '建筑长度', value: '150', unit: 'm' },
      { property: '跨度', value: '24', unit: 'm' },
      { property: '结构高度', value: '8', unit: 'm' },
      { property: '主要材料', value: '钢结构+玻璃' }
    ],
    commentary: {
      id: 'uc-commentary',
      title: '工业美学的典范',
      content: '卡尔贝松工厂展现了普鲁维对工业建筑美学的独特理解。通过精确的比例和材料的诚实表达，他将功能性建筑提升为艺术作品。',
      author: '建筑评论家 Reyner Banham',
      type: 'historical'
    },
    status: 'demolished'
  }
];

// Sample furniture works
export const furnitureWorks: FurnitureWork[] = [
  {
    id: 'standard-chair',
    name: '标准椅 (Chaise Standard)',
    year: 1934,
    materials: ['钢管', '木材', '皮革'],
    dimensions: {
      length: 450,
      width: 520,
      height: 800,
      unit: 'mm'
    },
    productionMethod: '工业化批量生产',
    currentLocation: '蓬皮杜中心，巴黎',
    images: [
      {
        id: 'sc-1',
        src: '/images/works/standard-chair-1.jpg',
        alt: '标准椅正面',
        caption: '标准椅的经典设计',
        width: 600,
        height: 800
      }
    ],
    description: '采用弯曲钢管和木材制作的椅子，体现了工业设计与手工艺的完美结合。'
  },
  {
    id: 'antony-chair',
    name: '安东尼椅 (Chaise Antony)',
    year: 1954,
    materials: ['钢板', '木材'],
    dimensions: {
      length: 400,
      width: 480,
      height: 750,
      unit: 'mm'
    },
    productionMethod: '冲压成型',
    currentLocation: '维特拉设计博物馆',
    images: [
      {
        id: 'ac-1',
        src: '/images/works/antony-chair-1.jpg',
        alt: '安东尼椅',
        caption: '冲压钢板制作的椅子',
        width: 600,
        height: 800
      }
    ],
    description: '使用冲压钢板技术制作的椅子，展现了金属加工工艺的精湛技术。'
  }
];

// Complete works database
export const worksDatabase: WorksDatabase = {
  residential: architecturalWorks.filter(work => work.category.id === 'residential'),
  industrial: architecturalWorks.filter(work => work.category.id === 'industrial'),
  educational: architecturalWorks.filter(work => work.category.id === 'educational'),
  experimental: architecturalWorks.filter(work => work.category.id === 'experimental'),
  furniture: furnitureWorks
};

// Helper functions
export function getAllWorks(): ArchitecturalWork[] {
  return architecturalWorks;
}

export function getWorkById(id: string): ArchitecturalWork | undefined {
  return architecturalWorks.find(work => work.id === id);
}

export function getWorksByCategory(categoryId: string): ArchitecturalWork[] {
  return architecturalWorks.filter(work => work.category.id === categoryId);
}

export function getFurnitureById(id: string): FurnitureWork | undefined {
  return furnitureWorks.find(furniture => furniture.id === id);
}

export function searchWorks(query: string): ArchitecturalWork[] {
  const searchTerm = query.toLowerCase();
  return architecturalWorks.filter(work => 
    work.title.toLowerCase().includes(searchTerm) ||
    work.description.toLowerCase().includes(searchTerm) ||
    work.location.toLowerCase().includes(searchTerm)
  );
}