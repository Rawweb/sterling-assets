export type IndustrySlug = 'steel' | 'banking' | 'real-estate' | 'agriculture';

export type IndustryItem = {
  title: string;
  desc: string;
};

export type IndustryData = {
  slug: IndustrySlug;
  title: string;
  heading: string;
  img: string;
  body: string[];
  approachTitle: string;
  approaches: IndustryItem[];
  reasonsTitle: string;
  reasons: IndustryItem[];
  closing?: string;
};

export const INDUSTRY_DATA: Record<IndustrySlug, IndustryData> = {
  steel: {
    slug: 'steel',
    title: 'Steel',
    heading: 'Steel: The Foundation of Modern Infrastructure',
    img: '/images/steel.jpg',
    body: [
      'Steel is the backbone of modern infrastructure, used in everything from skyscrapers to automobiles. At Sterling Assets Holdings, we invest in the steel industry, recognizing its critical role in economic development and growth.',
      'Our approach combines a deep understanding of the steel market with a commitment to sustainable practices, ensuring long-term value for our investors.',
    ],
    approachTitle: 'Steel as a Form of Investment',
    approaches: [
      {
        title: 'Direct Steel Production',
        desc: 'Sterling Assets Holdings invests in steel production facilities, gaining exposure to the fundamental drivers of the industry. This approach provides steady returns through the cyclical nature of steel demand.',
      },
      {
        title: 'DeFi and Yield Generation',
        desc: 'Decentralised finance protocols offer opportunities for passive income through staking, liquidity provision, and yield farming. We carefully assess protocol security and returns to identify the best opportunities for our investors.',
      },
      {
        title: 'Blockchain Infrastructure',
        desc: 'Investment in the foundational infrastructure of the blockchain ecosystem — including mining operations, node networks, and Layer 2 scaling solutions — positions our portfolio at the core of long-term digital asset growth.',
      },
      {
        title: 'Steel Venture Capital',
        desc: 'Early-stage investment in steel-related startups and innovative technologies offers significant upside potential. We evaluate teams, technology, and market timing to identify the next generation of leading steel companies.',
      },
      {
        title: 'Digital Asset Portfolio Management',
        desc: 'A diversified approach across multiple asset classes within the steel ecosystem reduces concentration risk while capturing growth across different segments of the market simultaneously.',
      },
    ],
    reasonsTitle: 'Why Steel is a Strategic Focus for Sterling',
    reasons: [
      {
        title: 'Explosive Growth Potential',
        desc: 'The steel market has historically offered returns that far exceed traditional asset classes, attracting institutional and retail investors at a rapidly growing pace.',
      },
      {
        title: 'Portfolio Diversification',
        desc: 'Digital assets have a low correlation with traditional markets, making them a powerful tool for reducing overall portfolio risk and improving risk-adjusted returns.',
      },
      {
        title: '24/7 Market Access',
        desc: 'Unlike traditional exchanges, steel markets operate around the clock, giving Sterling flexible entry and exit opportunities at any time of day or night.',
      },
      {
        title: 'Borderless Transactions',
        desc: 'Steel removes geographical barriers, enabling global investment flows with minimal friction, low transaction costs, and no reliance on intermediaries.',
      },
      {
        title: 'Growing Institutional Adoption',
        desc: 'Major financial institutions, governments, and corporations are increasing steel exposure, reinforcing the long-term legitimacy and stability of the asset class.',
      },
    ],
    closing:
      'By investing in the steel sector, Sterling Assets Holdings positions itself at the frontier of the global economic revolution; capturing growth while managing risk through a disciplined, diversified strategy.',
  },

  banking: {
    slug: 'banking',
    title: 'Banking',
    heading: 'Banking: A Pillar of Economic Growth',
    img: '/images/banking.jpg',
    body: [
      'The banking industry is a cornerstone of global economic activity, serving as the backbone for financial stability and growth. It facilitates the flow of capital between savers and borrowers and provides essential financial services to individuals and businesses on every continent.',
      'Sterling Assets Holdings partners with financial institutions and invests in banking infrastructure, capturing steady returns from one of the most regulated and stable sectors in the global economy.',
    ],
    approachTitle: 'Banking as a Form of Investment',
    approaches: [
      {
        title: 'Equity Investments',
        desc: 'Sterling Assets Holdings invests in publicly traded bank stocks, gaining equity ownership in well-performing financial institutions. These investments yield dividends and benefit from long-term capital appreciation as the institutions grow.',
      },
      {
        title: 'Debt Instruments',
        desc: 'Investing in bonds or other debt securities issued by banks offers fixed-income opportunities. These instruments are generally lower-risk compared to equities and provide a predictable and reliable revenue stream.',
      },
      {
        title: 'Private Equity and Venture Capital',
        desc: 'We support FinTech startups and emerging banking institutions by providing capital in exchange for equity. This strategy diversifies the portfolio and positions Sterling at the forefront of financial innovation.',
      },
      {
        title: 'Strategic Partnerships',
        desc: 'By forming alliances with financial institutions, Sterling gains access to exclusive financial products and services, ensuring optimised returns while leveraging the networks and expertise of established banks.',
      },
    ],
    reasonsTitle: 'Why Banking is a Strategic Focus for Sterling',
    reasons: [
      {
        title: 'Economic Stability',
        desc: 'Banking is a highly regulated and stable sector, minimising investment risks while delivering reliable and consistent returns across economic cycles.',
      },
      {
        title: 'Innovation Opportunities',
        desc: 'The FinTech boom offers lucrative investment avenues in digital banking, mobile payments, and blockchain-based financial services driving the next era of finance.',
      },
      {
        title: 'Global Reach',
        desc: 'Banks operate worldwide, providing Sterling with access to diverse markets and investment opportunities across geographies and economic environments.',
      },
      {
        title: 'Steady Returns',
        desc: 'Consistent demand for financial services means the banking industry generates reliable and sustainable returns, making it a cornerstone of any long-term portfolio.',
      },
    ],
    closing:
      'By investing in the banking industry, Sterling Assets Holdings secures financial growth while contributing to economic development and innovation, aligning with its commitment to creating lasting value for investors.',
  },

  'real-estate': {
    slug: 'real-estate',
    title: 'Real Estate',
    heading: 'Real Estate: Stable, Tangible, Profitable',
    img: '/images/real-estate.jpg',
    body: [
      'The real estate industry is a stable and profitable investment sector encompassing residential, commercial, and industrial properties. It offers capital appreciation, steady cash flow, and meaningful portfolio diversification for long-term investors across economic cycles.',
      'Sterling Assets Holdings invests in high-growth real estate opportunities across emerging and established markets, delivering consistent returns while addressing global trends like urbanisation and sustainable development.',
    ],
    approachTitle: "Sterling's Strategic Approach to Real Estate Investments",
    approaches: [
      {
        title: 'Residential Properties for Long-Term Growth',
        desc: 'Sterling invests in residential real estate in established and emerging markets, including single-family homes, multi-family units, and large-scale housing developments targeting areas with increasing demand and strong rental yields.',
      },
      {
        title: 'Commercial Real Estate for Economic Vitality',
        desc: 'Investments in commercial properties such as office spaces, retail outlets, and business complexes form a key part of our portfolio, focusing on prime locations that attract stable tenants and generate reliable rental income.',
      },
      {
        title: 'Industrial Real Estate',
        desc: 'The rise of e-commerce has driven demand for industrial spaces like warehouses and logistics centres. We invest strategically in these properties essential for supply chain operations, ensuring steady returns from a rapidly growing sector.',
      },
      {
        title: 'Integrated Mixed-Use Developments',
        desc: 'We support the development of mixed-use properties combining residential, commercial, and recreational spaces. These projects meet modern urban demands, foster vibrant communities, and provide comprehensive solutions in growing metropolitan areas.',
      },
      {
        title: 'Real Estate Investment Trusts (REITs)',
        desc: 'REITs enhance portfolio flexibility by allowing participation in diversified property portfolios, offering income through dividends and capital gains without requiring direct property ownership or management.',
      },
    ],
    reasonsTitle: 'Why Sterling Prioritises Real Estate',
    reasons: [
      {
        title: 'Sustainable Value Creation',
        desc: 'Real estate investments offer consistent value growth over time. Sterling leverages this reliability to ensure strong returns while reinvesting in promising opportunities.',
      },
      {
        title: 'Reliable Income Streams',
        desc: 'Properties generate steady cash flow through rental agreements, providing a predictable source of income that allows Sterling to meet investor financial objectives effectively.',
      },
      {
        title: 'Diversification Benefits',
        desc: 'Real estate acts as a buffer against market volatility. By diversifying across residential, commercial, and industrial properties, Sterling mitigates risks and enhances portfolio resilience.',
      },
      {
        title: 'Commitment to Sustainability',
        desc: 'We emphasise eco-friendly construction and energy-efficient developments, aligning with global environmental goals and attracting sustainability-conscious investors and tenants.',
      },
      {
        title: 'Tapping into Urbanisation Trends',
        desc: 'Global urbanisation presents vast opportunities for infrastructure and housing investments, positioning Sterling as a key player in meeting the growing demands of rapidly developing regions.',
      },
    ],
  },

  agriculture: {
    slug: 'agriculture',
    title: 'Agriculture',
    heading: 'Agriculture: Feeding Growth and Returns',
    img: '/images/agriculture.jpg',
    body: [
      'Agriculture remains a critical industry for global food security and rural development. With rising global demand and the adoption of modern farming techniques, the sector offers resilient, long-term investment potential that holds value across economic cycles.',
      'Sterling Assets Holdings supports modern farming practices, eco-friendly technologies, and supply chain improvements to promote sustainability and resilience in the agricultural sector.',
    ],
    approachTitle: 'Agriculture as a Key Investment Sector for Sterling',
    approaches: [
      {
        title: 'Direct Investment in Agricultural Land and Operations',
        desc: 'Sterling actively invests in farmland and agricultural operations, including the acquisition or leasing of land for crop production and the establishment of sustainable farming practices that offer long-term value appreciation and steady revenue streams.',
      },
      {
        title: 'Agri-Tech Investments',
        desc: 'The growing field of agri-tech is revolutionising the industry, from precision farming to automated machinery. We explore opportunities in agri-tech startups providing innovative solutions to enhance productivity, sustainability, and efficiency in farming operations.',
      },
      {
        title: 'Sustainable and Organic Farming Initiatives',
        desc: 'Demand for organic and eco-friendly food sources continues to rise. Sterling targets investments in sustainable farming operations that meet this demand, offering premium returns while supporting environmentally responsible practices.',
      },
      {
        title: 'Agricultural Commodities and Futures Markets',
        desc: 'We engage in trading agricultural commodities and futures contracts, allowing Sterling to leverage price fluctuations and hedge risks in key agricultural sectors such as grains, livestock, and other commodities.',
      },
      {
        title: 'Private Equity in Agri-Tech Ventures',
        desc: 'In addition to land and commodities, Sterling invests in private equity and venture capital for emerging agricultural startups, especially those focused on agri-tech innovations with high-growth potential and strong market demand.',
      },
    ],
    reasonsTitle: 'Why Sterling Focuses on Agriculture',
    reasons: [
      {
        title: 'Rising Global Demand',
        desc: 'With the world population expected to exceed 9 billion by 2050, agriculture plays a critical role in ensuring global food security, driving long-term investment profitability.',
      },
      {
        title: 'Sustainability and Eco-Friendly Practices',
        desc: 'Sterling is committed to supporting agricultural investments that prioritise sustainability, helping businesses reduce their environmental impact while increasing profitability over the long term.',
      },
      {
        title: 'Technological Advancements',
        desc: 'The agricultural sector continues to adopt cutting-edge technologies — from AI-powered farming tools to climate-resilient crop varieties — creating significant new investment opportunities.',
      },
      {
        title: 'Stability and Long-Term Returns',
        desc: 'Agricultural investments provide stable, long-term returns due to the essential nature of food production and land ownership, offering consistent cash flow through rental income and crop sales.',
      },
      {
        title: 'Diversification and Risk Mitigation',
        desc: 'Agriculture offers an opportunity to diversify investment portfolios, reducing exposure to market volatility and ensuring a balanced and resilient approach to asset management.',
      },
    ],
    closing:
      'For Sterling Assets Holdings, agriculture is more than just an investment opportunity; it is a sector that offers long-term value, stability, and alignment with global sustainability efforts, creating lasting impact for investors and communities alike.',
  },
};

export const VALID_SLUGS = Object.keys(INDUSTRY_DATA) as IndustrySlug[];
