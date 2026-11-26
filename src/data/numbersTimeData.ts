// Converter & Data for Numbers, Dates, Time & Currency in Chinese

const DIGIT_HANZI = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
const DIGIT_PINYIN = ['líng', 'yī', 'èr', 'sān', 'sì', 'wǔ', 'liù', 'qī', 'bā', 'jiǔ'];

/**
 * Converts a 4-digit block (0 - 9999) to Chinese characters and pinyin
 */
function sectionToChinese(num: number, isHighestSection: boolean = false): { hanzi: string; pinyin: string[] } {
  if (num === 0) return { hanzi: '', pinyin: [] };

  let hanziStr = '';
  const pinyinArr: string[] = [];
  const qian = Math.floor(num / 1000);
  const bai = Math.floor((num % 1000) / 100);
  const shi = Math.floor((num % 100) / 10);
  const ge = num % 10;

  // 千 (nghìn)
  if (qian > 0) {
    const qianDigit = qian === 2 ? '两' : DIGIT_HANZI[qian];
    const qianPinyin = qian === 2 ? 'liǎng' : DIGIT_PINYIN[qian];
    hanziStr += qianDigit + '千';
    pinyinArr.push(qianPinyin, 'qiān');
  }

  // 百 (trăm)
  if (bai > 0) {
    const baiDigit = bai === 2 ? '两' : DIGIT_HANZI[bai];
    const baiPinyin = bai === 2 ? 'liǎng' : DIGIT_PINYIN[bai];
    hanziStr += baiDigit + '百';
    pinyinArr.push(baiPinyin, 'bǎi');
  } else if (qian > 0 && (shi > 0 || ge > 0)) {
    hanziStr += '零';
    pinyinArr.push('líng');
  }

  // 十 (chục)
  if (shi > 0) {
    if (shi === 1 && isHighestSection && qian === 0 && bai === 0) {
      // 10-19 at start: 十 instead of 一十
      hanziStr += '十';
      pinyinArr.push('shí');
    } else {
      hanziStr += DIGIT_HANZI[shi] + '十';
      pinyinArr.push(DIGIT_PINYIN[shi], 'shí');
    }
  } else if (bai > 0 && ge > 0) {
    hanziStr += '零';
    pinyinArr.push('líng');
  }

  // 个 (đơn vị)
  if (ge > 0) {
    hanziStr += DIGIT_HANZI[ge];
    pinyinArr.push(DIGIT_PINYIN[ge]);
  }

  return { hanzi: hanziStr, pinyin: pinyinArr };
}

/**
 * Converts any integer between 0 and 999,999,999 to Chinese Characters and Pinyin
 */
export function convertNumberToChinese(num: number): { hanzi: string; pinyin: string } {
  if (num === 0) return { hanzi: '零', pinyin: 'líng' };
  if (num < 0 || !Number.isInteger(num)) return { hanzi: '—', pinyin: '—' };
  if (num > 999999999) return { hanzi: 'Số quá lớn (vượt quá 999 triệu)', pinyin: '—' };

  let remaining = num;
  const yi = Math.floor(remaining / 100000000); // 亿
  remaining %= 100000000;
  const wan = Math.floor(remaining / 10000); // 万
  const base = remaining % 10000;

  let fullHanzi = '';
  const fullPinyin: string[] = [];

  // Hàng Ức (亿 - 100,000,000)
  if (yi > 0) {
    const resYi = sectionToChinese(yi, true);
    fullHanzi += resYi.hanzi + '亿';
    fullPinyin.push(...resYi.pinyin, 'yì');
    if (wan === 0 && base > 0) {
      fullHanzi += '零';
      fullPinyin.push('líng');
    }
  }

  // Hàng Vạn (万 - 10,000)
  if (wan > 0) {
    const resWan = sectionToChinese(wan, yi === 0);
    fullHanzi += resWan.hanzi + '万';
    fullPinyin.push(...resWan.pinyin, 'wàn');
    if (base > 0 && base < 1000) {
      fullHanzi += '零';
      fullPinyin.push('líng');
    }
  }

  // Hàng Đơn vị (0 - 9999)
  if (base > 0) {
    const resBase = sectionToChinese(base, yi === 0 && wan === 0);
    fullHanzi += resBase.hanzi;
    fullPinyin.push(...resBase.pinyin);
  }

  return {
    hanzi: fullHanzi,
    pinyin: fullPinyin.join(' ')
  };
}

export interface TimeClockSample {
  time: string; // "08:15"
  hanzi: string; // "八点一刻"
  pinyin: string; // "bā diǎn yí kè"
  vietnamese: string; // "8 giờ 15 phút (8 giờ 1 khắc)"
  colloquial?: string; // "八点十五分"
  period: string; // "早上"
}

export const TIME_CLOCK_SAMPLES: TimeClockSample[] = [
  { time: '07:00', hanzi: '七点整', pinyin: 'qī diǎn zhěng', vietnamese: '7 giờ đúng', period: '早上 (Sáng sớm)' },
  { time: '08:15', hanzi: '八点一刻', pinyin: 'bā diǎn yí kè', vietnamese: '8 giờ 15 phút (8 giờ 1 khắc)', colloquial: '八点十五分', period: '上午 (Buổi sáng)' },
  { time: '09:30', hanzi: '九点半', pinyin: 'jiǔ diǎn bàn', vietnamese: '9 giờ rưỡi (9 giờ 30)', colloquial: '九点三十分', period: '上午 (Buổi sáng)' },
  { time: '10:45', hanzi: '差一刻十一点', pinyin: 'chà yí kè shíyī diǎn', vietnamese: '11 giờ kém 15 (kém 1 khắc)', colloquial: '十点四十五分', period: '上午 (Buổi sáng)' },
  { time: '12:00', hanzi: '中午十二点', pinyin: 'zhōngwǔ shí\'èr diǎn', vietnamese: '12 giờ trưa', period: '中午 (Buổi trưa)' },
  { time: '14:20', hanzi: '下午两点二十分', pinyin: 'xiàwǔ liǎng diǎn èrshí fēn', vietnamese: '2 giờ 20 chiều (dùng 两点)', period: '下午 (Buổi chiều)' },
  { time: '16:50', hanzi: '差十分五点', pinyin: 'chà shí fēn wǔ diǎn', vietnamese: '5 giờ kém 10 phút chiều', colloquial: '四点五十分', period: '下午 (Buổi chiều)' },
  { time: '19:00', hanzi: '晚上七点', pinyin: 'wǎnshang qī diǎn', vietnamese: '7 giờ tối', period: '晚上 (Buổi tối)' },
  { time: '21:30', hanzi: '晚上九点半', pinyin: 'wǎnshang jiǔ diǎn bàn', vietnamese: '9 rưỡi tối', period: '晚上 (Buổi tối)' },
  { time: '23:45', hanzi: '差一刻十二点', pinyin: 'chà yí kè shí\'èr diǎn', vietnamese: '12 giờ đêm kém 15', period: '深夜 (Đêm muộn)' }
];

export interface DayPeriodItem {
  period: string;
  pinyin: string;
  hoursRange: string;
  vietnamese: string;
  example: string;
  examplePinyin: string;
}

export const DAY_PERIODS: DayPeriodItem[] = [
  { period: '早上', pinyin: 'zǎoshang', hoursRange: '06:00 - 08:00', vietnamese: 'Sáng sớm (khi vừa thức dậy)', example: '早上好！', examplePinyin: 'Zǎoshang hǎo!' },
  { period: '上午', pinyin: 'shàngwǔ', hoursRange: '08:00 - 11:30', vietnamese: 'Buổi sáng (giờ đi học / đi làm)', example: '上午九点上课。', examplePinyin: 'Shàngwǔ jiǔ diǎn shàngkè.' },
  { period: '中午', pinyin: 'zhōngwǔ', hoursRange: '11:30 - 13:00', vietnamese: 'Buổi trưa (giờ nghỉ trưa, ăn trưa)', example: '中午吃米饭。', examplePinyin: 'Zhōngwǔ chī mǐfàn.' },
  { period: '下午', pinyin: 'xiàwǔ', hoursRange: '13:00 - 18:00', vietnamese: 'Buổi chiều', example: '下午两点开会。', examplePinyin: 'Xiàwǔ liǎng diǎn kāihuì.' },
  { period: '晚上', pinyin: 'wǎnshang', hoursRange: '18:00 - 23:00', vietnamese: 'Buổi tối', example: '晚上看电视。', examplePinyin: 'Wǎnshang kàn diànshì.' },
  { period: '半夜', pinyin: 'bànyè', hoursRange: '23:00 - 05:00', vietnamese: 'Nửa đêm / Khuya', example: '半夜十二点睡觉。', examplePinyin: 'Bànyè shí\'èr diǎn shuìjiào.' }
];

export interface CurrencyItem {
  officialUnit: string; // 元 / 角 / 分
  colloquialUnit: string; // 块 / 毛 / 分
  pinyin: string;
  vietnamese: string;
  ratio: string;
  example: string;
  exampleReading: string;
  exampleMeaning: string;
}

export const CURRENCY_GUIDE: CurrencyItem[] = [
  {
    officialUnit: '元 (yuán)',
    colloquialUnit: '块 (kuài)',
    pinyin: 'kuài / yuán',
    vietnamese: 'Đồng tệ (Đơn vị cơ bản lớn nhất của RMB)',
    ratio: '1 元 = 10 角 = 100 分',
    example: '¥ 5.00',
    exampleReading: '五块钱 (wǔ kuài qián)',
    exampleMeaning: '5 đồng tệ (khoảng 17.500 VNĐ)'
  },
  {
    officialUnit: '角 (jiǎo)',
    colloquialUnit: '毛 (máo)',
    pinyin: 'máo / jiǎo',
    vietnamese: 'Hào (Bằng 1/10 đồng tệ, thường dùng trong khẩu ngữ)',
    ratio: '1 角 = 10 分',
    example: '¥ 0.50',
    exampleReading: '五毛钱 (wǔ máo qián)',
    exampleMeaning: '5 hào (nửa tệ)'
  },
  {
    officialUnit: '分 (fēn)',
    colloquialUnit: '分 (fēn)',
    pinyin: 'fēn',
    vietnamese: 'Xu (Bằng 1/100 đồng tệ, hiện nay ít lưu hành tiền mặt)',
    ratio: 'Đơn vị nhỏ nhất',
    example: '¥ 0.05',
    exampleReading: '五分钱 (wǔ fēn qián)',
    exampleMeaning: '5 xu'
  }
];

export interface NumbersQuizQuestion {
  id: string;
  question: string;
  targetAnswer: string;
  options: string[];
  explanation: string;
}

export const NUMBERS_QUIZ_LIST: NumbersQuizQuestion[] = [
  {
    id: 'q1',
    question: 'Số 2026 đọc trong tiếng Trung như thế nào?',
    targetAnswer: '二零二六',
    options: ['二零二六', '两千零二十六', '二千二十六', '两零两六'],
    explanation: 'Khi đọc năm (năm 2026), đọc tuần tự từng con số đơn lẻ: 二零二六 (èr líng èr liù nián).'
  },
  {
    id: 'q2',
    question: '"8 giờ 15 phút" có cách nói ngắn gọn dùng "khắc" là gì?',
    targetAnswer: '八点一刻',
    options: ['八点一刻', '八点一分', '八点半', '差一刻八点'],
    explanation: 'Trong tiếng Trung, 15 phút được gọi là 1 khắc (一刻 yí kè), do đó 8:15 nói là 八点一刻 (bā diǎn yí kè).'
  },
  {
    id: 'q3',
    question: 'Giá tiền "¥ 15.50" trong khẩu ngữ người bản xứ thường nói là gì?',
    targetAnswer: '十五块五',
    options: ['十五块五', '十五元五分', '十五块五毛钱', '一十五元'],
    explanation: 'Trong khẩu ngữ giá tiền, khi sau 毛/块 đã là số cuối thì thường lược bớt chữ 毛, nói tắt là 十五块五 (shíwǔ kuài wǔ).'
  },
  {
    id: 'q4',
    question: 'Khi nói "2 giờ chiều", từ nào dùng để chỉ số 2?',
    targetAnswer: '两点 (liǎng diǎn)',
    options: ['两点 (liǎng diǎn)', '二点 (èr diǎn)', '双点 (shuāng diǎn)', '一对点 (yí duì diǎn)'],
    explanation: 'Khi đứng trước lượng từ hoặc chỉ giờ giấc, bắt buộc dùng 两 (liǎng diǎn), tuyệt đối không dùng 二点.'
  },
  {
    id: 'q5',
    question: 'Con số 10,000 trong hệ thống đếm của người Trung Quốc là gì?',
    targetAnswer: '一万 (yí wàn)',
    options: ['一万 (yí wàn)', '十千 (shí qiān)', '一百百 (yì bǎi bǎi)', '十万 (shí wàn)'],
    explanation: 'Người Trung Quốc đếm số theo cụm 4 chữ số, 10.000 có đơn vị riêng là 万 (vạn), đọc là 一万 (yí wàn).'
  },
  {
    id: 'q6',
    question: '"Chủ nhật" trong tiếng Trung có cách nói nào phổ biến nhất trong giao tiếp?',
    targetAnswer: '星期天 / 星期日',
    options: ['星期天 / 星期日', '星期七', '礼拜七', '周七'],
    explanation: 'Thứ trong tuần từ Thứ Hai đến Thứ Bảy là 星期一 đến 星期六, riêng Chủ Nhật là 星期天 (khẩu ngữ) hoặc 星期日 (văn viết).'
  },
  {
    id: 'q7',
    question: 'Số 105 trong tiếng Trung đọc là gì?',
    targetAnswer: '一百零五 (yì bǎi líng wǔ)',
    options: ['一百零五 (yì bǎi líng wǔ)', '一百五 (yì bǎi wǔ)', '一五零 (yī wǔ líng)', '十百零五 (shí bǎi líng wǔ)'],
    explanation: 'Chữ số 0 ở giữa các hàng phải đọc là 零 (líng): 一百零五. Nếu chỉ nói 一百五 thì người bản xứ sẽ hiểu là 150!'
  },
  {
    id: 'q8',
    question: '"9 giờ rưỡi (9:30)" trong tiếng Trung nói là gì?',
    targetAnswer: '九点半 (jiǔ diǎn bàn)',
    options: ['九点半 (jiǔ diǎn bàn)', '九点三十刻', '九点半分', '九点二刻'],
    explanation: '30 phút được dùng chữ 半 (bàn - nửa/rưỡi): 九点半 (9 giờ rưỡi).'
  }
];
