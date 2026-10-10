croppay-frontend/
├── public/
├── src/
│   ├── api/
│   │   ├── axiosClient.js
│   │   ├── auth.api.js
│   │   ├── goals.api.js
│   │   ├── payments.api.js            # deposits + transactions
│   │   ├── sales.api.js
│   │   ├── notifications.api.js
│   │   ├── profile.api.js             # (new)
│   │   └── admin.api.js               # (new)
│   │
│   ├── components/
│   │   ├── common/                    # Button, Input, Modal, Drawer, Toast,
│   │   │                              # ProgressBar, StatusBadge, Skeleton,
│   │   │                              # EmptyState, ConfirmDialog
│   │   ├── layout/                    # AppShell, Sidebar, BottomNav, Topbar,
│   │   │                              # AdminShell (new)
│   │   ├── goals/                     # GoalCard, GoalForm, GoalProgress,
│   │   │                              # GoalHistory, DepositModal
│   │   ├── sales/                     # SellForm, SubmissionCard
│   │   ├── transactions/              # TransactionTable, TransactionFilters,
│   │   │                              # TransactionDrawer
│   │   └── admin/                     # (new) StatCard, DataTable, StatusToggle
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useGoals.js
│   │   ├── useSales.js
│   │   ├── useMomoPayment.js          # deposit + status polling
│   │   └── useTransactions.js         # (new)
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── goals/                     # (new folder)
│   │   │   ├── Goals.jsx
│   │   │   ├── CreateGoal.jsx
│   │   │   └── GoalDetail.jsx         # edit goal opens from here
│   │   ├── sales/                     # (new folder)
│   │   │   ├── SellProduce.jsx
│   │   │   ├── MySubmissions.jsx
│   │   │   └── SubmissionDetail.jsx
│   │   ├── Transactions.jsx
│   │   ├── SmsInbox.jsx
│   │   ├── Profile.jsx
│   │   ├── admin/                     # (new)
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Farmers.jsx
│   │   │   ├── FarmerDetail.jsx
│   │   │   ├── AdminGoals.jsx
│   │   │   ├── AdminDeposits.jsx
│   │   │   ├── AdminSubmissions.jsx
│   │   │   ├── SmsLogs.jsx
│   │   │   └── Settings.jsx
│   │   ├── NotFound.jsx
│   │   ├── Forbidden.jsx              # (new)
│   │   └── ServerError.jsx            # (new)
│   │
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── AdminRoute.jsx             # (new) role check
│   │
│   ├── themes/
│   │   └── tokens.css
│   │
│   ├── utils/
│   │   ├── formatCurrency.js          # UGX
│   │   ├── formatDate.js
│   │   ├── phone.js                   # +256 normalization
│   │   └── constants.js               # statuses, categories
│   │
│   ├── validators/
│   │   ├── auth.schema.js
│   │   ├── goal.schema.js
│   │   ├── deposit.schema.js
│   │   └── sale.schema.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env                               # VITE_API_URL
├── biome.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── package.json