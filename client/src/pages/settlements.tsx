import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InfoIcon, CheckCircle, History } from "lucide-react";
import { api } from "@/lib/api";
import type { SettlementSummary, Settlement } from "@/lib/types";

export default function Settlements() {
  const { data: settlementsResponse, isLoading } = useQuery({
    queryKey: ["/api/settlements"],
    queryFn: () => api.settlements.getSummary(),
  });

  const { data: historyResponse, isLoading: historyLoading } = useQuery({
    queryKey: ["/api/settlements/history"],
    queryFn: () => api.settlements.getHistory(),
  });

  const settlements: SettlementSummary[] = settlementsResponse?.data || [];
  const history: Settlement[] = historyResponse?.data || [];

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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Settlements</h1>
        <p className="text-gray-600">Optimized transactions to settle all debts with minimal transfers</p>
      </div>

      {/* Settlement Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Settlement Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {settlements.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">All settled up!</h3>
              <p className="text-gray-500">No pending settlements required.</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {settlements.map((settlement, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                        <span className="font-medium text-gray-700">
                          {settlement.from.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          <span className="text-red-600">{settlement.from}</span> owes{" "}
                          <span className="text-green-600">{settlement.to}</span>
                        </p>
                        <p className="text-sm text-gray-500">Settlement Payment</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-red-600">₹{settlement.amount.toFixed(2)}</p>
                      <Button variant="ghost" size="sm" className="text-primary hover:underline">
                        Mark as Paid
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <InfoIcon className="text-primary mr-2" size={20} />
                  <p className="text-sm text-blue-800">
                    <strong>Total settlements needed:</strong> {settlements.length} transaction{settlements.length !== 1 ? 's' : ''} to clear all debts
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Settlement History */}
      <Card>
        <CardHeader>
          <CardTitle>Settlement History</CardTitle>
        </CardHeader>
        <CardContent>
          {historyLoading ? (
            <div className="animate-pulse">
              <div className="h-16 bg-gray-200 rounded mb-3"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <History className="mx-auto h-12 w-12 mb-4" />
              <p>No settlement history available</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((settlement) => (
                <div key={settlement.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <CheckCircle className="text-green-600" size={16} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {settlement.from_person} paid {settlement.to_person}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(settlement.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="font-semibold text-green-600">₹{parseFloat(settlement.amount).toFixed(2)}</p>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Settled
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
