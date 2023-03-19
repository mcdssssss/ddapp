export const cabinets = [
  {
    label: '小衣柜',
    width: 450,
    height: 2300,
    depth: 600,
    key: 'CabinetSmall',
    image: 'https://landalf.oss-cn-beijing.aliyuncs.com/tmp/small.jpg'
  },
  {
    label: '大衣柜',
    width: 900,
    height: 2300,
    depth: 600,
    key: 'CabinetBig',
    image: 'https://landalf.oss-cn-beijing.aliyuncs.com/tmp/big.jpg'
  },
  {
    label: '书桌',
    width: 1200,
    height: 750,
    depth: 600,
    key: 'Desk',
    image: 'https://landalf.oss-cn-beijing.aliyuncs.com/tmp/Snipaste_2021-12-16_15-42-17.jpg'
  },
  {
    label: '转角柜',
    width: 1050,
    height: 2300,
    depth: 600,
    key: 'CabinetCorner',
    image: 'https://landalf.oss-cn-beijing.aliyuncs.com/tmp/Snipaste_2021-12-23_15-57-26.jpg'
  }
];

export const plates = [
  {
    label: '侧板',
    type: 'plate-side-inner',
    image: 'https://landalf.oss-cn-beijing.aliyuncs.com/tmp/ceban.png'
  },
  {
    label: '层板',
    type: 'plate-laminate-inner',
    image: 'https://landalf.oss-cn-beijing.aliyuncs.com/tmp/cengban.png'
  },
  {
    label: '抽屉',
    type: 'DrawerPlateGroup',
    image:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.71rs.cn%2Fupfile%2F2019%2F06%2F20190622102627_329.jpg&refer=http%3A%2F%2Fwww.71rs.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1644039385&t=0fde5e746e5c4472ef8b060f936c970d'
  },
  {
    label: '垂直封边',
    type: 'EdgeBandingPlateGroup-vertical',
    image: 'https://img1.baidu.com/it/u=1867665216,3562949785&fm=26&fmt=auto'
  },
  {
    label: '水平封边',
    type: 'EdgeBandingPlateGroup-horizontal',
    image: 'https://img1.baidu.com/it/u=1867665216,3562949785&fm=26&fmt=auto'
  }
];

/**
 * 尺寸使用区域
 */
export const useSizeAreas = [
  {
    name: '被褥区',
    best: {
      width: 900,
      height: 550,
      depth: 600
    },
    width: [700, 1000],
    height: [400, 650],
    depth: [550, 800]
  },
  {
    name: '叠放区',
    best: {
      width: 450,
      height: 450
    },
    width: [350, 500],
    height: [350, 450],
    depth: [550, 800]
  },
  {
    name: '短衣区',
    best: {
      width: 450
    },
    width: [350, 500],
    height: [1000, 1200],
    depth: [550, 800]
  },
  {
    name: '短衣区',
    best: {
      width: 900
    },
    width: [700, 1000],
    height: [1000, 1200],
    depth: [550, 800]
  },
  {
    name: '长衣区',
    best: {
      width: 450
    },
    width: [350, 500],
    height: [1201, 1700],
    depth: [550, 800]
  },
  {
    name: '长衣区',
    best: {
      width: 900
    },
    width: [700, 1000],
    height: [1201, 1700],
    depth: [550, 800]
  }
];

export const banners = [
  'http://user-platform-oss.kujiale.com/store/2022/01/19/MHT4WD5MDZKQIAABAAAAAAI8_3840x876.jpg?x-oss-process=image/resize,m_fill,w_1905,h_420/format,webp'
];

export const templates = [
  {
    title: '新中式茶室',
    image:
      'https://qhrenderpic-cos.kujiale.com/r/2021/12/17/L3D206S21ENDPSRWASFSGGINOLUF3P3X4888_2560x1440.jpg?x-oss-process=image/resize,m_lfit,w_640/format,webp',
    view: 5654,
    collects: 152,
    designed: 23,
    price: 120,
    designPrice: 5421,
    fromUser: 'official',
    userInfo: {
      avatar_url:
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2F2021%2Fedpic_source%2Ff8%2F3a%2F37%2Ff83a371f767b48b2f7e19ef7ac6b4ad9_8.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1645422259&t=8f04bb3c9f67d4b49104bb9d05580650',
      nick_name: '我是你爹'
    }
  },
  {
    title: '创意衣柜设计',
    image:
      'https://qhrenderstorage-oss.kujiale.com/beautify/2021/11/01/MF754EVMDHQ3EAABAAAAACY8.jpg?x-oss-process=image/resize,m_lfit,w_640/format,webp',
    view: 12562,
    collects: 523,
    designed: 156,
    price: 480,
    designPrice: 6512,
    fromUser: 'personal',
    userInfo: {
      avatar_url:
        'https://img0.baidu.com/it/u=1056811702,4111096278&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
      nick_name: '小小瞎子'
    }
  },
  {
    title: '现代风格【开放式厨房】',
    image:
      'https://qhrenderpic-cos.kujiale.com/r/2021/10/16/L3D186S21ENDPR23BVVSGG6F2LUF3P3WS888_1920x1080.jpg?x-oss-process=image/resize,m_lfit,w_640/format,webp',
    view: 6582,
    collects: 65,
    designed: 96,
    price: 550,
    designPrice: 8040,
    fromUser: 'enterprise',
    userInfo: {
      avatar_url:
        'https://img0.baidu.com/it/u=1056811702,4111096278&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
      nick_name: '本王不推诿'
    }
  },
  {
    title: '别墅二层衣柜设计',
    image:
      'https://qhrenderpic-cos.kujiale.com/r/2021/10/27/L3D123S21ENDPRTT6R5SGHJM2LUF3P3XC888_3200x2400.jpg?x-oss-process=image/resize,m_lfit,w_640/format,webp',
    view: 6582,
    collects: 65,
    designed: 96,
    price: 150,
    designPrice: 7500,
    fromUser: 'official',
    userInfo: {
      avatar_url:
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202004%2F02%2F20200402133820_4YaiP.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1645422408&t=bcc468336319da2ea9e98b5b6d2aec5e',
      nick_name: '本王不推诿'
    }
  },
  {
    title: '开放式厨房-新中式',
    image:
      'https://qhrenderstorage-oss.kujiale.com/beautify/2021/10/26/MF3Y57FMDHGW4AABAAAAAAY8.jpg?x-oss-process=image/resize,m_lfit,w_640/format,webp',
    view: 6582,
    collects: 65,
    designed: 96,
    price: 550,
    designPrice: 8040,
    fromUser: 'official',
    userInfo: {
      avatar_url:
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202004%2F02%2F20200402133820_4YaiP.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1645422408&t=bcc468336319da2ea9e98b5b6d2aec5e',
      nick_name: '本王不推诿'
    }
  },
  {
    title: '创意衣柜设计2',
    image:
      'https://user-platform-oss.kujiale.com/upms/70665917d76f84a9-1636533244904-1.jpg?x-oss-process=image/resize,m_lfit,w_640/format,webp',
    view: 6582,
    collects: 65,
    designed: 96,
    price: 550,
    designPrice: 8040,
    fromUser: 'official',
    userInfo: {
      avatar_url:
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202004%2F02%2F20200402133820_4YaiP.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1645422408&t=bcc468336319da2ea9e98b5b6d2aec5e',
      nick_name: '本王不推诿'
    }
  },
  {
    title: '现代轻奢衣柜定制',
    image:
      'https://qhrenderpic-cos.kujiale.com/r/2021/07/14/L3D187S21ENDPXYRHINSGEOGULUF3P3XG888_3840x2160.jpg?x-oss-process=image/resize,m_lfit,w_640/format,webp',
    view: 6582,
    collects: 65,
    designed: 96,
    price: 550,
    designPrice: 8040,
    fromUser: 'official',
    userInfo: {
      avatar_url:
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202004%2F02%2F20200402133820_4YaiP.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1645422408&t=bcc468336319da2ea9e98b5b6d2aec5e',
      nick_name: '本王不推诿'
    }
  },
  {
    title: '【创意衣柜设计】--小黑系列',
    image:
      'https://qhrenderstorage-oss.kujiale.com/beautify/2021/11/08/MGETB2FMDG3KWAABAAAAACI8.jpg?x-oss-process=image/resize,m_lfit,w_640/format,webp',
    view: 6582,
    collects: 65,
    designed: 96,
    price: 550,
    designPrice: 8040,
    fromUser: 'official',
    userInfo: {
      avatar_url:
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202004%2F02%2F20200402133820_4YaiP.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1645422408&t=bcc468336319da2ea9e98b5b6d2aec5e',
      nick_name: '本王不推诿'
    }
  },
  {
    title: '别墅二层衣柜设计',
    image:
      'https://qhrenderpic-cos.kujiale.com/r/2021/10/27/L3D123S21ENDPRTT6R5SGHJM2LUF3P3XC888_3200x2400.jpg?x-oss-process=image/resize,m_lfit,w_640/format,webp',
    view: 6582,
    collects: 65,
    designed: 96,
    price: 550,
    designPrice: 8040,
    fromUser: 'official',
    userInfo: {
      avatar_url:
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202004%2F02%2F20200402133820_4YaiP.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1645422408&t=bcc468336319da2ea9e98b5b6d2aec5e',
      nick_name: '本王不推诿'
    }
  },
  {
    title: '别墅二层衣柜设计',
    image:
      'https://qhrenderpic-cos.kujiale.com/r/2021/10/27/L3D123S21ENDPRTT6R5SGHJM2LUF3P3XC888_3200x2400.jpg?x-oss-process=image/resize,m_lfit,w_640/format,webp',
    view: 6582,
    collects: 65,
    designed: 96,
    price: 550,
    designPrice: 8040,
    fromUser: 'official',
    userInfo: {
      avatar_url:
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202004%2F02%2F20200402133820_4YaiP.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1645422408&t=bcc468336319da2ea9e98b5b6d2aec5e',
      nick_name: '本王不推诿'
    }
  },
  {
    title: '别墅二层衣柜设计',
    image:
      'https://qhrenderpic-cos.kujiale.com/r/2021/10/27/L3D123S21ENDPRTT6R5SGHJM2LUF3P3XC888_3200x2400.jpg?x-oss-process=image/resize,m_lfit,w_640/format,webp',
    view: 6582,
    collects: 65,
    designed: 96,
    price: 550,
    designPrice: 8040,
    fromUser: 'official',
    userInfo: {
      avatar_url:
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202004%2F02%2F20200402133820_4YaiP.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1645422408&t=bcc468336319da2ea9e98b5b6d2aec5e',
      nick_name: '本王不推诿'
    }
  },
  {
    title: '别墅二层衣柜设计',
    image:
      'https://qhrenderpic-cos.kujiale.com/r/2021/10/27/L3D123S21ENDPRTT6R5SGHJM2LUF3P3XC888_3200x2400.jpg?x-oss-process=image/resize,m_lfit,w_640/format,webp',
    view: 6582,
    collects: 65,
    designed: 96,
    price: 550,
    designPrice: 8040,
    fromUser: 'official',
    userInfo: {
      avatar_url:
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202004%2F02%2F20200402133820_4YaiP.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1645422408&t=bcc468336319da2ea9e98b5b6d2aec5e',
      nick_name: '本王不推诿'
    }
  },
  {
    title: '别墅二层衣柜设计',
    image:
      'https://qhrenderpic-cos.kujiale.com/r/2021/10/27/L3D123S21ENDPRTT6R5SGHJM2LUF3P3XC888_3200x2400.jpg?x-oss-process=image/resize,m_lfit,w_640/format,webp',
    view: 6582,
    collects: 65,
    designed: 96,
    price: 550,
    designPrice: 8040,
    fromUser: 'official',
    userInfo: {
      avatar_url:
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202004%2F02%2F20200402133820_4YaiP.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1645422408&t=bcc468336319da2ea9e98b5b6d2aec5e',
      nick_name: '本王不推诿'
    }
  }
];
