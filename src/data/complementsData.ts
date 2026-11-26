export interface ComplementExample {
  chinese: string;
  pinyin: string;
  meaning: string;
  highlightWord: string;
}

export interface ComplementItem {
  id: string;
  name: string; // e.g. "Bổ ngữ Kết quả 完 (Xong)"
  hanzi: string; // e.g. "完"
  pinyin: string; // e.g. "wán"
  category: 'resultative' | 'directional' | 'potential' | 'state_degree';
  categoryName: string;
  formula: string; // e.g. "Động từ + 完 (+ 了)"
  meaningEffect: string;
  commonPairs: string[]; // e.g. ["做完 (làm xong)", "吃完 (ăn xong)", "看完 (xem xong)"]
  goldenRule: string; // Lưu ý quan trọng
  examples: ComplementExample[];
  commonMistake?: {
    wrong: string;
    right: string;
    explanation: string;
  };
}

export interface ComplementQuizItem {
  id: string;
  question: string;
  sentence: string; // Câu hỏi điền từ
  pinyin: string;
  meaning: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  ruleTested: string;
}

export const COMPLEMENT_CATEGORIES = [
  { id: 'all', name: 'Tất cả bổ ngữ', icon: 'Sparkles' },
  { id: 'resultative', name: 'Bổ ngữ Kết quả (结果)', icon: 'CheckCircle' },
  { id: 'directional', name: 'Bổ ngữ Xu hướng (趋向)', icon: 'Navigation' },
  { id: 'potential', name: 'Bổ ngữ Khả năng (可能)', icon: 'Zap' },
  { id: 'state_degree', name: 'Bổ ngữ Trạng thái (状态)', icon: 'TrendingUp' },
] as const;

export const COMPLEMENT_GOLDEN_RULES = [
  {
    title: 'Bẫy 1: Phủ định Bổ ngữ Kết quả DÙNG "没/没有", CẤM DÙNG "不"',
    rule: 'Bổ ngữ kết quả biểu thị hành động đã hoàn thành và đạt kết quả. Khi phủ định nghĩa là kết quả đó CHƯA ĐẠT ĐƯỢC, vì vậy bắt buộc dùng "没 / 没有", tuyệt đối không dùng "不".',
    wrong: '我不听懂老师的话。 (Sai)',
    right: '我没听懂老师的话。 (Đúng)',
    explanation: 'Dùng "没听懂" (chưa nghe hiểu), không bao giờ dùng "不听懂". Tương tự: 没做完, 没看见, 没找到.',
  },
  {
    title: 'Bẫy 2: Tân ngữ chỉ NƠI CHỐN bắt buộc đứng TRƯỚC "来/去"',
    rule: 'Trong Bổ ngữ Xu hướng, nếu tân ngữ là danh từ chỉ ĐỊA ĐIỂM / NƠI CHỐN (nhà, trường học, phòng học, phòng ký túc xá...), tân ngữ PHẢI đặt ở giữa động từ và 来/去.',
    wrong: '我们回去家吧。 / 他进来了教室。 (Sai)',
    right: '我们回家去吧。 / 他进教室来了。 (Đúng)',
    explanation: 'Quy tắc vàng: Động từ + [NƠI CHỐN] + 来/去! Tuyệt đối không để nơi chốn đứng sau cùng.',
  },
  {
    title: 'Bẫy 3: Phủ định Bổ ngữ Khả năng dùng "V + 不 + C"',
    rule: 'Khi diễn đạt không thể nghe hiểu, không thể làm xong, không thể mua nổi, cấu trúc chuẩn là "V + 不 + C", KHÔNG dùng "不能 + V + 得 + C".',
    wrong: '这个字我不能看得懂。 (Sai)',
    right: '这个字我看不懂。 (Đúng)',
    explanation: 'Phủ định khả năng dùng "看不懂" (không nhìn hiểu được), "买不起" (không đủ tiền mua), "做不完" (làm không xuể).',
  },
  {
    title: 'Bẫy 4: Động từ có Tân ngữ trong Bổ ngữ Trạng thái (得)',
    rule: 'Khi động từ mang theo tân ngữ mà muốn miêu tả mức độ bằng chữ "得", bạn phải LẶP LẠI ĐỘNG TỪ hoặc ĐƯA TÂN NGỮ LÊN TRƯỚC.',
    wrong: '他说汉语得很流利。 (Sai)',
    right: '他说汉语说得很流利。 HOẶC 他的汉语说得很流利。 (Đúng)',
    explanation: 'Chữ "得" chỉ được đứng ngay sau động từ (说得), không được đứng sau tân ngữ (汉语得 ✗).',
  },
];

export const COMPLEMENTS_LIST: ComplementItem[] = [
  // 1. Resultative Complements (Bổ ngữ Kết quả)
  {
    id: 'cp-1',
    name: 'Bổ ngữ Kết quả 完 (Xong)',
    hanzi: '完',
    pinyin: 'wán',
    category: 'resultative',
    categoryName: 'Bổ ngữ Kết quả',
    formula: 'Động từ + 完 (+ 了)',
    meaningEffect: 'Biểu thị hành động đã kết thúc trọn vẹn, toàn bộ công việc hay đồ vật đã được tiêu hao hoặc xử lý hết.',
    commonPairs: ['做完 (làm xong)', '吃完 (ăn xong)', '看完 (xem xong)', '说完 (nói xong)', '卖完 (bán hết)', '喝完 (uống hết)'],
    goldenRule: 'Phủ định dùng "没 + V + 完", thể nghi vấn dùng "...了没有?" hoặc "...了吗?".',
    examples: [
      {
        chinese: '我今天下午才把这份报告写完。',
        pinyin: 'Wǒ jīntiān xiàwǔ cái bǎ zhè fèn bàogào xiěwán.',
        meaning: 'Chiều nay tôi mới viết xong bản báo cáo này.',
        highlightWord: '写完',
      },
      {
        chinese: '对不起，今天的烤鸭已经卖完了。',
        pinyin: 'Duìbuqǐ, jīntiān de kǎoyā yǐjīng màiwán le.',
        meaning: 'Xin lỗi, món vịt quay của ngày hôm nay đã bán hết rồi.',
        highlightWord: '卖完',
      },
    ],
    commonMistake: {
      wrong: '我还没有做完了作业。',
      right: '我还没有做完作业。',
      explanation: 'Trong câu phủ định "还没..." thì cuối câu không dùng "了".',
    },
  },
  {
    id: 'cp-2',
    name: 'Bổ ngữ Kết quả 懂 (Hiểu)',
    hanzi: '懂',
    pinyin: 'dǒng',
    category: 'resultative',
    categoryName: 'Bổ ngữ Kết quả',
    formula: 'Động từ (听/看) + 懂 (+ 了)',
    meaningEffect: 'Biểu thị thông qua việc nghe hoặc đọc mà thấu hiểu được ý nghĩa, nội dung.',
    commonPairs: ['听懂 (nghe hiểu)', '看懂 (đọc/nhìn hiểu)', '弄懂 (tìm hiểu cho thấu đáo)'],
    goldenRule: 'Thường chỉ kết hợp với các động từ giác quan thu nhận thông tin (听, 看).',
    examples: [
      {
        chinese: '老师说话的速度太快，我没听懂。',
        pinyin: 'Lǎoshī shuōhuà de sùdù tài kuài, wǒ méi tīngdǒng.',
        meaning: 'Thầy giáo nói tốc độ nhanh quá, tôi nghe không hiểu.',
        highlightWord: '没听懂',
      },
      {
        chinese: '你看懂这篇中文短文的意思了吗？',
        pinyin: 'Nǐ kàndǒng zhè piān zhōngwén duǎnwén de yìsi le ma?',
        meaning: 'Bạn đã đọc hiểu ý nghĩa của bài văn ngắn tiếng Trung này chưa?',
        highlightWord: '看懂',
      },
    ],
    commonMistake: {
      wrong: '我不听懂。',
      right: '我没听懂。',
      explanation: 'Phủ định kết quả chưa đạt bắt buộc dùng "没", không dùng "不".',
    },
  },
  {
    id: 'cp-3',
    name: 'Bổ ngữ Kết quả 见 (Thấy)',
    hanzi: '见',
    pinyin: 'jiàn',
    category: 'resultative',
    categoryName: 'Bổ ngữ Kết quả',
    formula: 'Động từ (看/听/闻/遇) + 见 (+ 了)',
    meaningEffect: 'Biểu thị giác quan (mắt, tai, mũi) tiếp nhận được hình ảnh, âm thanh hoặc mùi hương của đối tượng.',
    commonPairs: ['看见 (nhìn thấy)', '听见 (nghe thấy)', '遇见 (gặp thấy)', '闻见 (ngửi thấy)'],
    goldenRule: 'Nhấn mạnh kết quả nhận biết khách quan của giác quan, khác với 看 (chỉ hành động nhìn nhưng chưa chắc đã thấy).',
    examples: [
      {
        chinese: '你看见我的手机了吗？',
        pinyin: 'Nǐ kànjiàn wǒ de shǒujī le ma?',
        meaning: 'Bạn có nhìn thấy chiếc điện thoại của tôi ở đâu không?',
        highlightWord: '看见',
      },
      {
        chinese: '外面太吵了，我听不见你说什么。',
        pinyin: 'Wàimiàn tài chǎo le, wǒ tīngbújiàn nǐ shuō shénme.',
        meaning: 'Bên ngoài ồn ào quá, tôi không nghe thấy bạn nói gì.',
        highlightWord: '听不见',
      },
    ],
  },
  {
    id: 'cp-4',
    name: 'Bổ ngữ Kết quả 到 (Được / Tới nơi)',
    hanzi: '到',
    pinyin: 'dào',
    category: 'resultative',
    categoryName: 'Bổ ngữ Kết quả',
    formula: 'Động từ + 到 (+ 了)',
    meaningEffect: 'Biểu thị: 1) Hành động đạt được mục đích (买到, 找到, 学到); 2) Hành động chạm tới thời gian/địa điểm (走到, 等到).',
    commonPairs: ['找到 (tìm được)', '买到 (mua được)', '学到 (học hỏi được)', '收到 (nhận được)', '遇到 (gặp phải)', '迟到 (đến muộn)'],
    goldenRule: 'Rất hay dùng để miêu tả những thứ bỏ công sức ra để đạt được thành quả.',
    examples: [
      {
        chinese: '找了半天，我终于找到钥匙了。',
        pinyin: 'Zhǎo le bàntiān, wǒ zhōngyú zhǎodào yàoshi le.',
        meaning: 'Tìm suốt nửa ngày, cuối cùng tôi cũng tìm thấy chìa khóa rồi.',
        highlightWord: '找到',
      },
      {
        chinese: '今天在中国文化课上，我们学到了很多新知识。',
        pinyin: 'Jīntiān zài zhōngguó wénhuà kè shàng, wǒmen xuédào le hěn duō xīn zhīshi.',
        meaning: 'Hôm nay trong tiết văn hóa Trung Quốc, chúng tôi đã học hỏi được rất nhiều kiến thức mới.',
        highlightWord: '学到',
      },
    ],
  },
  {
    id: 'cp-5',
    name: 'Bổ ngữ Kết quả 好 (Xong xuôi / Chuẩn bị tốt)',
    hanzi: '好',
    pinyin: 'hǎo',
    category: 'resultative',
    categoryName: 'Bổ ngữ Kết quả',
    formula: 'Động từ + 好 (+ 了)',
    meaningEffect: 'Khác với 完 (chỉ thuần túy kết thúc), 好 nhấn mạnh hành động hoàn tất một cách tốt đẹp, chỉn chu, sẵn sàng cho bước tiếp theo.',
    commonPairs: ['准备好 (chuẩn bị sẵn sàng)', '做好 (làm chu đáo)', '穿好 (mặc gọn gàng)', '想好 (nghĩ thấu đáo)', '修好 (sửa ngon lành)'],
    goldenRule: 'So sánh: 做完 = làm xong; 做好 = làm xong xuôi và đạt yêu cầu.',
    examples: [
      {
        chinese: '明天去旅游的东西，你都准备好了吗？',
        pinyin: 'Míngtiān qù lǚyóu de dōngxi, nǐ dōu zhǔnbèi hǎo le ma?',
        meaning: 'Đồ đạc để ngày mai đi du lịch, bạn đã chuẩn bị sẵn sàng hết chưa?',
        highlightWord: '准备好',
      },
      {
        chinese: '妈妈把晚饭做好了，大家快来吃吧。',
        pinyin: 'Māma bǎ wǎnfàn zuò hǎo le, dàjiā kuài lái chī ba.',
        meaning: 'Mẹ đã nấu cơm tối tươm tất rồi, mọi người mau tới ăn đi.',
        highlightWord: '做好',
      },
    ],
  },
  {
    id: 'cp-6',
    name: 'Bổ ngữ Kết quả 错 / 对 (Sai / Đúng)',
    hanzi: '错 / 对',
    pinyin: 'cuò / duì',
    category: 'resultative',
    categoryName: 'Bổ ngữ Kết quả',
    formula: 'Động từ + 错 / 对 (+ 了)',
    meaningEffect: 'Đánh giá tính chính xác của hành động (nghe nhầm, làm sai, đoán đúng).',
    commonPairs: ['做错 (làm sai)', '写错 (viết sai)', '说错 (nói hớ/sai)', '猜对 (đoán trúng)', '回答对 (trả lời đúng)'],
    goldenRule: 'Dùng rất phổ biến trong thi cử, kiểm tra bài vở và đố vui.',
    examples: [
      {
        chinese: '这道数学题，我一不小心做错了。',
        pinyin: 'Zhè dào shùxuétí, wǒ yì bù xiǎoxīn zuò cuò le.',
        meaning: 'Câu toán này tôi lỡ sơ ý làm sai mất rồi.',
        highlightWord: '做错',
      },
      {
        chinese: '你猜对了，明天我们确实放假！',
        pinyin: 'Nǐ cāi duì le, míngtiān wǒmen quèshí fàngjià!',
        meaning: 'Bạn đoán đúng rồi đấy, ngày mai chúng ta thực sự được nghỉ!',
        highlightWord: '猜对',
      },
    ],
  },

  // 2. Directional Complements (Bổ ngữ Xu hướng)
  {
    id: 'cp-7',
    name: 'Bổ ngữ Xu hướng Đơn (来 vs 去)',
    hanzi: '来 / 去',
    pinyin: 'lái / qù',
    category: 'directional',
    categoryName: 'Bổ ngữ Xu hướng',
    formula: 'Động từ + 来 (tiến lại gần) / 去 (rời ra xa)',
    meaningEffect: 'Xác định phương hướng di chuyển tương quan với vị trí của NGƯỜI NÓI: Hướng về phía người nói dùng "来", hướng ra xa người nói dùng "去".',
    commonPairs: ['上来 (lên đây)', '上去 (lên đó)', '下来 (xuống đây)', '下去 (xuống đó)', '进来 (vào đây)', '进去 (vào đó)', '出来 (ra đây)', '出去 (ra ngoài đó)', '回来 (về đây)', '回去 (về đó)', '过来 (qua đây)', '过去 (qua đó)', '起来 (đứng dậy)'],
    goldenRule: 'Vị trí người nói quyết định dùng 来 hay 去. Nếu người nói ở trong phòng: bảo người ngoài "进来"; nếu ở ngoài: bảo người trong "出来".',
    examples: [
      {
        chinese: '外面冷，你快进屋来吧。',
        pinyin: 'Wàimiàn lěng, nǐ kuài jìn wū lái ba.',
        meaning: 'Bên ngoài lạnh lắm, bạn mau vào trong nhà đi (người nói đang ở trong nhà).',
        highlightWord: '进屋来',
      },
      {
        chinese: '他拿着一本书，高高兴兴地走进了图书馆。',
        pinyin: 'Tā ná zhe yì běn shū, gāogāo-xìngxìng de zǒu jìn le túshūguǎn.',
        meaning: 'Anh ấy cầm một cuốn sách, vui vẻ bước vào thư viện.',
        highlightWord: '走进',
      },
    ],
    commonMistake: {
      wrong: '请你进来教室。',
      right: '请你进教室来。',
      explanation: 'Tân ngữ chỉ nơi chốn (教室) BẮT BUỘC ĐỨNG TRƯỚC "来"!',
    },
  },
  {
    id: 'cp-8',
    name: 'Bổ ngữ Xu hướng Phức (Động từ + 上/下/进/出/回/过/起 + 来/去)',
    hanzi: '出来 / 进去 / 拿出来',
    pinyin: 'chūlái / jìnqù / ná chūlái',
    category: 'directional',
    categoryName: 'Bổ ngữ Xu hướng',
    formula: 'Động từ chính + (上/下/进/出/回/过) + 来/去',
    meaningEffect: 'Miêu tả hướng di chuyển phức hợp vừa có tính phương vị vừa có quan hệ xa/gần với người nói.',
    commonPairs: ['拿出来 (lấy ra)', '带回去 (mang về)', '跑过来 (chạy qua)', '买回来 (mua về)', '寄出去 (gửi đi)'],
    goldenRule: 'Tân ngữ đồ vật: có thể đặt giữa hoặc đặt sau (拿出一本书来 HOẶC 拿出来一本书).',
    examples: [
      {
        chinese: '老师从包里拿出来一本汉语词典。',
        pinyin: 'Lǎoshī cóng bāo lǐ ná chūlái yì běn hànyǔ cídiǎn.',
        meaning: 'Thầy giáo từ trong cặp lấy ra một cuốn từ điển tiếng Trung.',
        highlightWord: '拿出来',
      },
      {
        chinese: '妈妈从超市买回来很多新鲜水果。',
        pinyin: 'Māma cóng chāoshì mǎi huílái hěn duō xīnxiān shuǐguǒ.',
        meaning: 'Mẹ từ siêu thị mua về rất nhiều hoa quả tươi ngon.',
        highlightWord: '买回来',
      },
    ],
  },

  // 3. Potential Complements (Bổ ngữ Khả năng)
  {
    id: 'cp-9',
    name: 'Bổ ngữ Khả năng (V + 得 / 不 + C)',
    hanzi: '看得见 / 看不见',
    pinyin: 'kàndejiàn / kànbuqiàn',
    category: 'potential',
    categoryName: 'Bổ ngữ Khả năng',
    formula: 'Khẳng định: V + 得 + C | Phủ định: V + 不 + C',
    meaningEffect: 'Biểu thị trong điều kiện chủ quan hoặc khách quan có đủ khả năng để đạt được kết quả nào đó hay không.',
    commonPairs: [
      '听得懂 / 听不懂 (nghe hiểu được / không hiểu)',
      '看得清 / 看不清 (nhìn rõ được / không rõ)',
      '做得到 / 做不到 (làm được / không làm được)',
      '买得起 / 买不起 (đủ tiền mua / không mua nổi)',
      '吃得下 / 吃不下 (ăn nổi / nuốt không trôi)',
      '走得了 / 走不了 (đi được / không đi được)',
    ],
    goldenRule: 'Thường dùng dạng phủ định (V + 不 + C) nhiều hơn dạng khẳng định trong đời sống hàng ngày.',
    examples: [
      {
        chinese: '黑板上的字太小，我看不清。',
        pinyin: 'Hēibǎn shàng de zì tài xiǎo, wǒ kàn bu qīng.',
        meaning: 'Chữ trên bảng đen nhỏ quá, tôi nhìn không rõ.',
        highlightWord: '看不清',
      },
      {
        chinese: '这家饭馆的菜太贵了，我们买不起。',
        pinyin: 'Zhè jiā fànguǎn de cài tài guì le, wǒmen mǎi bu qǐ.',
        meaning: 'Đồ ăn quán này đắt quá, chúng tôi không đủ tiền mua nổi.',
        highlightWord: '买不起',
      },
      {
        chinese: '今天的作业太多了，我一个人做不完。',
        pinyin: 'Jīntiān de zuòyè tài duō le, wǒ yí gè rén zuò bu wán.',
        meaning: 'Bài tập hôm nay nhiều quá, một mình tôi làm không thể hết.',
        highlightWord: '做不完',
      },
    ],
    commonMistake: {
      wrong: '我不能听得懂。',
      right: '我听不懂。',
      explanation: 'Không dùng "不能" trước cụm bổ ngữ khả năng "听得懂".',
    },
  },

  // 4. State & Degree Complements (Bổ ngữ Trạng thái & Mức độ)
  {
    id: 'cp-10',
    name: 'Bổ ngữ Trạng thái với 得 (V + 得 + Miêu tả)',
    hanzi: '跑得快 / 说得好',
    pinyin: 'pǎo de kuài / shuō de hǎo',
    category: 'state_degree',
    categoryName: 'Bổ ngữ Trạng thái',
    formula: 'Động từ + 得 + Tính từ / Cụm miêu tả',
    meaningEffect: 'Đánh giá, nhận xét, miêu tả mức độ hoặc trạng thái kết quả của một hành động đã diễn ra thường xuyên hoặc vừa diễn ra.',
    commonPairs: ['跑得快 (chạy rất nhanh)', '说得流利 (nói trôi chảy)', '起得早 (thức dậy sớm)', '考得好 (thi rất tốt)', '写得漂亮 (viết chữ đẹp)'],
    goldenRule: 'Nếu có tân ngữ: Lặp động từ [V + O + V + 得 + Adj] HOẶC đưa tân ngữ lên trước [O + V + 得 + Adj]. Phủ định đặt trước tính từ: 跑得不快.',
    examples: [
      {
        chinese: '他汉字写得非常漂亮。',
        pinyin: 'Tā hànzì xiě de fēicháng piàoliang.',
        meaning: 'Chữ Hán cậu ấy viết cực kỳ đẹp.',
        highlightWord: '写得非常漂亮',
      },
      {
        chinese: '为了赶早班车，他今天起得很早。',
        pinyin: 'Wèile gǎn zǎobānchē, tā jīntiān qǐ de hěn zǎo.',
        meaning: 'Để kịp chuyến xe buýt sớm, hôm nay anh ấy thức dậy từ rất sớm.',
        highlightWord: '起得很早',
      },
    ],
    commonMistake: {
      wrong: '他打羽毛球得很好。',
      right: '他打羽毛球打得很好。',
      explanation: 'Phải lặp lại động từ "打" trước "得": 打羽毛球打得很好.',
    },
  },
];

export const COMPLEMENT_QUIZ_LIST: ComplementQuizItem[] = [
  {
    id: 'cq-1',
    question: 'Chọn câu phủ định ĐÚNG của câu "我听懂了老师的话":',
    sentence: 'Phủ định câu "Tôi đã nghe hiểu lời thầy giáo":',
    pinyin: 'Xuǎn chū zhèngquè de fǒudìng jù:',
    meaning: 'Tôi chưa nghe hiểu lời thầy giáo.',
    options: [
      '我不听懂老师的话。',
      '我没听懂老师的话。',
      '我听不老师的话懂。',
      '我没听懂了老师的话。',
    ],
    correctIndex: 1,
    explanation: 'Phủ định bổ ngữ kết quả dùng "没/没有" và bỏ "了" -> "我没听懂老师的话".',
    ruleTested: 'Phủ định bổ ngữ kết quả dùng 没',
  },
  {
    id: 'cq-2',
    question: 'Chọn câu ĐÚNG NHẤT về vị trí tân ngữ chỉ nơi chốn trong bổ ngữ xu hướng:',
    sentence: 'Điền vào chỗ trống: "Trời sắp mưa rồi, chúng ta mau về nhà đi!"',
    pinyin: 'Kuài xià yǔ le, wǒmen kuài ___ ba.',
    meaning: 'Chúng ta mau về nhà đi!',
    options: ['回去家', '回家去', '回去在家里', '去回在家'],
    correctIndex: 1,
    explanation: 'Quy tắc vàng: Tân ngữ nơi chốn (家) bắt buộc đứng trước "去" -> "回家去". Cấm nói "回去家".',
    ruleTested: 'Tân ngữ nơi chốn đứng trước 来/去',
  },
  {
    id: 'cq-3',
    question: 'Điền bổ ngữ kết quả: "Mẹ đã nấu cơm tối tươm tất, sẵn sàng ăn rồi."',
    sentence: '妈妈把晚饭做___了，大家快来吃吧。',
    pinyin: 'Māma bǎ wǎnfàn zuò ___ le, dàjiā kuài lái chī ba.',
    meaning: 'Mẹ đã nấu xong cơm tối tươm tất rồi.',
    options: ['好', '懂', '见', '开'],
    correctIndex: 0,
    explanation: '"做好" biểu thị làm xong xuôi, chu đáo, hoàn thiện sẵn sàng cho bước tiếp theo.',
    ruleTested: 'Bổ ngữ kết quả 好',
  },
  {
    id: 'cq-4',
    question: 'Chọn dạng phủ định khả năng chuẩn của "Nghe không hiểu":',
    sentence: '中国朋友说得太快了，我___。',
    pinyin: 'Zhōngguó péngyou shuō de tài kuài le, wǒ ___.',
    meaning: 'Bạn người Trung nói nhanh quá, tôi không hiểu được.',
    options: ['不能听得懂', '不听懂', '听不懂', '听没懂'],
    correctIndex: 2,
    explanation: 'Bổ ngữ khả năng phủ định theo công thức V + 不 + C -> "听不懂".',
    ruleTested: 'Phủ định bổ ngữ khả năng V+不+C',
  },
  {
    id: 'cq-5',
    question: 'Chọn câu ĐÚNG NHẤT miêu tả khả năng nói tiếng Trung trôi chảy:',
    sentence: 'Chọn câu viết đúng ngữ pháp bổ ngữ trạng thái:',
    pinyin: 'Xuǎn chū yǔfǎ zhèngquè de jùzi:',
    meaning: 'Anh ấy nói tiếng Trung rất lưu loát.',
    options: [
      '他说汉语得很流利。',
      '他说得汉语很流利。',
      '他说汉语说得很流利。',
      '汉语他说很得流利。',
    ],
    correctIndex: 2,
    explanation: 'Khi động từ mang tân ngữ (汉语), phải lặp lại động từ trước "得" -> "他说汉语说得很流利".',
    ruleTested: 'Động từ mang tân ngữ trong bổ ngữ trạng thái',
  },
  {
    id: 'cq-6',
    question: 'Điền bổ ngữ kết quả: "Cuốn sách này hay quá, tôi đã đọc ___ rồi."',
    sentence: '这本小说太精彩了，我已经看___了。',
    pinyin: 'Zhè běn xiǎoshuō tài jīngcǎi le, wǒ yǐjīng kàn ___ le.',
    meaning: 'Cuốn tiểu thuyết này hay quá, tôi đã xem xong rồi.',
    options: ['完', '懂', '见', '给'],
    correctIndex: 0,
    explanation: '"看完" biểu thị đọc xong toàn bộ cuốn sách từ đầu đến cuối.',
    ruleTested: 'Bổ ngữ kết quả 完',
  },
  {
    id: 'cq-7',
    question: 'Điền bổ ngữ kết quả: "Tìm suốt cả buổi sáng, cuối cùng tôi cũng tìm ___ chìa khóa."',
    sentence: '找了整整一个上午，我终于找___钥匙了。',
    pinyin: 'Zhǎo le zhěngzhěng yí gè shàngwǔ, wǒ zhōngyú zhǎo ___ yàoshi le.',
    meaning: 'Tôi cuối cùng cũng tìm được chìa khóa rồi.',
    options: ['好', '到', '完', '对'],
    correctIndex: 1,
    explanation: '"找到" biểu thị hành động tìm kiếm đã đạt được mục đích và kết quả mong muốn.',
    ruleTested: 'Bổ ngữ kết quả 到',
  },
  {
    id: 'cq-8',
    question: 'Chọn câu ĐÚNG khi nói về việc bước vào phòng học (người nói đang ở TRONG phòng học):',
    sentence: 'Người nói đang ngồi trong lớp, gọi bạn ở ngoài vào:',
    pinyin: 'Qǐng nǐ jìnlái:',
    meaning: 'Mời bạn vào trong lớp học.',
    options: [
      '请你进去教室。',
      '请你进教室去。',
      '请你进教室来。',
      '请你进来教室。',
    ],
    correctIndex: 2,
    explanation: 'Người nói ở trong phòng thì hướng lại gần -> dùng "来". Tân ngữ nơi chốn đứng trước -> "进教室来".',
    ruleTested: 'Bổ ngữ xu hướng 来 vs 去',
  },
  {
    id: 'cq-9',
    question: 'Điền từ: "Giá vé máy bay đắt quá, tôi không ___ (không đủ tiền mua nổi)."',
    sentence: '飞机票太贵了，我买___。',
    pinyin: 'Fēijīpiào tài guì le, wǒ mǎi ___.',
    meaning: 'Vé máy bay đắt quá, tôi không đủ tiền mua nổi.',
    options: ['不起', '不到', '不完', '不对'],
    correctIndex: 0,
    explanation: '"买不起" là cụm bổ ngữ khả năng kinh điển chỉ việc không đủ điều kiện tài chính để chi trả.',
    ruleTested: 'Bổ ngữ khả năng 买不起',
  },
  {
    id: 'cq-10',
    question: 'Nhận xét nào sau đây là SAI về ngữ pháp bổ ngữ?',
    sentence: 'Tìm nhận xét SAI trong 4 câu sau:',
    pinyin: 'Qǐng xuǎn chū cuòwù de shuōfǎ:',
    meaning: 'Nhận xét sai về bổ ngữ.',
    options: [
      'Phủ định của bổ ngữ kết quả phải dùng "没", không được dùng "不".',
      'Tân ngữ chỉ nơi chốn phải đứng trước "来/去".',
      'Phủ định bổ ngữ trạng thái đặt "不" trước chữ "得" (ví dụ: 他跑不得快).',
      'Bổ ngữ khả năng dạng phủ định dùng "V + 不 + C" (ví dụ: 看不见).',
    ],
    correctIndex: 2,
    explanation: 'Nhận xét C sai! Phủ định bổ ngữ trạng thái phải đặt "不" sau chữ "得" và trước tính từ: "跑得不快", không được nói "跑不得快" (đây là bổ ngữ khả năng).',
    ruleTested: 'Vị trí phủ định bổ ngữ trạng thái',
  },
];
