
import Login from '@/panel/restaurant/Login';
import Dashboard from '@/panel/restaurant/dasboard/Dasborad';
import Setting from '@/panel/restaurant/setting/index';
import Profile from '@/panel/restaurant/profile/index';
import Layout from "@/panel/restaurant/common/layout";
import AllOrders from '@/panel/restaurant/orders/AllOrders';
import PendingOrders from '@/panel/restaurant/orders/PendingOrders';
import ProcessingOrders from '@/panel/restaurant/orders/ProcessingOrders';
import CanceledOrders from '@/panel/restaurant/orders/CanceledOrders';
import DeliveredOrders from '@/panel/restaurant/orders/DeliveredOrders';
import OrderRow from '@/panel/restaurant/details/OrderRow';
import Invoice from '@/panel/restaurant/invoice/Invoice';
import AllInventory from '@/panel/restaurant/inventory/Allinventory';
import AddMenuItem from '@/panel/restaurant/inventory/AddMenuItem';
import BulkExport from '@/panel/restaurant/inventory/Bulkexport';
import BulkImport from '@/panel/restaurant/inventory/Bulkimport';

import AllPos from '@/panel/restaurant/pos/AllPos';

import Addons from '@/panel/restaurant/inventory/Addons';
import AddonsTable from '@/panel/restaurant/inventory/AddonsTable';
import EditOrder from '@/panel/restaurant/orders/EditOrder';
import Coupon from '@/panel/restaurant/coupon/Coupon';
import Feedback from '@/panel/restaurant/feedback/Feedback';
import Report from '@/panel/restaurant/ReportAndAnalytics/report'

const panelRestaurantRoutes = [
  
    {
      path: '/restaurant/login',
      element: <Login />,
  },{
      path: '/restaurant',
      element: <Layout />, // Use Layout for all restaurant routes
      children: [
         
          {
              path: 'dashboard',
              element: <Dashboard />,
          },
          {
              path: 'report',
              element: <Report/>,
          },
          {
              path: 'setting',
              element: <Setting />,
          },
          {
              path: 'profile',
              element: <Profile />,
          },
          {
              path: 'order/all',
              element: <AllOrders />
                  
          },
          {
              path: 'order/preparing',
              element: <PendingOrders />

          },
          {
              path: 'order/processing',
              element: <ProcessingOrders />

          },
          {
              path: 'order/cancel',
              element: <CanceledOrders />

          },
          {
              path: 'pos/edit_order/:id_edit_order',
              element: <AllPos />

          },
         
           {
              path: 'order/delivered',
              element: <DeliveredOrders />

          },
           {
              path: 'order/details/:id',
              element: <OrderRow />

          },
          
          {
              path: 'order/invoice/:id',
              element: <Invoice />

          },
          {
              path: 'inventory/all',
              element: <AllInventory />

          },
          {
              path: 'inventory/editmenu/:id',
              element: <AddMenuItem />

          },
          {
              path: 'inventory/addmenu',
              element: <AddMenuItem />

          },
          {
              path: 'inventory/addons',
              element: <Addons />

          },
          {
              path: 'inventory/edit_addons',
              element: <AddonsTable />

          },
        
          {
              path: 'inventory/export',
              element: <BulkExport />

          },
          {
              path: 'inventory/import',
              element: <BulkImport />

          },
          {
              path: 'pos/all',
              element: <AllPos />

          },
          
          {
              path: 'pos/edit_cart/:id',
              element: <AllPos />

          },
          {
              path: 'coupon/all',
              element: <Coupon />

          },
          {
              path: 'feedback',
              element: <Feedback />

          },


      ],
  },
];

  
export default panelRestaurantRoutes