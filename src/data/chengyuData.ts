export interface ChengyuCharBreakdown {
  char: string;
  pinyin: string;
  meaning: string;
}

export interface ChengyuItem {
  id: string;
  hanzi: string; // 4 chữ Hán
  pinyin: string;
  hanviet: string; // Âm Hán Việt
  literalMeaning: string; // Nghĩa đen
  figurativeMeaning: string; // Nghĩa bóng / Ứng dụng
  category: 'fables_origins' | 'diligence_study' | 'wisdom_life' | 'emotion_relationships';
  categoryLabel: string;
  storyOrigin: string; // Điển tích / Câu chuyện nguồn gốc
  moralLesson?: string; // Bài học nhân sinh
  exampleSentence: {
    hanzi: string;
    pinyin: string;
    vietnamese: string;
  };
  missingCharQuiz: {
    missingIndex: number; // 0, 1, 2, or 3
    correctChar: string;
    options: string[]; // 4 options
  };
}

export const CHENGYU_LIST: ChengyuItem[] = [
  {
    id: 'ma_dao_cheng_gong',
    hanzi: '马到成功',
    pinyin: 'mǎ dào chéng gōng',
    hanviet: 'MÃ ĐÁO THÀNH CÔNG',
    literalMeaning: 'Ngựa vừa phi tới nơi là đã lập nên chiến công',
    figurativeMeaning: 'Vừa ra quân là thắng lợi, vạn sự hanh thông thuận lợi ngay từ bước đầu',
    category: 'wisdom_life',
    categoryLabel: 'Trí tuệ & Cuộc sống',
    storyOrigin: 'Thời chiến quốc, chiến mã là phương tiện hành quân quyết định tốc độ trận chiến. Vị tướng tài cưỡi tuấn mã xông pha tới đâu là quân địch tan tác tới đó, ngựa vừa dừng vó là báo tin thắng trận.',
    moralLesson: 'Lời chúc tụng may mắn, khởi đầu suôn sẻ và gặt hái kết quả rực rỡ nhất trong kinh doanh, thi cử.',
    exampleSentence: {
      hanzi: '祝你这次考试马到成功！',
      pinyin: 'Zhù nǐ zhè cì kǎoshì mǎ dào chéng gōng!',
      vietnamese: 'Chúc bạn kỳ thi lần này mã đáo thành công!'
    },
    missingCharQuiz: {
      missingIndex: 2,
      correctChar: '成',
      options: ['成', '城', '乘', '程']
    }
  },
  {
    id: 'yi_xin_yi_yi',
    hanzi: '一心一意',
    pinyin: 'yì xīn yí yì',
    hanviet: 'NHẤT TÂM NHẤT Ý',
    literalMeaning: 'Một lòng một dạ',
    figurativeMeaning: 'Toàn tâm toàn ý, tập trung tuyệt đối vào một mục tiêu duy nhất không xao nhãng',
    category: 'diligence_study',
    categoryLabel: 'Học tập & Sự kiên trì',
    storyOrigin: 'Mạnh Tử kể chuyện Dịch Thu dạy hai người đánh cờ. Một người nhất tâm nhất ý lắng nghe thầy chỉ bảo; người kia tuy ngồi đó nhưng lòng dạ mơ mộng bắn chim thiên nga, rốt cuộc thua cuộc thảm hại.',
    moralLesson: 'Muốn tinh thông bất kỳ kỹ năng hay ngôn ngữ nào, sự tập trung cao độ là chìa khóa duy nhất.',
    exampleSentence: {
      hanzi: '学习汉语需要一心一意。',
      pinyin: 'Xuéxí Hànyǔ xūyào yì xīn yí yì.',
      vietnamese: 'Học tiếng Trung cần phải toàn tâm toàn ý.'
    },
    missingCharQuiz: {
      missingIndex: 0,
      correctChar: '一',
      options: ['一', '专', '全', '同']
    }
  },
  {
    id: 'ban_tu_er_fei',
    hanzi: '半途而废',
    pinyin: 'bàn tú ér fèi',
    hanviet: 'BÁN ĐỒ NHI PHẾ',
    literalMeaning: 'Đi đến nửa đường rồi vứt bỏ',
    figurativeMeaning: 'Bỏ dở giữa chừng, thiếu kiên nhẫn và quyết tâm đi đến đích cuối cùng',
    category: 'diligence_study',
    categoryLabel: 'Học tập & Sự kiên trì',
    storyOrigin: 'Nhạc Dương Tử đi xa tầm sư học đạo. Được một năm nhớ nhà bèn quay về. Người vợ cầm kéo đến bên khung cửi đang dệt tấm vải dở và nói: "Chàng bỏ học giữa chừng cũng như thiếp cắt đứt tấm vải này, công sức đổ sông đổ biển". Chàng hổ thẹn quay lại học tiếp 7 năm thành tài.',
    moralLesson: 'Vạn sự khởi đầu nan, kiên trì đến cùng mới thấy được trái ngọt.',
    exampleSentence: {
      hanzi: '做事情绝不能半途而废。',
      pinyin: 'Zuò shìqing jué bù néng bàn tú ér fèi.',
      vietnamese: 'Làm việc gì cũng tuyệt đối không được bỏ dở giữa chừng.'
    },
    missingCharQuiz: {
      missingIndex: 3,
      correctChar: '废',
      options: ['废', '退', '休', '止']
    }
  },
  {
    id: 'ru_xiang_sui_su',
    hanzi: '入乡随俗',
    pinyin: 'rù xiāng suí sú',
    hanviet: 'NHẬP GIA TÙY TỤC',
    literalMeaning: 'Bước vào làng quê nào thì thuận theo phong tục làng đó',
    figurativeMeaning: 'Đến bất kỳ nơi nào hay môi trường mới phải biết thích nghi, tôn trọng văn hóa bản địa',
    category: 'wisdom_life',
    categoryLabel: 'Trí tuệ & Cuộc sống',
    storyOrigin: 'Trang Tử ghi chép: Khổng Tử khi đến nước Sở thấy phong tục khác lạ, ngài không những không chê bai mà còn căn dặn học trò phải cư xử hòa nhã, tôn trọng lễ nghi của người nước Sở.',
    moralLesson: 'Sự hòa nhập và tôn trọng sự khác biệt văn hóa là phẩm chất của người thông tuệ.',
    exampleSentence: {
      hanzi: '到了中国就要入乡随俗。',
      pinyin: 'Dàole Zhōngguó jiù yào rù xiāng suí sú.',
      vietnamese: 'Đến Trung Quốc thì phải nhập gia tùy tục.'
    },
    missingCharQuiz: {
      missingIndex: 2,
      correctChar: '随',
      options: ['随', '学', '知', '听']
    }
  },
  {
    id: 'jing_di_zhi_wa',
    hanzi: '井底之蛙',
    pinyin: 'jǐng dǐ zhī wā',
    hanviet: 'TỈNH ĐỂ CHI OA (Ếch ngồi đáy giếng)',
    literalMeaning: 'Con ếch sống dưới đáy giếng cạn',
    figurativeMeaning: 'Kẻ nông cạn, thiển cận, tầm nhìn hạn hẹp nhưng lại tự phụ coi bầu trời chỉ bằng miệng giếng',
    category: 'fables_origins',
    categoryLabel: 'Ngụ ngôn & Điển cố',
    storyOrigin: 'Trong Nam Hoa Kinh của Trang Tử, một con ếch sống dưới đáy giếng khoe khoang với rùa biển Đông rằng đáy giếng của nó là vương quốc tuyệt vời nhất. Khi rùa biển kể về biển cả mênh mông ngàn dặm, ếch sững sờ xấu hổ.',
    moralLesson: 'Thế giới bao la rộng lớn, luôn giữ tâm thế khiêm tốn mở mang tri thức.',
    exampleSentence: {
      hanzi: '我们不能做井底之蛙。',
      pinyin: 'Wǒmen bù néng zuò jǐng dǐ zhī wā.',
      vietnamese: 'Chúng ta không thể làm con ếch ngồi đáy giếng.'
    },
    missingCharQuiz: {
      missingIndex: 3,
      correctChar: '蛙',
      options: ['蛙', '鸟', '鱼', '虫']
    }
  },
  {
    id: 'shou_zhu_dai_tu',
    hanzi: '守株待兔',
    pinyin: 'shǒu zhū dài tù',
    hanviet: 'THỦ CHU ĐÃI THỎ (Ôm cây đợi thỏ)',
    literalMeaning: 'Ôm khư khư gốc cây chờ đợi thỏ chạy lại đâm đầu vào',
    figurativeMeaning: 'Trông chờ vào may mắn ngẫu nhiên, lười biếng không chịu lao động hoặc rập khuôn bảo thủ',
    category: 'fables_origins',
    categoryLabel: 'Ngụ ngôn & Điển cố',
    storyOrigin: 'Hàn Phi Tử kể: Có một nông phu nước Tống đang cày ruộng thì thấy một con thỏ hoảng loạn chạy đâm sầm vào gốc cây gãy cổ chết. Người này mừng rỡ nhặt thỏ về ăn rồi vứt cày, ngày ngày ngồi ôm gốc cây đợi thỏ khác tới, rốt cuộc ruộng đồng cỏ dại mọc đầy, trở thành trò cười cho thiên hạ.',
    moralLesson: 'May mắn không lặp lại hai lần, chỉ có lao động chân chính mới tạo ra giá trị bền vững.',
    exampleSentence: {
      hanzi: '要想成功，绝不能守株待兔。',
      pinyin: 'Yào xiǎng chénggōng, jué bù néng shǒu zhū dài tù.',
      vietnamese: 'Muốn thành công thì tuyệt đối không được ôm cây đợi thỏ.'
    },
    missingCharQuiz: {
      missingIndex: 1,
      correctChar: '株',
      options: ['株', '树', '木', '林']
    }
  },
  {
    id: 'hua_she_tian_zu',
    hanzi: '画蛇添足',
    pinyin: 'huà shé tiān zú',
    hanviet: 'HỌA XÀ THIÊM TÚC (Vẽ rắn thêm chân)',
    literalMeaning: 'Vẽ xong con rắn lại rảnh rỗi vẽ thêm chân cho nó',
    figurativeMeaning: 'Làm những việc thừa thãi vô ích, chẳng những không giúp ích gì mà còn làm hỏng việc',
    category: 'fables_origins',
    categoryLabel: 'Ngụ ngôn & Điển cố',
    storyOrigin: 'Chiến Quốc Sách ghi: Mấy người giữ miếu được ban một bình rượu quý, bèn thi nhau vẽ rắn xuống đất, ai vẽ xong trước được uống. Một người vẽ xong sớm nhất, thấy người khác chưa xong bèn đắc chí lấy que vẽ thêm chân cho rắn. Người thứ hai vẽ xong giật bình rượu uống và bảo: "Rắn làm gì có chân mà vẽ!", người kia mất trắng bình rượu.',
    moralLesson: 'Đủ là đẹp, biết điểm dừng và tập trung vào bản chất công việc.',
    exampleSentence: {
      hanzi: '你的解释简直是画蛇添足。',
      pinyin: 'Nǐ de jiěshì jiǎnzhí shì huà shé tiān zú.',
      vietnamese: 'Lời giải thích của bạn đúng là vẽ rắn thêm chân.'
    },
    missingCharQuiz: {
      missingIndex: 3,
      correctChar: '足',
      options: ['足', '手', '头', '尾']
    }
  },
  {
    id: 'ba_miao_zhu_zhang',
    hanzi: '拔苗助长',
    pinyin: 'bá miáo zhù zhǎng',
    hanviet: 'BẠT MIÊU TRỢ TRƯỞNG (Kéo mạ giúp lớn)',
    literalMeaning: 'Kéo cây mạ non lên để giúp nó nhanh cao lớn',
    figurativeMeaning: 'Nôn nóng đốt cháy giai đoạn, làm trái quy luật tự nhiên dẫn đến thất bại thảm hại',
    category: 'fables_origins',
    categoryLabel: 'Ngụ ngôn & Điển cố',
    storyOrigin: 'Mạnh Tử kể: Một người nông dân nước Tống sốt ruột vì thấy ruộng lúa mọc quá chậm, bèn ra đồng nhấc từng cây mạ lên một chút. Về nhà hí hửng khoe cả nhà là mình vừa giúp mạ lớn nhanh. Hôm sau con trai chạy ra đồng thì toàn bộ ruộng mạ đã héo úa chết khô.',
    moralLesson: 'Mọi sự việc đều cần thời gian tích lũy đủ lượng mới đổi chất, dục tốc bất đạt.',
    exampleSentence: {
      hanzi: '教育孩子不能拔苗助长。',
      pinyin: 'Jiàoyù háizi bù néng bá miáo zhù zhǎng.',
      vietnamese: 'Giáo dục con cái không thể đốt cháy giai đoạn (kéo mạ giúp lớn).'
    },
    missingCharQuiz: {
      missingIndex: 0,
      correctChar: '拔',
      options: ['拔', '抓', '拉', '扶']
    }
  },
  {
    id: 'dui_niu_tan_qin',
    hanzi: '对牛弹琴',
    pinyin: 'duì niú tán qín',
    hanviet: 'ĐỐI NGƯU ĐÀN CẦM (Đàn gảy tai trâu)',
    literalMeaning: 'Đem đàn cổ tranh ra gảy trước mặt con trâu',
    figurativeMeaning: 'Nói đạo lý cao siêu hay lời hay với người không đủ trình độ thấu hiểu, uổng công vô ích',
    category: 'wisdom_life',
    categoryLabel: 'Trí tuệ & Cuộc sống',
    storyOrigin: 'Nhạc sĩ nổi tiếng Công Minh Nghi gảy khúc nhạc thanh tao nhất trước mặt con trâu đang gặm cỏ, trâu vẫn cắm cúi ăn không thèm ngẩng đầu. Sau đó ông gảy tiếng vo ve của ruồi muỗi và tiếng bê con khóc, trâu liền vẫy đuôi nghểnh tai lắng nghe.',
    moralLesson: 'Giao tiếp thông minh là phải biết đối tượng lắng nghe là ai để chọn ngôn từ phù hợp.',
    exampleSentence: {
      hanzi: '跟不懂道理的人说话简直是对牛弹琴。',
      pinyin: 'Gēn bù dǒng dàolǐ de rén shuōhuà jiǎnzhí shì duì niú tán qín.',
      vietnamese: 'Nói chuyện với kẻ không hiểu đạo lý chẳng khác nào đàn gảy tai trâu.'
    },
    missingCharQuiz: {
      missingIndex: 1,
      correctChar: '牛',
      options: ['牛', '马', '羊', '猪']
    }
  },
  {
    id: 'yan_er_dao_ling',
    hanzi: '掩耳盗铃',
    pinyin: 'yǎn ěr dào líng',
    hanviet: 'YỂM NHĨ ĐẠO LINH (Bịt tai trộm chuông)',
    literalMeaning: 'Bịt chặt tai mình lại rồi đi trộm quả chuông đồng',
    figurativeMeaning: 'Tự lừa dối bản thân, ngây thơ nghĩ rằng mình không thấy không nghe thì người khác cũng không biết',
    category: 'fables_origins',
    categoryLabel: 'Ngụ ngôn & Điển cố',
    storyOrigin: 'Lã Thị Xuân Thu chép: Kẻ trộm muốn lấy quả chuông đồng to trước cửa nhà họ Phạm, nhưng chuông nặng không vác được bèn lấy búa đập vỡ. Tiếng chuông vang lên inh ỏi sợ người khác nghe thấy, hắn liền lấy hai tay bịt chặt tai mình lại, tưởng tai mình không nghe thấy thì thiên hạ cũng điếc hết.',
    moralLesson: 'Sự thật khách quan luôn tồn tại, né tránh hay lừa mình dối người chỉ chuốc lấy tai họa.',
    exampleSentence: {
      hanzi: '你这样做完全是掩耳盗铃。',
      pinyin: 'Nǐ zhèyàng zuò wánquán shì yǎn ěr dào líng.',
      vietnamese: 'Bạn làm như vậy hoàn toàn là tự lừa dối mình (bịt tai trộm chuông).'
    },
    missingCharQuiz: {
      missingIndex: 0,
      correctChar: '掩',
      options: ['掩', '捂', '闭', '塞']
    }
  },
  {
    id: 'hu_jia_hu_wei',
    hanzi: '狐假虎威',
    pinyin: 'hú jiǎ hǔ wēi',
    hanviet: 'HỒ GIẢ HỔ UY (Cáo mượn oai hùm)',
    literalMeaning: 'Con cáo mượn uy quyền của con hổ',
    figurativeMeaning: 'Kẻ yếu kém mượn thế lực, quyền thế của người khác để thị uy, dọa nạt ức hiếp xung quanh',
    category: 'fables_origins',
    categoryLabel: 'Ngụ ngôn & Điển cố',
    storyOrigin: 'Chiến Quốc Sách: Hổ bắt được cáo định ăn thịt. Cáo lừa hổ: "Ta được Trời phái xuống làm chúa muôn loài, ngươi ăn thịt ta là trái mệnh Trời. Không tin ngươi cứ đi sau lưng ta xem muôn thú có sợ ta không!". Hổ đi theo sau, muôn thú nhìn thấy hổ thì bỏ chạy tán loạn, hổ tưởng muôn thú sợ cáo thật bèn thả cáo đi.',
    moralLesson: 'Nhận diện kẻ cơ hội lợi dụng bóng lớn của người khác để lộng hành.',
    exampleSentence: {
      hanzi: '他不过是狐假虎威罢了。',
      pinyin: 'Tā búguò shì hú jiǎ hǔ wēi bàle.',
      vietnamese: 'Anh ta chẳng qua chỉ là cáo mượn oai hùm mà thôi.'
    },
    missingCharQuiz: {
      missingIndex: 2,
      correctChar: '虎',
      options: ['虎', '龙', '狮', '狼']
    }
  },
  {
    id: 'mang_ren_mo_xiang',
    hanzi: '盲人摸象',
    pinyin: 'máng rén mō xiàng',
    hanviet: 'MANH NHÂN MẠC TƯỢNG (Thầy bói xem voi)',
    literalMeaning: 'Người mù đi sờ con voi',
    figurativeMeaning: 'Đánh giá phiến diện một khía cạnh nhỏ rồi vội vàng quy kết toàn bộ bản chất sự vật',
    category: 'fables_origins',
    categoryLabel: 'Ngụ ngôn & Điển cố',
    storyOrigin: 'Chuyện Phật giáo: Vua cho mấy người mù sờ một con voi lớn. Người sờ vòi bảo voi như con đỉa; người sờ ngà bảo voi như cây cọc nhọn; người sờ tai bảo voi như cái quạt; người sờ chân bảo voi như cột đình; người sờ đuôi bảo voi như cái chổi xể. Mọi người cãi nhau kịch liệt ai cũng cho mình đúng.',
    moralLesson: 'Cần có góc nhìn đa chiều, toàn cảnh trước khi đưa ra nhận định hoặc phán xét.',
    exampleSentence: {
      hanzi: '看问题切忌盲人摸象。',
      pinyin: 'Kàn wèntí qièjì máng rén mō xiàng.',
      vietnamese: 'Xem xét vấn đề kiêng kị nhất là nhìn nhận phiến diện (thầy bói xem voi).'
    },
    missingCharQuiz: {
      missingIndex: 3,
      correctChar: '象',
      options: ['象', '牛', '马', '狗']
    }
  },
  {
    id: 'shu_neng_sheng_qiao',
    hanzi: '熟能生巧',
    pinyin: 'shú néng shēng qiǎo',
    hanviet: 'THỤC NĂNG SINH XẢO (Trăm hay không bằng tay quen)',
    literalMeaning: 'Làm thuần thục thì sẽ nảy sinh sự khéo léo tài tình',
    figurativeMeaning: 'Rèn luyện chăm chỉ và lặp đi lặp lại thường xuyên sẽ biến kỹ năng trở nên điêu luyện',
    category: 'diligence_study',
    categoryLabel: 'Học tập & Sự kiên trì',
    storyOrigin: 'Thời Tống, Trần Nghiêu Tư bắn cung bách phát bách trúng đắc chí vô cùng. Một ông lão bán dầu đứng xem chỉ mỉm cười. Ông lão đặt một đồng xu có lỗ tròn lên miệng bình dầu, rồi cầm muôi múc dầu rót từ trên cao xuống, dòng dầu chảy lọt qua lỗ đồng xu mà không dính một giọt nào vào mép. Ông bảo: "Ta chẳng có tài gì lạ, chỉ do tay quen mà thôi".',
    moralLesson: 'Không có thiên tài bẩm sinh, chỉ có sự rèn luyện kiên trì qua năm tháng.',
    exampleSentence: {
      hanzi: '多练习，自然熟能生巧。',
      pinyin: 'Duō liànxí, zìrán shú néng shēng qiǎo.',
      vietnamese: 'Luyện tập nhiều, tự nhiên trăm hay không bằng tay quen.'
    },
    missingCharQuiz: {
      missingIndex: 3,
      correctChar: '巧',
      options: ['巧', '精', '快', '美']
    }
  },
  {
    id: 'yin_shui_si_yuan',
    hanzi: '饮水思源',
    pinyin: 'yǐn shuǐ sī yuán',
    hanviet: 'ẨM THỦY TƯ NGUYÊN (Uống nước nhớ nguồn)',
    literalMeaning: 'Uống dòng nước mát thì phải nghĩ tới ngọn nguồn con suối',
    figurativeMeaning: 'Luôn khắc ghi lòng biết ơn đối với cội nguồn và những người đã giúp đỡ, nuôi dưỡng mình',
    category: 'emotion_relationships',
    categoryLabel: 'Tình cảm & Lối sống',
    storyOrigin: 'Nhà thơ Dữu Tín thời Nam Bắc Triều bị giam giữ ở phương Bắc luôn nhớ về quê hương phương Nam, ông viết bài phú "Trưng Điều Khúc": "Lạc thực giả tư kỳ thụ, ẩm kỳ lưu giả hoài kỳ nguyên" (Ăn trái nhớ kẻ trồng cây, uống nước dòng suối nhớ về đầu nguồn).',
    moralLesson: 'Lòng biết ơn là đạo lý làm người nền tảng nhất trong văn hóa Á Đông.',
    exampleSentence: {
      hanzi: '我们获得成功，要饮水思源。',
      pinyin: 'Wǒmen huòdé chénggōng, yào yǐn shuǐ sī yuán.',
      vietnamese: 'Chúng ta gặt hái thành công thì phải biết uống nước nhớ nguồn.'
    },
    missingCharQuiz: {
      missingIndex: 2,
      correctChar: '思',
      options: ['思', '想', '知', '忘']
    }
  },
  {
    id: 'sai_weng_shi_ma',
    hanzi: '塞翁失马',
    pinyin: 'sài wēng shī mǎ',
    hanviet: 'TÁI ÔNG THẤT MÃ (Trong họa có phúc)',
    literalMeaning: 'Ông lão ở biên ải bị mất ngựa',
    figurativeMeaning: 'Họa phúc ở đời khôn lường biến chuyển, gặp chuyện không may chưa chắc là họa, gặp chuyện vui chưa hẳn là phúc',
    category: 'wisdom_life',
    categoryLabel: 'Trí tuệ & Cuộc sống',
    storyOrigin: 'Hoài Nam Tử: Ông lão ở biên ải mất ngựa quý, láng giềng đến chia buồn, ông bảo: "Biết đâu lại là phúc". Vài tháng sau con ngựa dắt về một đàn tuấn mã. Láng giềng chúc mừng, ông bảo: "Biết đâu lại là họa". Con trai ông mê cưỡi ngựa bị ngã gãy chân tàn tật. Láng giềng thương xót, ông bảo: "Biết đâu là phúc". Năm sau giặc xâm lược, thanh niên trai tráng bị bắt lính chết sạch, riêng con trai ông được ở nhà phụng dưỡng cha già.',
    moralLesson: 'Giữ tâm thái an nhiên, lạc quan trước mọi thăng trầm đổi thay của cuộc sống.',
    exampleSentence: {
      hanzi: '塞翁失马，焉知非福。',
      pinyin: 'Sài wēng shī mǎ, yān zhī fēi fú.',
      vietnamese: 'Tái ông mất ngựa, biết đâu lại là phúc.'
    },
    missingCharQuiz: {
      missingIndex: 2,
      correctChar: '失',
      options: ['失', '得', '买', '卖']
    }
  },
  {
    id: 'zhang_shang_ming_zhu',
    hanzi: '掌上明珠',
    pinyin: 'zhǎng shàng míng zhū',
    hanviet: 'CHƯỞNG THƯỢNG MINH CHÂU',
    literalMeaning: 'Hạt ngọc sáng nằm nâng niu trong lòng bàn tay',
    figurativeMeaning: 'Người con gái cưng, bảo bối được cha mẹ hết mực yêu thương, chở che quý báu',
    category: 'emotion_relationships',
    categoryLabel: 'Tình cảm & Lối sống',
    storyOrigin: 'Nhà thơ Phó Huyền thời Tây Tấn viết trong bài thơ ca ngợi tình yêu thương: Ngọc sáng trên tay nâng niu chẳng rời, biểu trưng cho tình cảm vô bờ bến của đấng sinh thành dành cho con gái yêu.',
    moralLesson: 'Hình ảnh ẩn dụ tuyệt mỹ về tình thân ruột thịt.',
    exampleSentence: {
      hanzi: '女儿是父母的掌上明珠。',
      pinyin: 'Nǚ\'ér shì fùmǔ de zhǎng shàng míng zhū.',
      vietnamese: 'Con gái là hạt ngọc trên tay của cha mẹ.'
    },
    missingCharQuiz: {
      missingIndex: 3,
      correctChar: '珠',
      options: ['珠', '玉', '宝', '石']
    }
  },
  {
    id: 'yi_jian_shuang_diao',
    hanzi: '一箭双雕',
    pinyin: 'yí jiàn shuāng diāo',
    hanviet: 'NHẤT TIỄN SONG ĐIÊU',
    literalMeaning: 'Một mũi tên bắn trúng hai con chim điêu (chim ưng lớn)',
    figurativeMeaning: 'Một hành động mà đạt được hai mục đích tốt đẹp cùng lúc (Nhất cử lưỡng tiện)',
    category: 'wisdom_life',
    categoryLabel: 'Trí tuệ & Cuộc sống',
    storyOrigin: 'Bắc Sử ghi: Trưởng Tôn Thịnh là vị tướng thời Tùy có tài bắn cung xuất chúng. Khi sang biên giới xem hai con chim ưng đang tranh giành miếng mồi trên bầu trời, ông giương cung bắn đúng một phát tên, mũi tên xuyên qua cả hai con rơi xuống đất.',
    moralLesson: 'Tối ưu hóa hành động và trí lực để đạt hiệu quả cao nhất.',
    exampleSentence: {
      hanzi: '这个方案真是一箭双雕。',
      pinyin: 'Zhè ge fāng\'àn zhēn shì yí jiàn shuāng diāo.',
      vietnamese: 'Phương án này đúng là một mũi tên trúng hai đích.'
    },
    missingCharQuiz: {
      missingIndex: 2,
      correctChar: '双',
      options: ['双', '两', '二', '多']
    }
  },
  {
    id: 'ku_jin_gan_lai',
    hanzi: '苦尽甘来',
    pinyin: 'kǔ jìn gān lái',
    hanviet: 'KHỔ TẬN CAM LAI',
    literalMeaning: 'Cay đắng qua hết thì vị ngọt ngào thanh khiết sẽ tới',
    figurativeMeaning: 'Vượt qua giai đoạn gian khó, thử thách cam go thì những điều tươi đẹp, hạnh phúc sẽ mỉm cười',
    category: 'wisdom_life',
    categoryLabel: 'Trí tuệ & Cuộc sống',
    storyOrigin: 'Kịch gia Quan Hán Khanh thời Nguyên viết trong vở kịch nổi tiếng: Người kiên cường chịu đựng qua mùa đông lạnh giá thì mùa xuân ấm áp đâm chồi nảy lộc chắc chắn sẽ đến.',
    moralLesson: 'Niềm tin hy vọng và động lực vượt qua nghịch cảnh cuộc đời.',
    exampleSentence: {
      hanzi: '经过多年努力，他们终于苦尽甘来。',
      pinyin: 'Jīngguò duō nián nǔlì, tāmen zhōngyú kǔ jìn gān lái.',
      vietnamese: 'Qua bao năm nỗ lực, cuối cùng họ cũng khổ tận cam lai.'
    },
    missingCharQuiz: {
      missingIndex: 2,
      correctChar: '甘',
      options: ['甘', '甜', '好', '美']
    }
  },
  {
    id: 'zi_xiang_mao_dun',
    hanzi: '自相矛盾',
    pinyin: 'zì xiāng máo dùn',
    hanviet: 'TỰ TƯƠNG MÂU THUẪN',
    literalMeaning: 'Lấy ngọn giáo của mình đâm vào cái khiên của chính mình',
    figurativeMeaning: 'Lời nói và hành động trước sau bất nhất, tự chọi nhau làm lộ ra sự lừa dối',
    category: 'fables_origins',
    categoryLabel: 'Ngụ ngôn & Điển cố',
    storyOrigin: 'Hàn Phi Tử: Người nước Sở bán mâu (giáo) và thuẫn (khiên). Hắn khoe khiên: "Khiên này chắc đến mức không mũi giáo nào đâm thủng!". Lại giơ giáo khoe: "Giáo này sắc bén đến mức đâm thủng bất kỳ tấm khiên nào!". Có người hỏi: "Vậy lấy ngọn giáo của anh đâm vào cái khiên của anh thì sao?", hắn ngượng đỏ mặt không đáp được câu nào.',
    moralLesson: 'Lời nói phải chân thật, nhất quán và có logic thực tiễn.',
    exampleSentence: {
      hanzi: '你说的话前后自相矛盾。',
      pinyin: 'Nǐ shuō de huà qiánhòu zì xiāng máo dùn.',
      vietnamese: 'Lời bạn nói trước sau tự mâu thuẫn lẫn nhau.'
    },
    missingCharQuiz: {
      missingIndex: 3,
      correctChar: '盾',
      options: ['盾', '刀', '剑', '弓']
    }
  },
  {
    id: 'po_fu_chen_zhou',
    hanzi: '破釜沉舟',
    pinyin: 'pò fǔ chén zhōu',
    hanviet: 'PHÁ PHỦ TRẦM CHÂU (Đập nồi dìm thuyền)',
    literalMeaning: 'Đập vỡ hết nồi niêu và dìm chìm thuyền xuống đáy sông',
    figurativeMeaning: 'Quyết tâm đến cùng, cắt đứt mọi đường lui để dồn toàn lực giành lấy chiến thắng',
    category: 'wisdom_life',
    categoryLabel: 'Trí tuệ & Cuộc sống',
    storyOrigin: 'Sử Ký Tư Mã Thiên: Hạng Vũ dẫn quân qua sông đánh nhau với quân Tần trong trận Cự Lộc nổi tiếng. Sang sông xong, Hạng Vũ lệnh cho quân sĩ đập vỡ toàn bộ nồi niêu nấu nướng, dìm chìm hết chiến thuyền, chỉ mang theo lương thực 3 ngày, tỏ rõ ý chí quyết tử không thắng không về. Quân sĩ cảm kích liều chết chiến đấu, đại phá tan quân Tần.',
    moralLesson: 'Khi dồn vào thế không còn đường lui, con người sẽ bộc phát sức mạnh phi thường.',
    exampleSentence: {
      hanzi: '我们要有破釜沉舟的决心。',
      pinyin: 'Wǒmen yào yǒu pò fǔ chén zhōu de juéxīn.',
      vietnamese: 'Chúng ta phải có quyết tâm đập nồi dìm thuyền.'
    },
    missingCharQuiz: {
      missingIndex: 1,
      correctChar: '釜',
      options: ['釜', '锅', '盆', '碗']
    }
  },
  {
    id: 'wang_mei_zhi_ke',
    hanzi: '望梅止渴',
    pinyin: 'wàng méi zhǐ kě',
    hanviet: 'VỌNG MAI CHỈ KHÁT (Trông mơ đỡ khát)',
    literalMeaning: 'Trông ngóng rừng mơ chua để nuốt nước bọt đỡ cơn khát',
    figurativeMeaning: 'Dùng ảo tưởng hoặc hình dung viễn cảnh tươi đẹp để tự trấn an, vượt qua cơn khó khăn trước mắt',
    category: 'wisdom_life',
    categoryLabel: 'Trí tuệ & Cuộc sống',
    storyOrigin: 'Thế Thuyết Tân Ngữ: Tào Tháo dẫn quân đi hành quân giữa mùa hè oi ả, quân sĩ khát cháy cổ không tìm thấy giếng nước nào, nhiều người lả đi. Tào Tháo giơ roi ngựa chỉ về phía trước hô to: "Phía trước có một rừng mơ chua mọng nước!". Quân lính nghe thấy mơ chua liền ứa nước miếng trong miệng, hết khát và có thêm sức đi đến bờ sông.',
    moralLesson: 'Sức mạnh của liệu pháp tâm lý và nghệ thuật lãnh đạo truyền cảm hứng.',
    exampleSentence: {
      hanzi: '光空想只是望梅止渴，必须行动起来。',
      pinyin: 'Guāng kōngxiǎng zhǐshì wàng méi zhǐ kě, bìxū xíngdòng qǐlai.',
      vietnamese: 'Chỉ tưởng tượng suông thì chỉ là trông mơ đỡ khát, phải hành động ngay.'
    },
    missingCharQuiz: {
      missingIndex: 1,
      correctChar: '梅',
      options: ['梅', '桃', '梨', '李']
    }
  },
  {
    id: 'xiong_you_cheng_zhu',
    hanzi: '胸有成竹',
    pinyin: 'xiōng yǒu chéng zhú',
    hanviet: 'HUNG HỮU THÀNH TRÚC (Nắm chắc phần thắng)',
    literalMeaning: 'Trong lồng ngực đã có sẵn bức tranh cây trúc hoàn chỉnh',
    figurativeMeaning: 'Đã có kế hoạch tính toán chu toàn từ trước, tự tin nắm chắc thành công trong tay',
    category: 'wisdom_life',
    categoryLabel: 'Trí tuệ & Cuộc sống',
    storyOrigin: 'Họa sĩ Văn Đồng thời Tống nổi tiếng vẽ tranh tre trúc đẹp nhất thiên hạ. Bạn ông là Tô Thức nhận xét: "Văn Đồng vẽ trúc, trước khi đặt bút vẽ lên giấy thì trong lòng ngực ông đã hình dung rõ nét từng cành lá của cây trúc rồi".',
    moralLesson: 'Chuẩn bị kỹ càng trước khi hành động là bí quyết của mọi chiến thắng.',
    exampleSentence: {
      hanzi: '面对挑战，他显得胸有成竹。',
      pinyin: 'Miànduì tiǎozhàn, tā xiǎnde xiōng yǒu chéng zhú.',
      vietnamese: 'Đối mặt thử thách, anh ấy tỏ ra nắm chắc phần thắng trong tay.'
    },
    missingCharQuiz: {
      missingIndex: 3,
      correctChar: '竹',
      options: ['竹', '花', '草', '木']
    }
  },
  {
    id: 'jian_yi_yong_wei',
    hanzi: '见义勇为',
    pinyin: 'jiàn yì yǒng wéi',
    hanviet: 'KIẾN NGHĨA DŨNG VI',
    literalMeaning: 'Thấy việc nghĩa thì dũng cảm đứng ra làm',
    figurativeMeaning: 'Hành hiệp trượng nghĩa, không sợ hiểm nguy sẵn sàng tương trợ bảo vệ kẻ yếu',
    category: 'emotion_relationships',
    categoryLabel: 'Tình cảm & Lối sống',
    storyOrigin: 'Luận Ngữ của Khổng Tử viết: "Kiến nghĩa bất vi, vô dũng dã" (Thấy việc nghĩa mà không làm thì không phải người có dũng khí).',
    moralLesson: 'Lòng dũng cảm và tinh thần trách nhiệm với cộng đồng xã hội.',
    exampleSentence: {
      hanzi: '他见义勇为救了落水儿童。',
      pinyin: 'Tā jiàn yì yǒng wéi jiùle luòshuǐ értóng.',
      vietnamese: 'Anh ấy dũng cảm làm việc nghĩa cứu em bé bị ngã xuống nước.'
    },
    missingCharQuiz: {
      missingIndex: 2,
      correctChar: '勇',
      options: ['勇', '敢', '力', '气']
    }
  },
  {
    id: 'lan_yu_chong_shu',
    hanzi: '滥竽充数',
    pinyin: 'làn yú chōng shù',
    hanviet: 'LẠM VU SUNG SỐ',
    literalMeaning: 'Không biết thổi sáo vu mà cũng trà trộn vào để đủ quân số',
    figurativeMeaning: 'Kẻ bất tài trà trộn vào tập thể giả vờ tài giỏi hoặc hàng hóa kém chất lượng trà trộn vào',
    category: 'fables_origins',
    categoryLabel: 'Ngụ ngôn & Điển cố',
    storyOrigin: 'Hàn Phi Tử: Tề Tuyên Vương thích nghe ban nhạc 300 người cùng hòa tấu sáo vu. Nam Quách tiên sinh hoàn toàn không biết thổi sáo nhưng xin vào ban nhạc, phùng má giả vờ thổi cũng được lĩnh bổng lộc hậu hĩnh. Đến khi con trai vua là Mẫn Vương lên ngôi, Mẫn Vương lại thích từng người một lên thổi sáo riêng. Nam Quách hoảng sợ vội vàng thu dọn hành lý chuồn mất trong đêm.',
    moralLesson: 'Năng lực thực sự sẽ được phơi bày qua thời gian, sự giả dối không thể tồn tại lâu bền.',
    exampleSentence: {
      hanzi: '做事要真才实学，绝不能滥竽充数。',
      pinyin: 'Zuò shì yào zhēn cái shí xué, jué bù néng làn yú chōng shù.',
      vietnamese: 'Làm việc cần có tài năng thực chất, tuyệt đối không được lạm vu sung số.'
    },
    missingCharQuiz: {
      missingIndex: 1,
      correctChar: '竽',
      options: ['竽', '笛', '琴', '鼓']
    }
  }
];
