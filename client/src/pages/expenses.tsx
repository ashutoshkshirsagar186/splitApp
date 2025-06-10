import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { api } from "@/lib/api";
import AddExpenseModal from "@/components/expense/add-expense-modal";
import ExpenseTable from "@/components/expense/expense-table";
import type { Expense } from "@/lib/types";

export default function Expenses() {
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const { data: expensesResponse, isLoading } = useQuery({
    queryKey: ["/api/expenses"],
    queryFn: () => api.expenses.getAll(),
  });

  const { data: peopleResponse } = useQuery({
    queryKey: ["/api/people"],
    queryFn: () => api.people.getAll(),
  });

  const expenses: Expense[] = expensesResponse?.data || [];
  const people = peopleResponse?.data || [];

  // Filter and sort expenses
  const filteredAndSortedExpenses = expenses
    .filter((expense) => {
      if (filterBy === "all") return true;
      return expense.paid_by === filterBy;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "amount-high":
          return parseFloat(b.amount) - parseFloat(a.amount);
        case "amount-low":
          return parseFloat(a.amount) - parseFloat(b.amount);
        default:
          return 0;
      }
    });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
        <Button onClick={() => setIsAddExpenseModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </div>

      {/* Expense Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Filter by:</label>
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All People" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All People</SelectItem>
                  {people.map((person) => (
                    <SelectItem key={person.name} value={person.name}>
                      {person.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Newest First" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="amount-high">Amount (High to Low)</SelectItem>
                  <SelectItem value="amount-low">Amount (Low to High)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expenses Table */}
      <ExpenseTable expenses={filteredAndSortedExpenses} />

      <AddExpenseModal 
        open={isAddExpenseModalOpen} 
        onOpenChange={setIsAddExpenseModalOpen} 
      />
    </div>
  );
}
