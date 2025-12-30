import { BiographyContent, TimelineEvent, ImageData } from '@/types';

// Biography content data
export const biographyContent: BiographyContent = {
  personalInfo: {
    fullName: "让·普鲁维 (Jean Prouvé)",
    birthDate: "1901年4月8日",
    deathDate: "1984年3月23日",
    birthPlace: "法国巴黎",
    nationality: "法国",
    family: [
      {
        name: "维克多·普鲁维 (Victor Prouvé)",
        relationship: "父亲",
        description: "艺术家、南锡学派创始人之一"
      },
      {
        name: "玛德琳·普鲁维 (Madeleine Prouvé)",
        relationship: "妻子"
      },
      {
        name: "克洛德·普鲁维 (Claude Prouvé)",
        relationship: "儿子",
        description: "建筑师，继承父业"
      },
      {
        name: "卡特琳·普鲁维 (Catherine Prouvé)",
        relationship: "女儿"
      }
    ]
  },
  education: [
    {
      institution: "南锡工艺美术学校 (École des Beaux-Arts de Nancy)",
      degree: "金属工艺专业",
      period: "1916-1919",
      location: "法国南锡",
      description: "在父亲维克多·普鲁维的影响下，学习传统金属工艺和现代设计理念。师从埃米尔·加莱的传统，同时接受现代工业设计思想。"
    },
    {
      institution: "巴黎装饰艺术学院",
      degree: "短期进修",
      period: "1920",
      location: "法国巴黎",
      description: "进修现代设计理论和工业生产技术，为后来的工业化建筑实践奠定理论基础。"
    }
  ],
  career: [
    {
      position: "金属工艺师学徒",
      organization: "埃米尔·罗伯特工作室",
      period: "1914-1916",
      location: "法国南锡",
      achievements: [
        "学习传统锻造技术",
        "掌握金属装饰工艺",
        "接触新艺术运动设计理念"
      ]
    },
    {
      position: "独立金属工艺师",
      organization: "自营工作室",
      period: "1919-1930",
      location: "法国南锡",
      achievements: [
        "建立个人金属工艺工作室",
        "开发创新的金属加工技术",
        "与当地建筑师合作设计金属构件",
        "设计教堂和公共建筑的金属装饰"
      ]
    },
    {
      position: "建筑师与工业设计师",
      organization: "普鲁维工厂 (Ateliers Jean Prouvé)",
      period: "1930-1954",
      location: "法国南锡",
      achievements: [
        "创立预制建筑构件工厂",
        "开发轻型建筑系统",
        "设计标准化建筑组件",
        "与勒·柯布西耶等现代主义建筑师合作",
        "为法国政府设计紧急住房",
        "开发移动建筑和临时结构"
      ]
    },
    {
      position: "建筑顾问与教育家",
      organization: "巴黎国立工艺学院",
      period: "1954-1971",
      location: "法国巴黎",
      achievements: [
        "担任建筑系教授",
        "指导新一代建筑师",
        "继续进行建筑实验",
        "推广工业化建筑理念"
      ]
    }
  ],
  philosophy: [
    {
      theme: "工业化与人性化的结合",
      content: "建筑应该像机器一样精确，但必须为人类服务。工业化生产不应该牺牲人性化的设计。我们的目标是创造既高效又美观的建筑。",
      source: "《建筑与工业》",
      year: 1946
    },
    {
      theme: "材料的诚实表达",
      content: "每种材料都有其固有的特性和美感，设计师的职责是发现并表达这些特性，而不是掩盖它们。金属应该看起来像金属，木材应该展现其纹理。",
      source: "设计理念笔记",
      year: 1950
    },
    {
      theme: "功能决定形式",
      content: "形式必须服务于功能，但这并不意味着牺牲美感。真正的美来自于功能的完美实现和材料的恰当使用。",
      source: "南锡工艺学院讲座",
      year: 1955
    },
    {
      theme: "标准化与个性化",
      content: "标准化的组件可以创造出无限的可能性。就像音乐中的音符，有限的元素可以组合成无穷的旋律。",
      source: "《预制建筑的未来》",
      year: 1960
    }
  ],
  collaborations: [
    {
      collaborator: "勒·柯布西耶 (Le Corbusier)",
      project: "马赛公寓单元 (Unité d'Habitation)",
      period: "1945-1952",
      description: "为马赛公寓设计预制混凝土构件和金属细部，包括阳台栏杆、窗框和内部家具。",
      outcome: "成功实现大规模住宅的工业化建造，影响了后续的社会住房设计"
    },
    {
      collaborator: "夏洛特·佩里安 (Charlotte Perriand)",
      project: "现代家具设计系列",
      period: "1940-1960",
      description: "共同开发轻量化、功能性的现代家具系列，包括椅子、桌子和储物系统。",
      outcome: "创造了多个经典家具设计，至今仍在生产"
    },
    {
      collaborator: "皮埃尔·让纳雷 (Pierre Jeanneret)",
      project: "昌迪加尔城市规划",
      period: "1950-1956",
      description: "为印度昌迪加尔新城设计预制建筑构件和城市家具。",
      outcome: "将欧洲现代主义建筑理念成功适应热带气候"
    },
    {
      collaborator: "让·努维尔 (Jean Nouvel)",
      project: "阿拉伯世界研究院",
      period: "1980-1987",
      description: "作为顾问参与建筑立面的金属构件设计。",
      outcome: "将传统工艺与现代技术完美结合"
    }
  ],
  legacy: [
    {
      category: "influence",
      title: "现代预制建筑",
      description: "影响了全球预制建筑技术的发展，成为现代工业化建筑的先驱",
      year: 1960
    },
    {
      category: "influence",
      title: "可持续建筑理念",
      description: "提倡资源节约和环境友好的建筑方式，预见了可持续建筑的发展",
      year: 1970
    },
    {
      category: "innovation",
      title: "轻型建筑系统",
      description: "开创性的轻型建筑构造方法，革命性地改变了建筑施工方式",
      year: 1950
    },
    {
      category: "innovation",
      title: "标准化组件系统",
      description: "发明了模块化建筑组件系统，实现了大规模定制化生产",
      year: 1955
    },
    {
      category: "recognition",
      title: "法国建筑大奖",
      description: "获得法国建筑界最高荣誉，表彰其对现代建筑的贡献",
      year: 1971
    },
    {
      category: "recognition",
      title: "国际现代建筑协会荣誉会员",
      description: "被授予CIAM荣誉会员称号，国际认可其建筑成就",
      year: 1975
    },
    {
      category: "preservation",
      title: "南锡工厂保护",
      description: "原普鲁维工厂被列为历史建筑保护，现为设计博物馆",
      year: 1980
    },
    {
      category: "preservation",
      title: "作品收藏计划",
      description: "多个重要作品被世界各大博物馆收藏，确保设计遗产传承",
      year: 1985
    }
  ]
};

// Timeline events data
export const timelineEvents: TimelineEvent[] = [
  {
    year: 1901,
    title: "出生于巴黎",
    description: "让·普鲁维出生在一个艺术世家，父亲维克多·普鲁维是著名的艺术家和南锡学派的创始人之一。从小接受艺术和工艺的熏陶。",
    category: "education"
  },
  {
    year: 1914,
    title: "开始学徒生涯",
    description: "13岁时进入埃米尔·罗伯特的金属工艺工作室当学徒，开始学习传统锻造技术和金属装饰工艺。",
    category: "education"
  },
  {
    year: 1916,
    title: "进入南锡工艺美术学校",
    description: "开始正式学习金属工艺专业，这为他后来的建筑生涯奠定了重要的技术基础。",
    category: "education"
  },
  {
    year: 1919,
    title: "建立个人工作室",
    description: "在南锡建立了自己的金属工艺工作室，开始独立的设计和制作生涯，主要从事建筑金属构件的设计。",
    category: "career"
  },
  {
    year: 1924,
    title: "首次建筑项目",
    description: "完成了第一个重要的建筑项目——南锡的圣心教堂金属装饰，展现了现代工艺与传统建筑的结合。",
    category: "achievement"
  },
  {
    year: 1930,
    title: "创立普鲁维工厂",
    description: "建立了专门生产预制建筑构件的工厂，标志着从手工艺向工业化生产的重要转变。",
    category: "career"
  },
  {
    year: 1936,
    title: "设计人民阵线展馆",
    description: "为巴黎人民阵线展览设计了创新的预制展馆，展示了快速装配建筑的可能性。",
    category: "achievement"
  },
  {
    year: 1940,
    title: "战时紧急住房",
    description: "二战期间为法国政府设计紧急住房和临时建筑，解决了大量难民的住房问题。",
    category: "achievement"
  },
  {
    year: 1945,
    title: "与勒·柯布西耶合作",
    description: "开始与著名建筑师勒·柯布西耶合作，参与马赛公寓等重要项目的设计，将工业化理念引入现代建筑。",
    category: "collaboration"
  },
  {
    year: 1950,
    title: "发展轻型建筑系统",
    description: "完善了轻型建筑构造系统，包括金属框架、预制面板和标准化连接件，革命性地改变了建筑施工方式。",
    category: "achievement"
  },
  {
    year: 1954,
    title: "转向教育事业",
    description: "关闭工厂，转向教育事业，在巴黎国立工艺学院担任教授，培养新一代建筑师和设计师。",
    category: "career"
  },
  {
    year: 1971,
    title: "获得法国建筑大奖",
    description: "因其在建筑和工业设计领域的杰出贡献，获得法国建筑界的最高荣誉。",
    category: "achievement"
  },
  {
    year: 1980,
    title: "设计遗产保护",
    description: "开始系统整理和保护自己的设计作品，确保设计理念和技术能够传承给后代。",
    category: "achievement"
  },
  {
    year: 1984,
    title: "逝世于南锡",
    description: "让·普鲁维在南锡逝世，享年82岁，留下了丰富的建筑和设计遗产，影响了整个现代建筑界。",
    category: "career"
  }
];

// Biography images data
export const biographyImages: ImageData[] = [
  {
    id: "portrait-main",
    src: "/images/biography/jean-prouve-portrait.jpg",
    alt: "让·普鲁维肖像照",
    caption: "让·普鲁维在其南锡工作室中 (约1950年)",
    width: 400,
    height: 500
  },
  {
    id: "workshop-1930",
    src: "/images/biography/workshop-1930.jpg",
    alt: "1930年代的普鲁维工作室",
    caption: "南锡的普鲁维金属工艺工作室 (1930年代)",
    width: 600,
    height: 400
  },
  {
    id: "with-corbusier",
    src: "/images/biography/prouve-corbusier.jpg",
    alt: "普鲁维与勒·柯布西耶",
    caption: "让·普鲁维与勒·柯布西耶在马赛公寓工地 (1947年)",
    width: 500,
    height: 350
  },
  {
    id: "factory-1950",
    src: "/images/biography/factory-1950.jpg",
    alt: "普鲁维工厂生产线",
    caption: "南锡普鲁维工厂的预制构件生产线 (1950年)",
    width: 700,
    height: 450
  },
  {
    id: "teaching-1960",
    src: "/images/biography/teaching-1960.jpg",
    alt: "普鲁维在教学中",
    caption: "普鲁维在巴黎国立工艺学院授课 (1960年代)",
    width: 550,
    height: 400
  },
  {
    id: "family-photo",
    src: "/images/biography/family-photo.jpg",
    alt: "普鲁维家庭照片",
    caption: "普鲁维与家人在南锡家中 (1955年)",
    width: 480,
    height: 360
  }
];

// Gallery configuration for biography images
export const biographyGalleryConfig = {
  thumbnailSize: { width: 150, height: 100 },
  fullSize: { width: 800, height: 600 },
  autoPlay: false,
  showThumbnails: true,
  showCaption: true,
  transitionDuration: 300
};