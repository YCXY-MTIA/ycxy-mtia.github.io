export const SITE = {
  nameZh: '医学科技兴趣协会',
  nameEn: 'Medical Technology Interest Association',
  est: 'EST. 2002 · YICHUN UNIVERSITY',
};

export const NAV_LINKS = [
  { id: 'home', label: '主页' },
  { id: 'about', label: '关于我们' },
  { id: 'activities', label: '特色活动' },
  { id: 'join', label: '加入我们' },
] as const;

export const HERO = {
  title: SITE.nameZh,
  titleEn: SITE.nameEn,
  est: SITE.est,
  introLead:
    '科协成立于2002年，是宜春学院以医学科技实践与创新为特色的学生社团。',
  introBody:
    '协会致力于搭建医学学习、科技创新、专业实践与学术交流平台，鼓励青年学生在实践中学习、在探索中创新。',
  years: '2002 — 2026',
  yearsNote: '二十余年医学科技实践与探索',
  motto: ['崇尚科学', '追求真知', '勇于实践', '锐意创新'],
  explore: 'EXPLORE OUR STORY',
};

export type Era = {
  range: string;
  theme: string;
  photoLabel: string;
  image: string;
  events: string[];
};

export const JOURNEY = {
  title: 'OUR JOURNEY',
  span: '2002——2026',
  subtitle: '二十余载·步履不停',
  eras: [
    {
      range: '2002-2013',
      theme: '探索·初创',
      photoLabel: '手术模拟照片',
      image: '/images/journey-1.png',
      events: [
        '2002 医学科技兴趣协会成立',
        '2005 第一届科普大使选拔赛',
        '2006 第一届护理技能大赛',
        '2008 第一届外科手术模拟大赛',
        '2013 第一届标本制作大赛',
      ],
    },
    {
      range: '2014-2019',
      theme: '实践·拓展',
      photoLabel: '临床病理分析照片',
      image: '/images/journey-2.jpg',
      events: [
        '2014 荣获临床技能大赛华东赛区三等奖',
        '2015 荣获临床技能大赛华东赛区三等奖',
        '2015 第一届急救知识与操作大赛',
        '2016 第一届临床病例分析大赛',
        '2018 第一届解剖绘图大赛',
      ],
    },
    {
      range: '2020-2023',
      theme: '创新·竞赛',
      photoLabel: '生化歌曲照片',
      image: '/images/journey-3.jpg',
      events: [
        '2021 第一届生化歌曲大赛',
        '2022 第一届机能实验大赛',
        '2022 荣获生化歌曲大赛全国二等奖',
        '2023 荣获生化歌曲大赛全国三等奖 2 项',
        '2023 第一届公共卫生知识竞赛',
      ],
    },
    {
      range: '2024至2026',
      theme: '突破·延续',
      photoLabel: '运动生物照片',
      image: '/images/journey-4.jpg',
      events: [
        '2024 第一届组织切片鉴别竞赛',
        '2025 第一届“救在当下”趣味赛',
        '2025 荣获第三届运动生物医学年会解剖分会一等奖 2 项',
        '2026 荣获第十二届医创赛中南赛区三等奖',
        '2024至2026 荣获国家级大创 2 项、省级大创 2 项',
      ],
    },
  ] as Era[],
};

export const ACTIVITIES = {
  title: 'FEATURED ACTIVITIES',
  subtitle: '特色活动',
  tagsEn: 'Clinical · Science · Competence · Team Building',
  tagsZh: '临床 / 科普 / 竞赛 / 团建',
};

export type WallPhoto = {
  src: string;
  label: string;
  note: string;
  landscape: boolean;
  x: number;
  y: number;
  rot: number;
  depth: number;
  z: number;
};

export const WALL_PHOTOS: WallPhoto[] = [
  { label: '救在当下趣味赛', note: '2025 · 趣味赛', src: '/images/wall/wall-01.webp', landscape: true, x: 0, y: 0, rot: -6, depth: 0.7, z: 1 },
  { label: '趣味赛合照', note: '2025 · 救在当下', src: '/images/wall/wall-02.webp', landscape: true, x: 23, y: 17, rot: 1, depth: 0.81, z: 2 },
  { label: '趣味赛团队赛', note: '2025 · 救在当下', src: '/images/wall/wall-03.webp', landscape: true, x: 46, y: 34, rot: -5, depth: 0.92, z: 3 },
  { label: '临床技能大赛', note: '2025', src: '/images/wall/wall-04.webp', landscape: true, x: 69, y: 9, rot: 2, depth: 1.03, z: 4 },
  { label: '技能大赛合照', note: '2025', src: '/images/wall/wall-05.webp', landscape: true, x: 20, y: 26, rot: -4, depth: 1.14, z: 5 },
  { label: '科协大合照', note: '2025届', src: '/images/wall/wall-06.webp', landscape: true, x: 43, y: 1, rot: 3, depth: 0.75, z: 6 },
  { label: '病理分析大赛', note: '2025 · 选手风采', src: '/images/wall/wall-07.webp', landscape: true, x: 66, y: 18, rot: -3, depth: 0.86, z: 7 },
  { label: '技能大赛教学', note: '临床技能', src: '/images/wall/wall-08.webp', landscape: true, x: 17, y: 35, rot: 4, depth: 0.97, z: 8 },
  { label: '冬至包饺子', note: '冬至活动', src: '/images/wall/wall-09.webp', landscape: true, x: 40, y: 10, rot: -2, depth: 1.08, z: 9 },
  { label: '冬至包馄饨', note: '冬至活动', src: '/images/wall/wall-10.webp', landscape: false, x: 67, y: 17, rot: 5, depth: 1.19, z: 10 },
  { label: '冬至大合照', note: '冬至活动', src: '/images/wall/wall-11.webp', landscape: true, x: 14, y: 2, rot: -1, depth: 0.8, z: 11 },
  { label: '冬至煮饺子', note: '冬至活动', src: '/images/wall/wall-12.webp', landscape: true, x: 37, y: 19, rot: 6, depth: 0.91, z: 12 },
  { label: '获奖证书', note: '协会成员', src: '/images/wall/wall-13.webp', landscape: false, x: 66, y: 0, rot: 0, depth: 1.02, z: 13 },
  { label: '手术模拟比赛', note: '外科', src: '/images/wall/wall-14.webp', landscape: true, x: 11, y: 11, rot: -6, depth: 1.13, z: 14 },
  { label: '手术模拟比赛', note: '外科', src: '/images/wall/wall-15.webp', landscape: true, x: 34, y: 28, rot: 1, depth: 0.74, z: 15 },
  { label: '外科技能比赛', note: '竞赛', src: '/images/wall/wall-16.webp', landscape: true, x: 57, y: 3, rot: -5, depth: 0.85, z: 16 },
  { label: '喀秋莎', note: '学生会主席', src: '/images/wall/wall-17.webp', landscape: false, x: 18, y: 0, rot: 2, depth: 0.96, z: 17 },
  { label: '学生解剖绘画', note: '作品', src: '/images/wall/wall-18.webp', landscape: false, x: 41, y: 17, rot: -4, depth: 1.07, z: 18 },
  { label: '学生解剖绘画', note: '作品', src: '/images/wall/wall-19.webp', landscape: true, x: 54, y: 12, rot: 3, depth: 1.18, z: 19 },
  { label: '学生解剖绘画', note: '作品', src: '/images/wall/wall-20.webp', landscape: false, x: 17, y: 17, rot: -3, depth: 0.79, z: 20 },
  { label: '宣讲医学常识', note: '对外科普', src: '/images/wall/wall-21.webp', landscape: true, x: 28, y: 4, rot: 4, depth: 0.9, z: 21 },
  { label: '讲解生科馆', note: '对外科普', src: '/images/wall/wall-22.webp', landscape: true, x: 51, y: 21, rot: -2, depth: 1.01, z: 22 },
  { label: '讲解生科馆', note: '对外科普', src: '/images/wall/wall-23.webp', landscape: true, x: 2, y: 38, rot: 5, depth: 1.12, z: 23 },
  { label: '讲解生科馆', note: '对外科普', src: '/images/wall/wall-24.webp', landscape: true, x: 25, y: 13, rot: -1, depth: 0.73, z: 24 },
  { label: '临床技能大赛', note: '往届', src: '/images/wall/wall-25.webp', landscape: true, x: 48, y: 30, rot: 6, depth: 0.84, z: 25 },
  { label: '临床技能大赛', note: '往届', src: '/images/wall/wall-26.webp', landscape: true, x: 71, y: 5, rot: 0, depth: 0.95, z: 26 },
  { label: '标本制作大赛', note: '往届', src: '/images/wall/wall-27.webp', landscape: true, x: 22, y: 22, rot: -6, depth: 1.06, z: 27 },
  { label: '标本制作大赛', note: '往届', src: '/images/wall/wall-28.webp', landscape: true, x: 45, y: 39, rot: 1, depth: 1.17, z: 28 },
  { label: '获奖证书', note: '成员荣誉', src: '/images/wall/wall-29.webp', landscape: false, x: 14, y: 0, rot: -5, depth: 0.78, z: 29 },
  { label: '护理技能大赛', note: '竞赛', src: '/images/wall/wall-30.webp', landscape: true, x: 19, y: 31, rot: 2, depth: 0.89, z: 30 },
  { label: '活动瞬间', note: '记录', src: '/images/wall/wall-31.webp', landscape: true, x: 42, y: 6, rot: -4, depth: 1, z: 31 },
  { label: '早些年的我们', note: '回忆', src: '/images/wall/wall-32.webp', landscape: true, x: 65, y: 23, rot: 3, depth: 1.11, z: 32 },
  { label: '国防素养大赛', note: '协会成员赛照', src: '/images/wall/wall-33.webp', landscape: true, x: 16, y: 40, rot: -3, depth: 0.72, z: 33 },
  { label: '生化歌曲大赛', note: '第三届', src: '/images/wall/wall-34.webp', landscape: true, x: 39, y: 15, rot: 4, depth: 0.83, z: 34 },
  { label: '部门生日会', note: '团建', src: '/images/wall/wall-35.webp', landscape: true, x: 62, y: 32, rot: -2, depth: 0.94, z: 35 },
  { label: '解剖绘画', note: '作品', src: '/images/wall/wall-36.webp', landscape: false, x: 35, y: 17, rot: 5, depth: 1.05, z: 36 },
  { label: '解剖绘画', note: '作品', src: '/images/wall/wall-37.webp', landscape: false, x: 58, y: 0, rot: -1, depth: 1.16, z: 37 },
  { label: '跨年', note: '团建', src: '/images/wall/wall-38.webp', landscape: false, x: 11, y: 17, rot: 6, depth: 0.77, z: 38 },
  { label: '老会长放烟花', note: '跨年', src: '/images/wall/wall-39.webp', landscape: true, x: 10, y: 16, rot: 0, depth: 0.88, z: 39 },
  { label: '部门团建', note: '团建', src: '/images/wall/wall-40.webp', landscape: true, x: 33, y: 33, rot: -6, depth: 0.99, z: 40 },
];

export const JOIN = {
  title: '加入我们',
  subtitle: '一起探索更多可能',
  footerEn: 'Medical Technology Interest Association',
  footerZh: '© 2026 宜春学院 · 医学科技兴趣协会',
};
