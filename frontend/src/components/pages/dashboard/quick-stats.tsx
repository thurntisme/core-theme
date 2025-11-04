import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toolCategories } from '@/constants/tools';

type Props = {};

const QuickStats = (props: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Active Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {toolCategories.reduce(
              (total, category) =>
                total +
                category.tools.filter((tool) => tool.status === 'active')
                  .length,
              0
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {toolCategories.reduce(
              (total, category) =>
                total +
                category.tools.filter((tool) => tool.status === 'coming-soon')
                  .length,
              0
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {toolCategories.reduce(
              (total, category) => total + category.tools.length,
              0
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickStats;
