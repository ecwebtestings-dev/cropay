import {
  Target,
  CircleDollarSign,
  TrendingUp,
  ShoppingCart,
} from "lucide-react";

import { formatMoney, formatNumber } from "../../utils/formatCurrency";

import { StatCard, SectionHeading } from "./Overviewstats";

export default function BusinessSummary({ goals = {}, sales = {} }) {
  return (
    <section>
      <SectionHeading
        title="Savings Goals & Product Sales"
        subtitle="Track farmers' targets and expected sales revenue"
      />

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Savings Goals"
          value={formatNumber(goals.total)}
          subtitle={`${formatNumber(goals.created_this_month)} created this month`}
          icon={Target}
        />

        <StatCard
          title="Target Amount"
          value={formatMoney(goals.total_target_amount)}
          subtitle="Combined savings goal targets"
          icon={CircleDollarSign}
        />

        <StatCard
          title="Average Goal"
          value={formatMoney(goals.average_target)}
          subtitle="Average target amount per goal"
          icon={TrendingUp}
        />

        <StatCard
          title="Product Sales"
          value={formatNumber(sales.total_sales_placed)}
          subtitle={`${formatNumber(sales.sales_this_month)} sales placed this month`}
          icon={ShoppingCart}
        />
      </div>

      
    </section>
  );
}
