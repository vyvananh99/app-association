// assets
import {
  faList,
  faSitemap,
  faLocationDot,
  faSliders,
  faAward,
  faMap,
  faMapPin,
  faFileSignature,
  faVirus,
  faPeopleArrows,
  faArrowUpAZ,
  faCircleDollarToSlot,
  faHandHoldingDollar,
  faLayerGroup,
  faUserTie,
  faBookOpenReader,
  faMoneyBills,
  faCreditCard
} from '@fortawesome/free-solid-svg-icons';

// icons
const icons = {
  faList,
  faSitemap,
  faLocationDot,
  faSliders,
  faAward,
  faMap,
  faMapPin,
  faFileSignature,
  faVirus,
  faPeopleArrows,
  faArrowUpAZ,
  faCircleDollarToSlot,
  faHandHoldingDollar,
  faLayerGroup,
  faUserTie,
  faBookOpenReader,
  faMoneyBills,
  faCreditCard
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const listMenu = {
  id: 'dashboard',
  title: '',
  type: 'group',
  children: [
    {
      id: 'employee',
      title: 'Employee Profile',
      type: 'item',
      url: '/employee',
      icon: icons.faUserTie
    },
    {
      id: 'casual-labor',
      title: 'Casual Labor Profile',
      type: 'item',
      url: '/casual-labor',
      icon: icons.faUserTie
    },
    {
      id: 'movement-salary',
      title: 'Movement - Salary Adjustment',
      type: 'item',
      url: '/movement-salary',
      icon: icons.faCreditCard
    },
    {
      id: 'allowance',
      title: 'Fix Allowance',
      type: 'item',
      url: '/allowance',
      icon: icons.faMoneyBills
    },
    {
      id: 'training-process',
      title: 'Training Process',
      type: 'item',
      url: '/training-process',
      icon: icons.faBookOpenReader
    },
    {
      id: 'list',
      title: 'List',
      type: 'collapse',
      icon: icons.faList,
      children: [
        {
          id: 'organization',
          title: 'Organization',
          type: 'item',
          url: '/organization',
          icon: icons.faSitemap
        },
        {
          id: 'location',
          title: 'Location',
          type: 'item',
          url: '/location',
          icon: icons.faLocationDot
        },
        {
          id: 'function',
          title: 'Function',
          type: 'item',
          url: '/function',
          icon: icons.faSliders
        },
        {
          id: 'position',
          title: 'Position',
          type: 'item',
          url: '/position',
          icon: icons.faAward
        },
        {
          id: 'province',
          title: 'Province',
          type: 'item',
          url: '/province',
          icon: icons.faMap
        },
        {
          id: 'city',
          title: 'City',
          type: 'item',
          url: '/city',
          icon: icons.faMapPin
        },
        {
          id: 'contract-type',
          title: 'Contract Type',
          type: 'item',
          url: '/contract-type',
          icon: icons.faFileSignature
        },
        {
          id: 'leave-type',
          title: 'Leave Type',
          type: 'item',
          url: '/leave-type',
          icon: icons.faVirus
        },
        {
          id: 'job-type',
          title: 'Job Type',
          type: 'item',
          url: '/job-type',
          icon: icons.faPeopleArrows
        },
        {
          id: 'worklevel',
          title: 'Work Level',
          type: 'item',
          url: '/worklevel',
          icon: icons.faArrowUpAZ
        },
        {
          id: 'cost-center',
          title: 'Cost Center',
          type: 'item',
          url: '/cost-center',
          icon: icons.faCircleDollarToSlot
        },
        {
          id: 'allow-type',
          title: 'Allow Type',
          type: 'item',
          url: '/allow-type',
          icon: icons.faHandHoldingDollar
        },
        {
          id: 'other-list',
          title: 'Other List',
          type: 'item',
          url: '/other-list',
          icon: icons.faLayerGroup
        }
      ]
    }
  ]
};

export default listMenu;
