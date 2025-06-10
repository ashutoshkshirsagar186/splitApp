import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, ArrowRightLeft, Plus, Eye } from "lucide-react";
import { api } from "@/lib/api";
import { Link } from "wouter";
import { useState } from "react";
import AddExpenseModal from "@/components/expense/add-expense-modal";
import type { Expense, PersonBalance, SettlementSummary } from "@/lib/types";

export default function Dashboard() {
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);

  const { data: expensesResponse, isLoading: expensesLoading } = useQuery({
    queryKey: ["/api/expenses"],
    queryFn: () => api.expenses.getAll(),
  });

  const { data: balancesResponse, isLoading: balancesLoading } = useQuery({
    queryKey: ["/api/balances"],
    queryFn: () => api.balances.getAll(),
  });

  const { data: settlementsResponse, isLoading: settlementsLoading } = useQuery({
    queryKey: ["/api/settlements"],
    queryFn: () => api.settlements.getSummary(),
  });

  const expenses: Expense[] = expensesResponse?.data || [];
  const balances: PersonBalance[] = balancesResponse?.data || [];
  const settlements: SettlementSummary[] = settlementsResponse?.data || [];

  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  const totalPeople = balances.length;
  const pendingSettlements = settlements.length;

  const recentExpenses = expenses.slice(-3).reverse();

  if (expensesLoading || balancesLoading || settlementsLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Dashboard Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="text-primary text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalExpenses.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="text-green-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active People</p>
                <p className="text-2xl font-bold text-gray-900">{totalPeople}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-amber-100 rounded-lg">
                <ArrowRightLeft className="text-amber-500 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Settlements</p>
                <p className="text-2xl font-bold text-gray-900">{pendingSettlements}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Add Expense */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Add Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => setIsAddExpenseModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Expense
            </Button>
          </CardContent>
        </Card>

        {/* Recent Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            {recentExpenses.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No expenses yet</p>
            ) : (
              <div className="space-y-3">
                {recentExpenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <BarChart3 className="text-primary text-sm" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{expense.description}</p>
                        <p className="text-sm text-gray-500">Paid by {expense.paid_by}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-900">₹{parseFloat(expense.amount).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
            <Link href="/expenses">
              <Button variant="ghost" className="w-full mt-4">
                <Eye className="mr-2 h-4 w-4" />
                View All Expenses
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Current Balances Summary */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Current Balances</CardTitle>
        </CardHeader>
        <CardContent>
          {balances.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No balances available</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {balances.map((person) => (
                <div key={person.name} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                        <span className="font-medium text-gray-700">
                          {person.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <p className="font-medium text-gray-900">{person.name}</p>
                    </div>
                    <p className={`font-semibold ${
                      person.balance > 0 ? "text-green-600" : person.balance < 0 ? "text-red-600" : "text-gray-600"
                    }`}>
                      {person.balance > 0 ? "+" : ""}₹{Math.abs(person.balance).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddExpenseModal 
        open={isAddExpenseModalOpen} 
        onOpenChange={setIsAddExpenseModalOpen} 
      />
    </div>
  );
}
