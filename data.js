/*
 * Advisor structural data.
 *
 * Fields:
 *   name         — English name (primary)
 *   name_cn      — Chinese name if known (optional)
 *   university   — Affiliation
 *   region       — Coarse region bucket (filterable)
 *   disputed     — boolean: source doc marks this entry as "存在争议" or has
 *                  significant counter-testimony
 *   has_rebuttal — boolean: source doc contains a rebuttal / 申诉 section
 *   tags         — optional array of extra tags
 *   photo        — optional image URL (leave blank; populate manually if desired)
 *   comments     — optional free text; leave empty to defer to source doc
 *   rebuttals    — optional free text; leave empty to defer to source doc
 *   source_url   — per-entry deep link (optional; defaults to top of doc)
 *
 * NOTE: Entries here are drawn from a public community document. Status flags
 * (disputed / has_rebuttal) reflect how the source doc presents the entry, not
 * any independent verification. Specific allegation text is intentionally
 * omitted — click "打开原文档" in the modal to read the source.
 */
window.ADVISORS = [
  // ========== US - California / West ==========
  { name: "Min Xu", university: "CMU", region: "US · West", disputed: true,
    homepage: "https://xulabs.github.io/min-xu/" },
  { name: "Jure Leskovec", university: "Stanford", region: "US · West",
    homepage: "https://cs.stanford.edu/~jure/" },
  { name: "Zhiting Hu", university: "UCSD", region: "US · West" },
  { name: "Lianhui Qin", university: "UCSD", region: "US · West" },
  { name: "Xinyu Zhang", university: "UCSD", region: "US · West" },
  { name: "Biwei Huang", university: "UCSD", region: "US · West" },
  { name: "Nuno Vasconcelos", university: "UCSD", region: "US · West" },
  { name: "Pengtao Xie", university: "UCSD", region: "US · West", disputed: true,
    homepage: "https://pengtaoxie.github.io/" },
  { name: "Yufei Ding", university: "UCSD", region: "US · West", disputed: true, has_rebuttal: true,
    tags: ["学生为其辩护 / students defend"],
    homepage: "https://yufeiding.ucsd.edu/" },
  { name: "Hao Su", university: "UCSD", region: "US · West" },
  { name: "Zhuowen Tu", university: "UCSD", region: "US · West" },
  { name: "Yiwei Wang", university: "UC Merced", region: "US · West" },
  { name: "Jiaqi Ma", university: "UCLA", region: "US · West" },
  { name: "Jason Cong", university: "UCLA", region: "US · West" },
  { name: "Quanquan Gu", university: "UCLA", region: "US · West",
    homepage: "http://web.cs.ucla.edu/~qgu/" },
  { name: "Eric Xin Wang", university: "UCSB", region: "US · West" },
  { name: "Shiyu Chang", university: "UCSB", region: "US · West" },
  { name: "Yuan-fang Wang", university: "UCSB", region: "US · West" },
  { name: "Murphy Yuezhen Niu", university: "UCSB", region: "US · West" },
  { name: "Lingqi Yan", university: "UCSB", region: "US · West" },
  { name: "Wenbo Guo", university: "UCSB", region: "US · West" },
  { name: "Chenguang Wang", university: "UCSC", region: "US · West" },
  { name: "Sergey Levine", university: "UC Berkeley", region: "US · West",
    homepage: "https://people.eecs.berkeley.edu/~svlevine/" },
  { name: "Jason D. Lee", university: "UC Berkeley", region: "US · West" },
  { name: "Alexei Efros", university: "UC Berkeley", region: "US · West" },
  { name: "Koushil Sreenath", university: "UC Berkeley", region: "US · West" },
  { name: "Haoran Geng", university: "UC Berkeley", region: "US · West" },
  { name: "Sewon Min", university: "UC Berkeley", region: "US · West" },
  { name: "Jiayi Eris Zhang", university: "Stanford", region: "US · West" },
  { name: "Shuran Song", university: "Stanford", region: "US · West" },
  { name: "Jiajun Wu", university: "Stanford", region: "US · West" },
  { name: "Yue Wang", university: "USC", region: "US · West" },
  { name: "Yan Liu", university: "USC", region: "US · West" },
  { name: "Phebe Vayanos", university: "USC", region: "US · West" },
  { name: "Sumit Roy", university: "UWashington", region: "US · West" },
  { name: "Yang Song", university: "Caltech", region: "US · West" },
  { name: "Animesh Garg", university: "Caltech", region: "US · West" },

  // ========== US - Midwest ==========
  { name: "Jimeng Sun", university: "UIUC", region: "US · Midwest", disputed: true,
    homepage: "https://siebelschool.illinois.edu/about/people/faculty/jimeng" },
  { name: "Bo Li", university: "UIUC", region: "US · Midwest" },
  { name: "Hua Li", university: "UIUC", region: "US · Midwest" },
  { name: "Huan Zhang", university: "UIUC", region: "US · Midwest" },
  { name: "Jian Huang", university: "UIUC", region: "US · Midwest" },
  { name: "Deming Chen", university: "UIUC", region: "US · Midwest" },
  { name: "Jiaxuan You", university: "UIUC", region: "US · Midwest" },
  { name: "Heng Ji", university: "UIUC", region: "US · Midwest" },
  { name: "Yu-Xiong Wang", university: "UIUC", region: "US · Midwest" },
  { name: "Minjia Zhang", university: "UIUC", region: "US · Midwest" },
  { name: "Kevin Chang", university: "UIUC", region: "US · Midwest" },
  { name: "Daniel Kang", university: "UIUC", region: "US · Midwest" },
  { name: "Fan Lai", university: "UIUC", region: "US · Midwest" },
  { name: "Gagandeep Singh", university: "UIUC", region: "US · Midwest" },
  { name: "Dingwen Tao", university: "IUB", region: "US · Midwest" },
  { name: "Fengguang Song", university: "IUB", region: "US · Midwest" },
  { name: "Sharon Li", university: "UW-Madison", region: "US · Midwest",
    homepage: "https://pages.cs.wisc.edu/~sharonli/" },
  { name: "Xiaobin Xiong", university: "UW-Madison", region: "US · Midwest" },
  { name: "Sikai Chen", university: "UW-Madison", region: "US · Midwest" },
  { name: "Junjie Hu", university: "UW-Madison", region: "US · Midwest" },
  { name: "Junchen Jiang", university: "UChicago", region: "US · Midwest" },
  { name: "Ce Zhang", university: "UChicago", region: "US · Midwest" },
  { name: "Kaize Ding", university: "Northwestern", region: "US · Midwest" },
  { name: "Manling Li", university: "Northwestern", region: "US · Midwest" },
  { name: "Han Liu", university: "Northwestern", region: "US · Midwest" },
  { name: "Lu Cheng", university: "UIC", region: "US · Midwest" },
  { name: "Kangjie Lu", university: "UMN", region: "US · Midwest" },
  { name: "Katie Zhao", university: "UMN", region: "US · Midwest" },

  // ========== US - Northeast ==========
  { name: "Wojciech Matusik", university: "MIT", region: "US · Northeast" },
  { name: "Manya Ghobadi", university: "MIT", region: "US · Northeast" },
  { name: "Justin Chan", university: "CMU", region: "US · Northeast" },
  { name: "David Held", university: "CMU", region: "US · Northeast" },
  { name: "Ding Zhao", university: "CMU", region: "US · Northeast" },
  { name: "Chaowei Xiao", university: "JHU", region: "US · Northeast", disputed: true, has_rebuttal: true,
    homepage: "https://xiaocw11.github.io/" },
  { name: "Sijia Geng", university: "JHU", region: "US · Northeast" },
  { name: "Jason Eisner", university: "JHU", region: "US · Northeast" },
  { name: "Daniel Khashabi", university: "JHU", region: "US · Northeast" },
  { name: "Mathias Unberath", university: "JHU", region: "US · Northeast" },
  { name: "Kimia Ghobadi", university: "JHU", region: "US · Northeast" },
  { name: "Sharon Di", university: "Columbia", region: "US · Northeast" },
  { name: "Xiaodong Wang", university: "Columbia", region: "US · Northeast" },
  { name: "Baron Law", university: "Columbia", region: "US · Northeast" },
  { name: "Jeonghoe Lee", university: "Columbia", region: "US · Northeast" },
  { name: "Mengdi Wang", university: "Princeton", region: "US · Northeast" },
  { name: "Zhuang Liu", university: "Princeton", region: "US · Northeast" },
  { name: "Olga Russakovsky", university: "Princeton", region: "US · Northeast" },
  { name: "Mingmin Zhao", university: "UPenn", region: "US · Northeast" },
  { name: "Lingjie Liu", university: "UPenn", region: "US · Northeast" },
  { name: "Jiatao Gu", university: "UPenn", region: "US · Northeast" },
  { name: "Yufei Huang", university: "Pitt", region: "US · Northeast" },
  { name: "Yufei Ding (Pitt)", university: "Pitt", region: "US · Northeast" },
  { name: "Howie Huang", university: "GWU", region: "US · Northeast" },
  { name: "Ahmed Louri", university: "GWU", region: "US · Northeast" },
  { name: "Lan Tian", university: "GWU", region: "US · Northeast" },
  { name: "Lichao Sun", university: "Lehigh", region: "US · Northeast", has_rebuttal: true,
    tags: ["学生为其辩护 / students defend"],
    homepage: "https://lichao-sun.github.io/" },

  // ========== US - South / Mid-Atlantic ==========
  { name: "Xinya Du", university: "UTD", region: "US · South" },
  { name: "Atlas Wang", university: "UT Austin", region: "US · South" },
  { name: "Yuke Zhu", university: "UT Austin", region: "US · South" },
  { name: "Zhiyuan Yu", university: "TAMU", region: "US · South" },
  { name: "Zhengzhong Tu", university: "TAMU", region: "US · South" },
  { name: "Shuiwang Ji", university: "TAMU", region: "US · South" },
  { name: "Xia Hu", university: "Rice / TAMU", region: "US · South",
    homepage: "https://cs.rice.edu/~xh37/index.html" },
  { name: "Tony Geng", university: "Rice", region: "US · South" },
  { name: "Yanjie Fu", university: "ASU", region: "US · South" },
  { name: "Xi Peng", university: "U. Delaware", region: "US · South" },
  { name: "Xu Yuan", university: "U. Delaware", region: "US · South" },
  { name: "Heng Huang", university: "UMD", region: "US · South" },
  { name: "Tianyi Zhou", university: "UMD", region: "US · South" },
  { name: "Xiaorui Liu", university: "NCSU", region: "US · South" },
  { name: "Mohit Bansal", university: "UNC", region: "US · South",
    homepage: "https://www.cs.unc.edu/~mbansal/" },
  { name: "Huaxiu Yao", university: "UNC", region: "US · South" },
  { name: "Tianlong Chen", university: "UNC", region: "US · South" },
  { name: "Aidong Zhang", university: "UVA", region: "US · South" },
  { name: "Xiaorui (Xiaoxuan) Yang", university: "UVA", region: "US · South" },
  { name: "Lifu Huang", university: "UC Davis", region: "US · West" },
  { name: "Zheng Sika", university: "UCR", region: "US · West" },

  // ========== Canada ==========
  { name: "Baochun Li", university: "U. Toronto", region: "Canada" },
  { name: "Ben Liang", university: "U. Toronto", region: "Canada" },
  { name: "Bo Wang", university: "U. Toronto", region: "Canada" },
  { name: "Qiang Sun", university: "U. Toronto", region: "Canada" },
  { name: "Zhijing Jin", university: "U. Toronto", region: "Canada" },
  { name: "Hongyang Zhang", university: "U. Waterloo", region: "Canada" },
  { name: "Aishwarya Agrawal", university: "Mila / UdeM", region: "Canada" },
  { name: "Pouya Bashivan", university: "Mila / McGill", region: "Canada" },

  // ========== Middle East ==========
  { name: "Lijie Hu", university: "MBZUAI", region: "Middle East" },
  { name: "Di Wang", university: "MBZUAI / KAUST", region: "Middle East" },

  // ========== Hong Kong ==========
  { name: "Hengshuang Zhao", university: "HKU", region: "Hong Kong" },
  { name: "Yanchao Yang", university: "HKU", region: "Hong Kong" },
  { name: "Ping Luo", university: "HKU", region: "Hong Kong" }
];
