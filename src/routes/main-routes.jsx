import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import PrivateRoute from './private-route';
import Company from '../pages/organization/company/company';
import Department from '../pages/organization/department/department';
import Section from '../pages/organization/section/section';
import Organization from '../pages/organization/organization';
import Location from '../pages/location/location';
import FunctionRes from '../pages/function-res/function-res';
import Position from '../pages/position/position';
import Province from '../pages/province/province';
import City from '../pages/city/city';
import ContractType from '../pages/contract-type/contract-type';
import LeaveType from '../pages/leave-type/leave-type';
import JobType from '../pages/job-type/job-type';
import Worklevel from '../pages/worklevel/worklevel';
import CostCenter from '../pages/cost-center/cost-center';
import AllowType from '../pages/allow-type/allow-type';
import OtherList from '../pages/other-list/other-list';
import Employee from '../pages/employee/employee';
import TrainingProcess from '../pages/training-process/training-process';
import Allowance from '../pages/allowance/allowance';
import MovementSalary from '../pages/movement-salary/movement-salary';
import CasualLabor from '../pages/casual-labor/casual-labor';

// render- Dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));

// render - color
const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <PrivateRoute />, // Bọc toàn bộ route trong PrivateRoute
  children: [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: '/',
          element: <Organization />
        },
        {
          path: 'organization',
          element: <Organization />
        },
        {
          path: 'location',
          element: <Location />
        },
        {
          path: 'function',
          element: <FunctionRes />
        },
        {
          path: 'position',
          element: <Position />
        },
        {
          path: 'province',
          element: <Province />
        },
        {
          path: 'city',
          element: <City />
        },
        {
          path: 'contract-type',
          element: <ContractType />
        },
        {
          path: 'leave-type',
          element: <LeaveType />
        },
        {
          path: 'job-type',
          element: <JobType />
        },
        {
          path: 'worklevel',
          element: <Worklevel />
        },
        {
          path: 'cost-center',
          element: <CostCenter />
        },
        {
          path: 'allow-type',
          element: <AllowType />
        },
        {
          path: 'other-list',
          element: <OtherList />
        },
        {
          path: 'employee',
          element: <Employee />
        },
        {
          path: 'training-process',
          element: <TrainingProcess />
        },
        {
          path: 'allowance',
          element: <Allowance />
        },
        {
          path: 'movement-salary',
          element: <MovementSalary />
        },
        {
          path: 'casual-labor',
          element: <CasualLabor />
        },
        {
          path: 'dashboard',
          children: [
            {
              path: 'default',
              element: <DashboardDefault />
            }
          ]
        },
        // {
        //   path: 'company',
        //   element: <Company />
        // },
        // {
        //   path: 'department',
        //   element: <Department />
        // },
        // {
        //   path: 'section',
        //   element: <Section />
        // },
        {
          path: 'typography',
          element: <Typography />
        },
        {
          path: 'color',
          element: <Color />
        },
        {
          path: 'shadow',
          element: <Shadow />
        }
        // {
        //   path: 'sample-page',
        //   element: <SamplePage />
        // }
      ]
    }
  ]
};

export default MainRoutes;
