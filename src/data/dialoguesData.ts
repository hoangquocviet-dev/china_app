export interface DialogueLine {
  id: string;
  speaker: 'A' | 'B';
  hanzi: string;
  pinyin: string;
  meaning: string;
}

export interface DialogueVocab {
  hanzi: string;
  pinyin: string;
  meaning: string;
}

export interface SituationalDialogue {
  id: string;
  title: string;
  level: 'HSK 1' | 'HSK 2';
  topic: string;
  icon: string;
  description: string;
  characters: {
    nameA: string;
    avatarA: string;
    roleA: string;
    nameB: string;
    avatarB: string;
    roleB: string;
  };
  lines: DialogueLine[];
  keyVocabulary: DialogueVocab[];
}

export const SITUATIONAL_DIALOGUES: SituationalDialogue[] = [
  {
    id: 'greeting_intro',
    title: '1. Chào hỏi & Làm quen lần đầu',
    level: 'HSK 1',
    topic: 'Giao tiếp hàng ngày',
    icon: '👋',
    description: 'Hai bạn sinh viên tình cờ gặp nhau tại thư viện trường đại học và chào hỏi làm quen.',
    characters: {
      nameA: 'Tiểu Minh (小明)',
      avatarA: '👨‍🎓',
      roleA: 'Sinh viên Trung Quốc',
      nameB: 'David (大卫)',
      avatarB: '👱‍♂️',
      roleB: 'Du học sinh',
    },
    lines: [
      { id: 'l1', speaker: 'A', hanzi: '你好！请问你叫什么名字？', pinyin: 'nǐ hǎo ！ qǐng wèn nǐ jiào shén me míng zi ？', meaning: 'Chào bạn! Xin hỏi bạn tên là gì?' },
      { id: 'l2', speaker: 'B', hanzi: '你好！我叫大卫，我是美国留学生。你呢？', pinyin: 'nǐ hǎo ！ wǒ jiào dà wèi ， wǒ shì měi guó liú xué shēng 。 nǐ ne ？', meaning: 'Chào bạn! Mình tên là David, mình là du học sinh Mỹ. Còn bạn?' },
      { id: 'l3', speaker: 'A', hanzi: '我叫李明，我是中国人。很高兴认识你！', pinyin: 'wǒ jiào lǐ míng ， wǒ shì zhōng guó rén 。 hěn gāo xìng rèn shi nǐ ！', meaning: 'Mình tên là Lý Minh, mình là người Trung Quốc. Rất vui được quen biết bạn!' },
      { id: 'l4', speaker: 'B', hanzi: '认识你我也很高兴！你学什么专业？', pinyin: 'rèn shi nǐ wǒ yě hěn gāo xìng ！ nǐ xué shén me zhuān yè ？', meaning: 'Quen biết bạn mình cũng rất vui! Bạn học chuyên ngành gì thế?' },
      { id: 'l5', speaker: 'A', hanzi: '我学计算机。你的汉语真好！', pinyin: 'wǒ xué jì suàn jī 。 nǐ de hàn yǔ zhēn hǎo ！', meaning: 'Mình học máy tính. Tiếng Trung của bạn thật tốt!' },
      { id: 'l6', speaker: 'B', hanzi: '哪里哪里，我才刚学两个月呢。', pinyin: 'nǎ lǐ nǎ lǐ ， wǒ cái gāng xué liǎng gè yuè ne 。', meaning: 'Đâu có đâu, mình mới học được có hai tháng thôi.' },
    ],
    keyVocabulary: [
      { hanzi: '叫', pinyin: 'jiào', meaning: 'Tên là / gọi là' },
      { hanzi: '名字', pinyin: 'míngzi', meaning: 'Tên' },
      { hanzi: '认识', pinyin: 'rènshi', meaning: 'Quen biết' },
      { hanzi: '高兴', pinyin: 'gāoxìng', meaning: 'Vui vẻ' },
      { hanzi: '哪里哪里', pinyin: 'nǎlinǎli', meaning: 'Đâu có (khiêm tốn)' },
    ],
  },
  {
    id: 'time_appointment',
    title: '2. Hỏi giờ & Lên lịch hẹn',
    level: 'HSK 1',
    topic: 'Thời gian & Hẹn hò',
    icon: '⏰',
    description: 'Hỏi giờ giấc hiện tại và hẹn nhau cùng đi thư viện học bài vào buổi chiều.',
    characters: {
      nameA: 'Vương Phương (王芳)',
      avatarA: '👩‍💼',
      roleA: 'Bạn học',
      nameB: 'Trương Vĩ (张伟)',
      avatarB: '👨‍💼',
      roleB: 'Bạn học',
    },
    lines: [
      { id: 'l1', speaker: 'A', hanzi: '请问，现在几点了？', pinyin: 'qǐng wèn ， xiàn zài jǐ diǎn le ？', meaning: 'Xin hỏi, bây giờ là mấy giờ rồi?' },
      { id: 'l2', speaker: 'B', hanzi: '现在是上午十点半。', pinyin: 'xiàn zài shì shàng wǔ shí diǎn bàn 。', meaning: 'Bây giờ là 10 giờ rưỡi sáng.' },
      { id: 'l3', speaker: 'A', hanzi: '今天下午你有时间吗？', pinyin: 'jīn tiān xià wǔ nǐ yǒu shí jiān ma ？', meaning: 'Chiều hôm nay bạn có rảnh không?' },
      { id: 'l4', speaker: 'B', hanzi: '有时间，怎么了？', pinyin: 'yǒu shí jiān ， zěn me le ？', meaning: 'Có rảnh chứ, có chuyện gì thế?' },
      { id: 'l5', speaker: 'A', hanzi: '我们下午两点一起去图书馆看书，好吗？', pinyin: 'wǒ men xià wǔ liǎng diǎn yì qǐ qù tú shū guǎn kàn shū ， hǎo ma ？', meaning: 'Chiều nay 2 giờ chúng mình cùng nhau đi thư viện đọc sách nhé, được không?' },
      { id: 'l6', speaker: 'B', hanzi: '太好了！下午两点图书馆门口见！', pinyin: 'tài hǎo le ！ xià wǔ liǎng diǎn tú shū guǎn mén kǒu jiàn ！', meaning: 'Tuyệt quá! 2 giờ chiều gặp nhau ở cổng thư viện nhé!' },
    ],
    keyVocabulary: [
      { hanzi: '现在', pinyin: 'xiànzài', meaning: 'Bây giờ' },
      { hanzi: '几点', pinyin: 'jǐ diǎn', meaning: 'Mấy giờ' },
      { hanzi: '半', pinyin: 'bàn', meaning: 'Rưỡi / nửa' },
      { hanzi: '时间', pinyin: 'shíjiān', meaning: 'Thời gian' },
      { hanzi: '门口', pinyin: 'ménkǒu', meaning: 'Cổng / cửa ra vào' },
    ],
  },
  {
    id: 'shopping_market',
    title: '3. Mua sắm hoa quả & Mặc cả',
    level: 'HSK 1',
    topic: 'Mua sắm & Tiền tệ',
    icon: '🍎',
    description: 'Khách hàng vào chợ hoa quả mua táo và hỏi giá tiền, trả giá.',
    characters: {
      nameA: 'Khách mua (买家)',
      avatarA: '🙋‍♀️',
      roleA: 'Người mua hàng',
      nameB: 'Chủ quán (老板)',
      avatarB: '👨‍🌾',
      roleB: 'Chủ sạp trái cây',
    },
    lines: [
      { id: 'l1', speaker: 'A', hanzi: '老板，这个苹果怎么卖？', pinyin: 'lǎo bǎn ， zhè ge píng guǒ zěn me mài ？', meaning: 'Ông chủ ơi, táo này bán thế nào?' },
      { id: 'l2', speaker: 'B', hanzi: '五块钱一斤，很甜很新鲜！', pinyin: 'wǔ kuài qián yì jīn ， hěn tián hěn xīn xiān ！', meaning: '5 tệ một cân (nửa kg), rất ngọt và rất tươi!' },
      { id: 'l3', speaker: 'A', hanzi: '有点儿贵，能不能便宜一点儿？四块行吗？', pinyin: 'yǒu diǎnr guì ， néng bu néng pián yi yì diǎnr ？ sì kuài xíng ma ？', meaning: 'Hơi đắt một chút, có thể rẻ hơn một chút được không? 4 tệ được không?' },
      { id: 'l4', speaker: 'B', hanzi: '四块太低了，你要是买三斤，四块五给你。', pinyin: 'sì kuài tài dī le ， nǐ yào shi mǎi sān jīn ， sì kuài wǔ gěi nǐ 。', meaning: '4 tệ thấp quá, nếu cháu mua 3 cân thì chú để 4.5 tệ cho cháu.' },
      { id: 'l5', speaker: 'A', hanzi: '好，那我买三斤，一共多少钱？', pinyin: 'hǎo ， nà wǒ mǎi sān jīn ， yí gòng duō shao qián ？', meaning: 'Được ạ, thế cháu lấy 3 cân, tổng cộng bao nhiêu tiền ạ?' },
      { id: 'l6', speaker: 'B', hanzi: '三五一十五，十三块五毛。微信还是支付宝？', pinyin: 'sān wǔ yì shí wǔ ， shí sān kuài wǔ máo 。 wēi xìn hái shì zhī fù bǎo ？', meaning: 'Tổng cộng 13 tệ 5 hào. Cháu quét WeChat hay Alipay?' },
    ],
    keyVocabulary: [
      { hanzi: '老板', pinyin: 'lǎobǎn', meaning: 'Ông chủ' },
      { hanzi: '苹果', pinyin: 'píngguǒ', meaning: 'Quả táo' },
      { hanzi: '便宜', pinyin: 'piányi', meaning: 'Rẻ' },
      { hanzi: '块 / 斤', pinyin: 'kuài / jīn', meaning: 'Tệ / Cân (500g)' },
      { hanzi: '一共', pinyin: 'yígòng', meaning: 'Tổng cộng' },
    ],
  },
  {
    id: 'restaurant_order',
    title: '4. Gọi món tại quán ăn',
    level: 'HSK 1',
    topic: 'Ăn uống & Nhà hàng',
    icon: '🍜',
    description: 'Thực khách vào quán ăn Trung Quốc gọi món cơm xào, mì và đồ uống.',
    characters: {
      nameA: 'Thực khách (客人)',
      avatarA: '😋',
      roleA: 'Khách ăn',
      nameB: 'Phục vụ (服务员)',
      avatarB: '🧑‍🍳',
      roleB: 'Nhân viên quán',
    },
    lines: [
      { id: 'l1', speaker: 'B', hanzi: '您好，欢迎光临！请问几位？', pinyin: 'nín hǎo ， huān yíng guāng lín ！ qǐng wèn jǐ wèi ？', meaning: 'Xin chào, hoan nghênh quý khách! Xin hỏi quý khách đi mấy người ạ?' },
      { id: 'l2', speaker: 'A', hanzi: '两个人。请给我们菜单。', pinyin: 'liǎng gè rén 。 qǐng gěi wǒ men cài dān 。', meaning: 'Hai người. Cho chúng tôi xem thực đơn với.' },
      { id: 'l3', speaker: 'B', hanzi: '好的，这是菜单。二位想吃点儿什么？', pinyin: 'hǎo de ， zhè shì cài dān 。 èr wèi xiǎng chī diǎnr shén me ？', meaning: 'Dạ được, đây là thực đơn. Hai vị muốn dùng chút món gì ạ?' },
      { id: 'l4', speaker: 'A', hanzi: '我们要一份牛肉面，一盘炒饭。不要太辣。', pinyin: 'wǒ men yào yí fèn niú ròu miàn ， yì pán chǎo fàn 。 bú yào tài là 。', meaning: 'Chúng tôi muốn một bát mì bò, một đĩa cơm rang. Đừng cay quá nhé.' },
      { id: 'l5', speaker: 'B', hanzi: '好的，请问喝点儿什么？有茶和果汁。', pinyin: 'hǎo de ， qǐng wèn hē diǎnr shén me ？ yǒu chá hé guǒ zhī 。', meaning: 'Dạ vâng, xin hỏi hai vị uống chút gì ạ? Bên em có trà và nước hoa quả.' },
      { id: 'l6', speaker: 'A', hanzi: '请来两杯热茶，谢谢！', pinyin: 'qǐng lái liǎng bēi rè chá ， xiè xie ！', meaning: 'Cho hai cốc trà nóng nhé, cảm ơn em!' },
    ],
    keyVocabulary: [
      { hanzi: '菜单', pinyin: 'càidān', meaning: 'Thực đơn' },
      { hanzi: '牛肉面', pinyin: 'niúròumiàn', meaning: 'Mì thịt bò' },
      { hanzi: '炒饭', pinyin: 'chǎofàn', meaning: 'Cơm rang / xào' },
      { hanzi: '辣', pinyin: 'là', meaning: 'Cay' },
      { hanzi: '杯', pinyin: 'bēi', meaning: 'Cốc / ly' },
    ],
  },
  {
    id: 'asking_directions',
    title: '5. Hỏi đường đi tàu điện ngầm',
    level: 'HSK 1',
    topic: 'Đi lại & Phương hướng',
    icon: '🚇',
    description: 'Người đi đường lịch sự hỏi đường đến trạm tàu điện ngầm gần nhất.',
    characters: {
      nameA: 'Du khách (游客)',
      avatarA: '🚶‍♂️',
      roleA: 'Người hỏi đường',
      nameB: 'Người dân (路人)',
      avatarB: '👮‍♂️',
      roleB: 'Người chỉ đường',
    },
    lines: [
      { id: 'l1', speaker: 'A', hanzi: '您好，打扰一下，请问地铁站在哪儿？', pinyin: 'nín hǎo ， dǎ rǎo yí xià ， qǐng wèn dì tiě zhàn zài nǎr ？', meaning: 'Chào anh, làm phiền một chút, xin hỏi trạm tàu điện ngầm ở đâu vậy?' },
      { id: 'l2', speaker: 'B', hanzi: '往前走大约两百米，在十字路口往右拐。', pinyin: 'wǎng qián zǒu dà yuē liǎng bǎi mǐ ， zài shí zì lù kǒu wǎng yòu guǎi 。', meaning: 'Đi thẳng về phía trước khoảng 200 mét, ở ngã tư rẽ phải.' },
      { id: 'l3', speaker: 'A', hanzi: '离这儿远不远？走路需要多长时间？', pinyin: 'lí zhèr yuǎn bu yuǎn ？ zǒu lù xū yào duō cháng shí jiān ？', meaning: 'Có xa đây không anh? Đi bộ mất bao lâu?' },
      { id: 'l4', speaker: 'B', hanzi: '不远，很近。走五分钟就到了。', pinyin: 'bù yuǎn ， hěn jìn 。 zǒu wǔ fēn zhōng jiù dào le 。', meaning: 'Không xa đâu, rất gần. Đi bộ 5 phút là tới rồi.' },
      { id: 'l5', speaker: 'A', hanzi: '好的，太感谢您了！', pinyin: 'hǎo de ， tài gǎn xiè nín le ！', meaning: 'Vâng, cảm ơn anh rất nhiều ạ!' },
      { id: 'l6', speaker: 'B', hanzi: '不客气，慢走！', pinyin: 'bú kè qi ， màn zǒu ！', meaning: 'Không có chi, đi cẩn thận nhé!' },
    ],
    keyVocabulary: [
      { hanzi: '地铁站', pinyin: 'dìtiězhàn', meaning: 'Trạm tàu điện ngầm' },
      { hanzi: '往前', pinyin: 'wǎng qián', meaning: 'Về phía trước' },
      { hanzi: '右拐', pinyin: 'yòu guǎi', meaning: 'Rẽ phải' },
      { hanzi: '远 / 近', pinyin: 'yuǎn / jìn', meaning: 'Xa / Gần' },
      { hanzi: '分钟', pinyin: 'fēnzhōng', meaning: 'Phút' },
    ],
  },
  {
    id: 'weather_weekend',
    title: '6. Thời tiết & Kế hoạch cuối tuần',
    level: 'HSK 2',
    topic: 'Thời tiết & Đời sống',
    icon: '🌤️',
    description: 'Thảo luận về dự báo thời tiết ngày mai và quyết định đi dã ngoại công viên.',
    characters: {
      nameA: 'Lan Lan (兰兰)',
      avatarA: '👧',
      roleA: 'Bạn bè',
      nameB: 'Tiểu Cường (小强)',
      avatarB: '👦',
      roleB: 'Bạn bè',
    },
    lines: [
      { id: 'l1', speaker: 'A', hanzi: '明天是星期六，你看了天气预报吗？', pinyin: 'míng tiān shì xīng qī liù ， nǐ kàn le tiān qì yù bào ma ？', meaning: 'Ngày mai là thứ Bảy, bạn đã xem dự báo thời tiết chưa?' },
      { id: 'l2', speaker: 'B', hanzi: '看了，预报说明天是晴天，最高气温二十五度。', pinyin: 'kàn le ， yù bào shuō míng tiān shì qíng tiān ， zuì gāo qì wēn èr shí wǔ dù 。', meaning: 'Mình xem rồi, dự báo bảo mai trời nắng ráo, nhiệt độ cao nhất 25 độ.' },
      { id: 'l3', speaker: 'A', hanzi: '天气不冷不热，真舒服！我们去公园骑车吧？', pinyin: 'tiān qì bù lěng bú rè ， zhēn shū fu ！ wǒ men qù gōng yuán qí chē ba ？', meaning: 'Thời tiết không lạnh không nóng, dễ chịu thật! Chúng mình đi công viên đạp xe nhé?' },
      { id: 'l4', speaker: 'B', hanzi: '好主意！虽然人可能会很多，但是空气一定很好。', pinyin: 'hǎo zhǔ yi ！ suī rán rén kě néng huì hěn duō ， dàn shì kōng qì yí dìng hěn hǎo 。', meaning: 'Ý kiến hay! Tuy rằng người có thể đông, nhưng không khí chắc chắn rất trong lành.' },
      { id: 'l5', speaker: 'A', hanzi: '那我们明天上午九点在公园大门见，记得带水！', pinyin: 'nà wǒ men míng tiān shàng wǔ jiǔ diǎn zài gōng yuán dà mén jiàn ， jì de dài shuǐ ！', meaning: 'Thế mai 9 giờ sáng chúng mình gặp nhau ở cổng chính công viên nhé, nhớ mang theo nước!' },
      { id: 'l6', speaker: 'B', hanzi: '好的，一言为定，明天见！', pinyin: 'hǎo de ， yì yán wéi dìng ， míng tiān jiàn ！', meaning: 'Được rồi, nhất trí như thế nhé, mai gặp!' },
    ],
    keyVocabulary: [
      { hanzi: '天气预报', pinyin: 'tiānqì yùbào', meaning: 'Dự báo thời tiết' },
      { hanzi: '晴天', pinyin: 'qíngtiān', meaning: 'Ngày nắng' },
      { hanzi: '气温', pinyin: 'qìwēn', meaning: 'Nhiệt độ không khí' },
      { hanzi: '舒服', pinyin: 'shūfu', meaning: 'Dễ chịu / thoải mái' },
      { hanzi: '一言为定', pinyin: 'yìyánwéidìng', meaning: 'Nhất trí như vậy nhé' },
    ],
  },
  {
    id: 'hospital_health',
    title: '7. Khám bệnh & Sức khỏe',
    level: 'HSK 2',
    topic: 'Sức khỏe & Y tế',
    icon: '🏥',
    description: 'Người bệnh bị cảm cúm sốt đến phòng khám gặp bác sĩ kiểm tra.',
    characters: {
      nameA: 'Bệnh nhân (病人)',
      avatarA: '🤒',
      roleA: 'Người bị cảm',
      nameB: 'Bác sĩ (医生)',
      avatarB: '👩‍⚕️',
      roleB: 'Bác sĩ khám bệnh',
    },
    lines: [
      { id: 'l1', speaker: 'B', hanzi: '请坐，你哪里不舒服？', pinyin: 'qǐng zuò ， nǐ nǎ lǐ bù shū fu ？', meaning: 'Xin mời ngồi, bạn cảm thấy không khỏe ở đâu?' },
      { id: 'l2', speaker: 'A', hanzi: '医生，我头很疼，嗓子也疼，还有点儿发烧。', pinyin: 'yī shēng ， wǒ tóu hěn téng ， sǎng zi yě téng ， hái yǒu diǎnr fā shāo 。', meaning: 'Bác sĩ ơi, tôi đau đầu lắm, họng cũng đau, còn hơi sốt nữa.' },
      { id: 'l3', speaker: 'B', hanzi: '量一下体温……三十八度五。从什么时候开始的？', pinyin: 'liáng yí xià tǐ wēn …… sān shí bā dù wǔ 。 cóng shén me shí hou kāi shǐ de ？', meaning: 'Đo nhiệt độ một chút nhé... 38.5 độ. Bắt đầu từ khi nào thế bạn?' },
      { id: 'l4', speaker: 'A', hanzi: '昨天晚上开始的，昨晚咳嗽了一整夜。', pinyin: 'zuó tiān wǎn shang kāi shǐ de ， zuó wǎn ké sou le yì zhěng yè 。', meaning: 'Bắt đầu từ tối hôm qua ạ, tối qua tôi ho suốt cả đêm.' },
      { id: 'l5', speaker: 'B', hanzi: '你感冒了。不要担心，吃三天药，多喝热水，多休息。', pinyin: 'nǐ gǎn mào le 。 bú yào dān xīn ， chī sān tiān yào ， duō hē rè shuǐ ， duō xiū xi 。', meaning: 'Bạn bị cảm cúm rồi. Đừng lo lắng, uống thuốc 3 ngày, uống nhiều nước ấm và nghỉ ngơi nhiều nhé.' },
      { id: 'l6', speaker: 'A', hanzi: '好的，谢谢医生！', pinyin: 'hǎo de ， xiè xie yī shēng ！', meaning: 'Vâng ạ, cảm ơn bác sĩ nhiều!' },
    ],
    keyVocabulary: [
      { hanzi: '头疼', pinyin: 'tóuténg', meaning: 'Đau đầu' },
      { hanzi: '发烧', pinyin: 'fāshāo', meaning: 'Bị sốt' },
      { hanzi: '感冒', pinyin: 'gǎnmào', meaning: 'Cảm cúm' },
      { hanzi: '吃药', pinyin: 'chī yào', meaning: 'Uống thuốc' },
      { hanzi: '休息', pinyin: 'xiūxi', meaning: 'Nghỉ ngơi' },
    ],
  },
  {
    id: 'family_job',
    title: '8. Trò chuyện về Gia đình & Công việc',
    level: 'HSK 2',
    topic: 'Gia đình & Xã hội',
    icon: '👨‍👩‍👧',
    description: 'Hai đồng nghiệp trò chuyện giờ giải lao về quy mô gia đình và nghề nghiệp bố mẹ.',
    characters: {
      nameA: 'Tiểu Lệ (小丽)',
      avatarA: '👩',
      roleA: 'Đồng nghiệp',
      nameB: 'A Bằng (阿朋)',
      avatarB: '👨',
      roleB: 'Đồng nghiệp',
    },
    lines: [
      { id: 'l1', speaker: 'A', hanzi: '阿朋，你家有几口人？', pinyin: 'ā péng ， nǐ jiā yǒu jǐ kǒu rén ？', meaning: 'A Bằng ơi, nhà bạn có mấy người?' },
      { id: 'l2', speaker: 'B', hanzi: '我家有四口人：爸爸、妈妈、一个妹妹和我。你呢？', pinyin: 'wǒ jiā yǒu sì kǒu rén ： bà ba 、 mā ma 、 yí gè mèi mei hé wǒ 。 nǐ ne ？', meaning: 'Nhà mình có 4 người: bố, mẹ, một em gái và mình. Còn bạn?' },
      { id: 'l3', speaker: 'A', hanzi: '我家有三口人。你父母身体好吗？他们做什么工作？', pinyin: 'wǒ jiā yǒu sān kǒu rén 。 nǐ fù mǔ shēn tǐ hǎo ma ？ tā men zuò shén me gōng zuò ？', meaning: 'Nhà mình có 3 người. Bố mẹ bạn sức khỏe tốt không? Hai bác làm nghề gì thế?' },
      { id: 'l4', speaker: 'B', hanzi: '他们身体都很好。我爸爸是中学老师，妈妈在医院当护士。', pinyin: 'tā men shēn tǐ dōu hěn hǎo 。 wǒ bà ba shì zhōng xué lǎo shī ， mā ma zài yī yuàn dāng hù shi 。', meaning: 'Bố mẹ mình đều rất khỏe. Bố mình là giáo viên cấp hai, mẹ làm y tá ở bệnh viện.' },
      { id: 'l5', speaker: 'A', hanzi: '真不错！你妹妹多大了？还在上学吗？', pinyin: 'zhēn bú cuò ！ nǐ mèi mei duō dà le ？ hái zài shàng xué ma ？', meaning: 'Tuyệt thật đấy! Em gái bạn bao nhiêu tuổi rồi? Vẫn đang đi học à?' },
      { id: 'l6', speaker: 'B', hanzi: '对，她今年十六岁，正在读高中二年级。', pinyin: 'duì ， tā jīn tiān shí liù suì ， zhèng zài dú gāo zhōng èr nián jí 。', meaning: 'Đúng rồi, em ấy năm nay 16 tuổi, đang học lớp 11 phổ thông.' },
    ],
    keyVocabulary: [
      { hanzi: '口', pinyin: 'kǒu', meaning: 'Lượng từ đếm thành viên gia đình' },
      { hanzi: '父母', pinyin: 'fùmǔ', meaning: 'Bố mẹ / phụ mẫu' },
      { hanzi: '中学', pinyin: 'zhōngxué', meaning: 'Trường trung học' },
      { hanzi: '护士', pinyin: 'hùshi', meaning: 'Y tá' },
      { hanzi: '多大', pinyin: 'duō dà', meaning: 'Bao nhiêu tuổi' },
    ],
  },
  {
    id: 'birthday_celebration',
    title: '9. Sinh nhật & Chúc mừng bạn bè',
    level: 'HSK 2',
    topic: 'Lễ hội & Giao tiếp',
    icon: '🎂',
    description: 'Tổ chức sinh nhật bất ngờ cho bạn thân, tặng quà và chúc tụng vui vẻ.',
    characters: {
      nameA: 'Bạn bè (朋友们)',
      avatarA: '🥳',
      roleA: 'Nhóm bạn tổ chức',
      nameB: 'Chủ nhân sinh nhật (寿星)',
      avatarB: '🥰',
      roleB: 'Bạn nhận quà',
    },
    lines: [
      { id: 'l1', speaker: 'A', hanzi: '祝你生日快乐！这是送给你的礼物，看看喜欢吗？', pinyin: 'zhù nǐ shēng rì kuài lè ！ zhè shì sòng gěi nǐ de lǐ wù ， kàn kan xǐ huan ma ？', meaning: 'Chúc bạn sinh nhật vui vẻ! Đây là món quà tặng bạn, xem có thích không nhé?' },
      { id: 'l2', speaker: 'B', hanzi: '哇，太漂亮了！是一块新手表！我很喜欢，谢谢大家！', pinyin: 'wā ， tài piào liang le ！ shì yí kuài xīn shǒu biǎo ！ wǒ hěn xǐ huan ， xiè xie dà jiā ！', meaning: 'Oa, đẹp quá đi mất! Là một chiếc đồng hồ đeo tay mới! Mình thích lắm, cảm ơn mọi người!' },
      { id: 'l3', speaker: 'A', hanzi: '快来吹蜡烛、切蛋糕吧！许个愿望！', pinyin: 'kuài lái chuī là zhú 、 qiē dàn gāo ba ！ xǔ gè yuàn wàng ！', meaning: 'Mau lại đây thổi nến, cắt bánh kem đi nào! Ước một điều ước đi!' },
      { id: 'l4', speaker: 'B', hanzi: '好！我希望我们大家天天开心，身体健康！', pinyin: 'hǎo ！ wǒ xī wàng wǒ men dà jiā tiān tiān kāi xīn ， shēn tǐ jiàn kāng ！', meaning: 'Được rồi! Mình ước mọi người chúng ta ngày nào cũng vui vẻ, sức khỏe dồi dào!' },
      { id: 'l5', speaker: 'A', hanzi: '干杯！祝你新的一岁学业进步！', pinyin: 'gān bēi ！ zhù nǐ xīn de yí suì xué yè jìn bù ！', meaning: 'Cạn ly! Chúc bạn tuổi mới học tập tiến bộ!' },
      { id: 'l6', speaker: 'B', hanzi: '干杯！大家快尝尝这块巧克力蛋糕！', pinyin: 'gān bēi ！ dà jiā kuài cháng chang zhè kuài qiǎo kè lì dàn gāo ！', meaning: 'Cạn ly! Mọi người mau nếm thử chiếc bánh kem sô-cô-la này đi!' },
    ],
    keyVocabulary: [
      { hanzi: '生日快乐', pinyin: 'shēngrì kuàilè', meaning: 'Sinh nhật vui vẻ' },
      { hanzi: '礼物', pinyin: 'lǐwù', meaning: 'Món quà' },
      { hanzi: '手表', pinyin: 'shǒubiǎo', meaning: 'Đồng hồ đeo tay' },
      { hanzi: '希望', pinyin: 'xīwàng', meaning: 'Hy vọng / ước mong' },
      { hanzi: '干杯', pinyin: 'gānbēi', meaning: 'Cạn ly' },
    ],
  },
  {
    id: 'travel_goodbye',
    title: '10. Tạm biệt trước chuyến du lịch',
    level: 'HSK 2',
    topic: 'Du lịch & Tạm biệt',
    icon: '✈️',
    description: 'Tiễn bạn ra sân bay đi du lịch nước ngoài và gửi lời chúc chuyến đi bình an.',
    characters: {
      nameA: 'Người đi (旅客)',
      avatarA: '🧳',
      roleA: 'Người sắp bay',
      nameB: 'Người tiễn (送行者)',
      avatarB: '🤗',
      roleB: 'Bạn tiễn sân bay',
    },
    lines: [
      { id: 'l1', speaker: 'B', hanzi: '飞机是几点的？护照和机票都带齐了吗？', pinyin: 'fēi jī shì jǐ diǎn de ？ hù zhào hé jī piào dōu dài qí le ma ？', meaning: 'Máy bay là mấy giờ thế? Hộ chiếu và vé máy bay mang đủ hết chưa?' },
      { id: 'l2', speaker: 'A', hanzi: '下午两点四十分的。都带好了，行李也托运了。', pinyin: 'xià wǔ liǎng diǎn sì shí fēn de 。 dōu dài hǎo le ， xíng li yě tuō yùn le 。', meaning: '2 giờ 40 chiều. Mình mang đủ rồi, hành lý cũng ký gửi xong rồi.' },
      { id: 'l3', speaker: 'B', hanzi: '这次旅行打算去几天？都去哪些城市？', pinyin: 'zhè cì lǚ xíng dǎ suàn qù jǐ tiān ？ dōu qù nǎ xiē chéng shì ？', meaning: 'Chuyến du lịch này dự định đi mấy ngày? Đi những thành phố nào thế?' },
      { id: 'l4', speaker: 'A', hanzi: '打算去一个星期，先去北京看长城，再去西安看兵马俑。', pinyin: 'dǎ suàn qù yí gè xīng qī ， xiān qù běi jīng kàn cháng chéng ， zài qù xī ān kàn bīng mǎ yǒng 。', meaning: 'Dự định đi một tuần, trước tiên đi Bắc Kinh ngắm Vạn Lý Trường Thành, sau đó đi Tây An xem Tượng Binh mã.' },
      { id: 'l5', speaker: 'B', hanzi: '太棒了！祝你旅途愉快，一路平安！到了记得给我发微信！', pinyin: 'tài bàng le ！ zhù nǐ lǚ tú yú kuài ， yí lù píng ān ！ dào le jì de gěi wǒ fā wēi xìn ！', meaning: 'Tuyệt quá! Chúc bạn chuyến đi vui vẻ, thượng lộ bình an! Đến nơi nhớ nhắn tin WeChat cho mình nhé!' },
      { id: 'l6', speaker: 'A', hanzi: '一定！谢谢你来送我，我们下周见！', pinyin: 'yí dìng ！ xiè xie nǐ lái sòng wǒ ， wǒ men xià zhōu jiàn ！', meaning: 'Nhất định rồi! Cảm ơn bạn đã đến tiễn mình, tuần sau gặp lại nhé!' },
    ],
    keyVocabulary: [
      { hanzi: '护照', pinyin: 'hùzhào', meaning: 'Hộ chiếu' },
      { hanzi: '行李', pinyin: 'xíngli', meaning: 'Hành lý' },
      { hanzi: '旅游 / 旅行', pinyin: 'lǚyóu / lǚxíng', meaning: 'Du lịch' },
      { hanzi: '一路平安', pinyin: 'yílù píng\'ān', meaning: 'Thượng lộ bình an' },
      { hanzi: '记得', pinyin: 'jìde', meaning: 'Nhớ' },
    ],
  },
];
